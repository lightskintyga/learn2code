import * as Blockly from 'blockly';
import { javascriptGenerator } from '@/blockly/generators/javascript';
import { SpriteTarget, StageTarget, Project } from '@/types';
import { STAGE_WIDTH, STAGE_HEIGHT } from '@/utils/constants';

export interface RuntimeSprite {
    id: string;
    name: string;
    x: number;
    y: number;
    direction: number;
    size: number;
    visible: boolean;
    currentCostume: number;
    costumes: { name: string; dataUrl: string; width: number; height: number }[];
    rotationStyle: string;
    sayText: string;
    sayType: 'say' | 'think' | '';
    effects: Record<string, number>;
    volume: number;
    penDown: boolean;
    penColor: string;
    penSize: number;
    isClone: boolean;
}

export interface RuntimeState {
    sprites: RuntimeSprite[];
    stage: {
        currentBackdrop: number;
        costumes: { name: string; dataUrl: string }[];
        effects: Record<string, number>;
    };
    variables: Record<string, number | string>;
    lists: Record<string, (number | string)[]>;
    answer: string;
    timer: number;
    mouseX: number;
    mouseY: number;
    mouseDown: boolean;
    keysPressed: Set<string>;
    penLines: { x1: number; y1: number; x2: number; y2: number; color: string; size: number }[];
}

type EventHandler = () => Promise<void>;

export class Runtime {
    private state: RuntimeState;
    private running: boolean = false;
    private timerStart: number = Date.now();
    private eventHandlers: Map<string, EventHandler[]> = new Map();
    private activeThreads: Set<Promise<void>> = new Set();
    private onStateChange: ((state: RuntimeState) => void) | null = null;
    private animationFrameId: number | null = null;
    private yieldCounter: number = 0;
    private project: Project | null = null;

    constructor() {
        this.state = this.createInitialState();
    }

    private createInitialState(): RuntimeState {
        return {
            sprites: [],
            stage: {
                currentBackdrop: 0,
                costumes: [],
                effects: {},
            },
            variables: {},
            lists: {},
            answer: '',
            timer: 0,
            mouseX: 0,
            mouseY: 0,
            mouseDown: false,
            keysPressed: new Set(),
            penLines: [],
        };
    }

    loadProject(project: Project) {
        this.project = project;
        this.state = this.createInitialState();

        // Загружаем сцену
        this.state.stage = {
            currentBackdrop: project.stage.currentBackdrop,
            costumes: project.stage.costumes.map(c => ({
                name: c.name,
                dataUrl: c.dataUrl,
            })),
            effects: {},
        };

        // Загружаем спрайты
        this.state.sprites = project.sprites.map(s => this.spriteToRuntime(s));

        // Загружаем глобальные переменные
        Object.values(project.stage.variables).forEach(v => {
            this.state.variables[v.name] = v.value;
        });

        Object.values(project.stage.lists).forEach(l => {
            this.state.lists[l.name] = [...l.value];
        });

        this.notifyStateChange();
    }

    private spriteToRuntime(sprite: SpriteTarget): RuntimeSprite {
        return {
            id: sprite.id,
            name: sprite.name,
            x: sprite.x,
            y: sprite.y,
            direction: sprite.direction,
            size: sprite.size,
            visible: sprite.visible,
            currentCostume: sprite.currentCostume,
            costumes: sprite.costumes.map(c => ({
                name: c.name,
                dataUrl: c.dataUrl,
                width: c.width,
                height: c.height,
            })),
            rotationStyle: sprite.rotationStyle,
            sayText: '',
            sayType: '',
            effects: {},
            volume: sprite.volume,
            penDown: false,
            penColor: '#0000FF',
            penSize: 1,
            isClone: false,
        };
    }

    setOnStateChange(callback: (state: RuntimeState) => void) {
        this.onStateChange = callback;
    }

    private notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange({ ...this.state });
        }
    }

    getState(): RuntimeState {
        return this.state;
    }

    isRunning(): boolean {
        return this.running;
    }

    // Запуск по зелёному флагу — неблокирующий
    start(): Promise<void> {
        return new Promise((resolve) => {
            this.running = true;
            this.timerStart = Date.now();
            this.eventHandlers.clear();
            this.activeThreads.clear();

            if (this.project) {
                this.registerProjectScripts(this.project);
            }

            // Запускаем обработчики зелёного флага
            const handlers = this.eventHandlers.get('flag_clicked') || [];
            for (const handler of handlers) {
                const thread = handler().catch(e => console.error('Thread error:', e));
                this.activeThreads.add(thread);
                thread.finally(() => {
                    this.activeThreads.delete(thread);
                    // Когда все потоки завершены, останавливаем
                    if (this.activeThreads.size === 0 && this.running) {
                        this.stop();
                        resolve();
                    }
                });
            }

            this.startRenderLoop();
            this.notifyStateChange();
            
            // Если нет обработчиков, сразу резолвим
            if (handlers.length === 0) {
                resolve();
            }
        });
    }

    stop() {
        this.running = false;
        this.activeThreads.clear();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Очищаем текст
        this.state.sprites.forEach(s => {
            s.sayText = '';
            s.sayType = '';
        });

        this.notifyStateChange();
    }

    private startRenderLoop() {
        const loop = () => {
            if (!this.running) return;
            this.state.timer = (Date.now() - this.timerStart) / 1000;
            this.notifyStateChange();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    // Yield для кооперативной многозадачности
    async yield() {
        this.yieldCounter++;
        if (this.yieldCounter % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        if (!this.running) throw new Error('Runtime stopped');
    }

    async wait(seconds: number) {
        const end = Date.now() + seconds * 1000;
        while (Date.now() < end && this.running) {
            await new Promise(resolve => setTimeout(resolve, 16));
        }
        if (!this.running) throw new Error('Runtime stopped');
    }

    // Регистрация обработчиков событий
    onFlagClicked(handler: EventHandler) {
        const handlers = this.eventHandlers.get('flag_clicked') || [];
        handlers.push(handler);
        this.eventHandlers.set('flag_clicked', handlers);
    }

    private registerProjectScripts(project: Project) {
        const registerTarget = (blocksXml: string, spriteId: string) => {
            if (!blocksXml) return;
            try {
                const xml = Blockly.utils.xml.textToDom(blocksXml);
                const workspace = new Blockly.Workspace();
                Blockly.Xml.domToWorkspace(xml, workspace);
                const code = javascriptGenerator.workspaceToCode(workspace);
                workspace.dispose();
                if (code.trim()) {
                    this.executeGeneratedCode(code, spriteId);
                }
            } catch (e) {
                console.error('Failed to register project scripts:', e);
            }
        };

        registerTarget(project.stage.blocks, project.stage.id);
        project.sprites.forEach(sprite => registerTarget(sprite.blocks, sprite.id));
    }

    private executeGeneratedCode(code: string, spriteId: string) {
        try {
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => (...fnArgs: unknown[]) => Promise<void>;
            const runtime = this;
            const sprite = this.getSpriteApi(spriteId);
            const stage = this.getStageApi();
            if (!sprite || !stage) return;

            const fn = new AsyncFunction('runtime', 'sprite', 'stage', code);
            const thread = fn(runtime, sprite, stage).catch(e => console.error('Generated code error:', e));
            this.activeThreads.add(thread);
            thread.finally(() => this.activeThreads.delete(thread));
        } catch (e) {
            console.error('Failed to execute generated code:', e);
        }
    }

    private getStageApi() {
        const runtime = this;
        return {
            get currentBackdrop() { return runtime.state.stage.currentBackdrop; },
            switchBackdropTo(name: string) {
                const idx = runtime.project?.stage.costumes.findIndex(c => c.name === name) ?? -1;
                if (idx !== -1) {
                    runtime.state.stage.currentBackdrop = idx;
                    runtime.notifyStateChange();
                }
            },
            nextBackdrop() {
                const count = runtime.project?.stage.costumes.length || 0;
                if (count > 0) {
                    runtime.state.stage.currentBackdrop = (runtime.state.stage.currentBackdrop + 1) % count;
                    runtime.notifyStateChange();
                }
            },
            backdrop: {
                get number() { return runtime.state.stage.currentBackdrop + 1; },
                get name() { return runtime.project?.stage.costumes[runtime.state.stage.currentBackdrop]?.name || ''; },
            },
        };
    }

    onKeyPressed(key: string, handler: EventHandler) {
        const handlers = this.eventHandlers.get(`key_${key}`) || [];
        handlers.push(handler);
        this.eventHandlers.set(`key_${key}`, handlers);
    }

    onSpriteClicked(spriteId: string, handler: EventHandler) {
        const handlers = this.eventHandlers.get(`sprite_click_${spriteId}`) || [];
        handlers.push(handler);
        this.eventHandlers.set(`sprite_click_${spriteId}`, handlers);
    }

    onBroadcastReceived(message: string, handler: EventHandler) {
        const handlers = this.eventHandlers.get(`broadcast_${message}`) || [];
        handlers.push(handler);
        this.eventHandlers.set(`broadcast_${message}`, handlers);
    }

    broadcast(message: string) {
        const handlers = this.eventHandlers.get(`broadcast_${message}`) || [];
        for (const handler of handlers) {
            handler().catch(e => console.error('Broadcast handler error:', e));
        }
    }

    async broadcastAndWait(message: string) {
        const handlers = this.eventHandlers.get(`broadcast_${message}`) || [];
        await Promise.all(handlers.map(h => h()));
    }

    // Обработка ввода
    handleKeyDown(key: string) {
        this.state.keysPressed.add(key);
        if (this.running) {
            const handlers = this.eventHandlers.get(`key_${key}`) || [];
            const anyHandlers = this.eventHandlers.get('key_any') || [];
            [...handlers, ...anyHandlers].forEach(h => h().catch(console.error));
        }
    }

    handleKeyUp(key: string) {
        this.state.keysPressed.delete(key);
    }

    handleMouseMove(x: number, y: number) {
        this.state.mouseX = x;
        this.state.mouseY = y;
    }

    handleMouseDown() {
        this.state.mouseDown = true;
    }

    handleMouseUp() {
        this.state.mouseDown = false;
    }

    handleSpriteClick(spriteId: string) {
        if (this.running) {
            const handlers = this.eventHandlers.get(`sprite_click_${spriteId}`) || [];
            handlers.forEach(h => h().catch(console.error));
        }
    }

    // API для спрайтов
    getSpriteApi(spriteId: string) {
        const sprite = this.state.sprites.find(s => s.id === spriteId);
        if (!sprite) return null;

        const runtime = this;

        return {
            get x() { return sprite.x; },
            get y() { return sprite.y; },
            get direction() { return sprite.direction; },
            get size() { return sprite.size; },
            get visible() { return sprite.visible; },
            get volume() { return sprite.volume; },

            costume: {
                get number() { return sprite.currentCostume + 1; },
                get name() { return sprite.costumes[sprite.currentCostume]?.name || ''; },
            },

            move(steps: number) {
                const rad = (sprite.direction - 90) * Math.PI / 180;
                sprite.x += steps * Math.cos(rad);
                sprite.y += steps * Math.sin(rad);
                runtime.notifyStateChange();
            },

            turnRight(degrees: number) {
                sprite.direction = (sprite.direction + degrees) % 360;
                runtime.notifyStateChange();
            },

            turnLeft(degrees: number) {
                sprite.direction = (sprite.direction - degrees + 360) % 360;
                runtime.notifyStateChange();
            },

            goToXY(x: number, y: number) {
                sprite.x = x;
                sprite.y = y;
                runtime.notifyStateChange();
            },

            goTo(target: string) {
                if (target === '_random_') {
                    sprite.x = Math.random() * STAGE_WIDTH - STAGE_WIDTH / 2;
                    sprite.y = Math.random() * STAGE_HEIGHT - STAGE_HEIGHT / 2;
                } else if (target === '_mouse_') {
                    sprite.x = runtime.state.mouseX;
                    sprite.y = runtime.state.mouseY;
                }
                runtime.notifyStateChange();
            },

            async glideToXY(secs: number, x: number, y: number) {
                const startX = sprite.x;
                const startY = sprite.y;
                const startTime = Date.now();
                const duration = secs * 1000;

                while (Date.now() - startTime < duration && runtime.running) {
                    const progress = (Date.now() - startTime) / duration;
                    sprite.x = startX + (x - startX) * progress;
                    sprite.y = startY + (y - startY) * progress;
                    runtime.notifyStateChange();
                    await new Promise(resolve => setTimeout(resolve, 16));
                }

                sprite.x = x;
                sprite.y = y;
                runtime.notifyStateChange();
            },

            async glideTo(secs: number, target: string) {
                let targetX = 0, targetY = 0;
                if (target === '_random_') {
                    targetX = Math.random() * STAGE_WIDTH - STAGE_WIDTH / 2;
                    targetY = Math.random() * STAGE_HEIGHT - STAGE_HEIGHT / 2;
                } else if (target === '_mouse_') {
                    targetX = runtime.state.mouseX;
                    targetY = runtime.state.mouseY;
                }
                await this.glideToXY(secs, targetX, targetY);
            },

            pointInDirection(dir: number) {
                sprite.direction = dir;
                runtime.notifyStateChange();
            },

            pointTowards(target: string) {
                let targetX = 0, targetY = 0;
                if (target === '_mouse_') {
                    targetX = runtime.state.mouseX;
                    targetY = runtime.state.mouseY;
                }
                const dx = targetX - sprite.x;
                const dy = targetY - sprite.y;
                sprite.direction = 90 + Math.atan2(-dy, dx) * 180 / Math.PI;
                runtime.notifyStateChange();
            },

            changeX(dx: number) {
                sprite.x += dx;
                runtime.notifyStateChange();
            },

            setX(x: number) {
                sprite.x = x;
                runtime.notifyStateChange();
            },

            changeY(dy: number) {
                sprite.y += dy;
                runtime.notifyStateChange();
            },

            setY(y: number) {
                sprite.y = y;
                runtime.notifyStateChange();
            },

            ifOnEdgeBounce() {
                const halfW = STAGE_WIDTH / 2;
                const halfH = STAGE_HEIGHT / 2;
                if (sprite.x > halfW || sprite.x < -halfW) {
                    sprite.direction = -sprite.direction + 180;
                    sprite.x = Math.max(-halfW, Math.min(halfW, sprite.x));
                }
                if (sprite.y > halfH || sprite.y < -halfH) {
                    sprite.direction = -sprite.direction;
                    sprite.y = Math.max(-halfH, Math.min(halfH, sprite.y));
                }
                runtime.notifyStateChange();
            },

            setRotationStyle(style: string) {
                sprite.rotationStyle = style;
                runtime.notifyStateChange();
            },

            // Внешний вид
            say(message: string) {
                sprite.sayText = String(message);
                sprite.sayType = 'say';
                runtime.notifyStateChange();
            },

            async sayForSecs(message: string, secs: number) {
                sprite.sayText = String(message);
                sprite.sayType = 'say';
                runtime.notifyStateChange();
                await runtime.wait(secs);
                sprite.sayText = '';
                sprite.sayType = '';
                runtime.notifyStateChange();
            },

            think(message: string) {
                sprite.sayText = String(message);
                sprite.sayType = 'think';
                runtime.notifyStateChange();
            },

            async thinkForSecs(message: string, secs: number) {
                sprite.sayText = String(message);
                sprite.sayType = 'think';
                runtime.notifyStateChange();
                await runtime.wait(secs);
                sprite.sayText = '';
                sprite.sayType = '';
                runtime.notifyStateChange();
            },

            switchCostumeTo(name: string) {
                const idx = sprite.costumes.findIndex(c => c.name === name);
                if (idx !== -1) {
                    sprite.currentCostume = idx;
                    runtime.notifyStateChange();
                }
            },

            nextCostume() {
                sprite.currentCostume = (sprite.currentCostume + 1) % sprite.costumes.length;
                runtime.notifyStateChange();
            },

            changeSizeBy(change: number) {
                sprite.size = Math.max(5, sprite.size + change);
                runtime.notifyStateChange();
            },

            setSizeTo(size: number) {
                sprite.size = Math.max(5, size);
                runtime.notifyStateChange();
            },

            changeEffectBy(effect: string, change: number) {
                sprite.effects[effect] = (sprite.effects[effect] || 0) + change;
                runtime.notifyStateChange();
            },

            setEffectTo(effect: string, value: number) {
                sprite.effects[effect] = value;
                runtime.notifyStateChange();
            },

            clearGraphicEffects() {
                sprite.effects = {};
                runtime.notifyStateChange();
            },

            show() {
                sprite.visible = true;
                runtime.notifyStateChange();
            },

            hide() {
                sprite.visible = false;
                runtime.notifyStateChange();
            },

            goToLayer(layer: string) {
                // Simplified layer management
                runtime.notifyStateChange();
            },

            goForwardBackwardLayers(direction: string, num: number) {
                runtime.notifyStateChange();
            },

            // Звук
            async playSoundUntilDone(name: string) {
                // TODO: Реализовать воспроизведение звука
                await runtime.wait(0.5);
            },

            playSound(name: string) {
                // TODO: Реализовать воспроизведение звука
            },

            changeVolumeBy(change: number) {
                sprite.volume = Math.max(0, Math.min(100, sprite.volume + change));
                runtime.notifyStateChange();
            },

            setVolumeTo(vol: number) {
                sprite.volume = Math.max(0, Math.min(100, vol));
                runtime.notifyStateChange();
            },

            // Сенсоры
            isTouching(target: string): boolean {
                if (target === '_edge_') {
                    return Math.abs(sprite.x) > STAGE_WIDTH / 2 - 10 ||
                        Math.abs(sprite.y) > STAGE_HEIGHT / 2 - 10;
                }
                if (target === '_mouse_') {
                    const dx = sprite.x - runtime.state.mouseX;
                    const dy = sprite.y - runtime.state.mouseY;
                    return Math.sqrt(dx * dx + dy * dy) < 30;
                }
                return false;
            },
        };
    }

    // Глобальные API
    random(from: number, to: number): number {
        if (from === Math.floor(from) && to === Math.floor(to)) {
            return Math.floor(Math.random() * (to - from + 1)) + from;
        }
        return Math.random() * (to - from) + from;
    }

    isKeyPressed(key: string): boolean {
        if (key === 'any') return this.state.keysPressed.size > 0;
        const keyMap: Record<string, string> = {
            'space': ' ',
            'up arrow': 'ArrowUp',
            'down arrow': 'ArrowDown',
            'left arrow': 'ArrowLeft',
            'right arrow': 'ArrowRight',
        };
        return this.state.keysPressed.has(keyMap[key] || key);
    }

    isMouseDown(): boolean {
        return this.state.mouseDown;
    }

    get mouseX() { return this.state.mouseX; }
    get mouseY() { return this.state.mouseY; }
    get answer() { return this.state.answer; }

    timer(): number {
        return this.state.timer;
    }

    resetTimer() {
        this.timerStart = Date.now();
        this.state.timer = 0;
    }

    current(what: string): number {
        const now = new Date();
        switch (what) {
            case 'YEAR': return now.getFullYear();
            case 'MONTH': return now.getMonth() + 1;
            case 'DATE': return now.getDate();
            case 'DAYOFWEEK': return now.getDay() + 1;
            case 'HOUR': return now.getHours();
            case 'MINUTE': return now.getMinutes();
            case 'SECOND': return now.getSeconds();
            default: return 0;
        }
    }

    async askAndWait(question: string) {
        const answer = prompt(question) || '';
        this.state.answer = answer;
    }

    getVariable(name: string): number | string {
        return this.state.variables[name] ?? 0;
    }

    setVariable(name: string, value: number | string) {
        this.state.variables[name] = value;
        this.notifyStateChange();
    }

    changeVariableBy(name: string, change: number) {
        const current = Number(this.state.variables[name]) || 0;
        this.state.variables[name] = current + change;
        this.notifyStateChange();
    }

    stopAllSounds() {
        // TODO: Остановить все звуки
    }

    createClone(target: string) {
        // TODO: Реализовать клонирование
    }

    deleteThisClone() {
        // TODO: Реализовать удаление клона
    }

    get username() {
        return 'user'; // TODO: Получить из auth store
    }
}

// Синглтон
export const runtime = new Runtime();