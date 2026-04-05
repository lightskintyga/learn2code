import React, { useRef, useEffect, useCallback } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime, RuntimeState, RuntimeSprite } from '@/engine/Runtime';
import { STAGE_WIDTH, STAGE_HEIGHT } from '@/utils/constants';

const StageCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { currentProject } = useProjectStore();
    const { isRunning } = useEditorStore();
    const [runtimeState, setRuntimeState] = React.useState<RuntimeState | null>(null);
    const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

    // Подписка на обновления runtime
    useEffect(() => {
        runtime.setOnStateChange((state) => {
            setRuntimeState(state);
        });

        return () => {
            runtime.setOnStateChange(() => {});
        };
    }, []);

    // Загружаем проект в runtime
    useEffect(() => {
        if (currentProject) {
            runtime.loadProject(currentProject);
        }
    }, [currentProject?.id]);

    // Загрузка изображения с кешированием
    const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
        if (imageCache.current.has(src)) {
            return Promise.resolve(imageCache.current.get(src)!);
        }
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache.current.set(src, img);
                resolve(img);
            };
            img.onerror = () => resolve(img);
            img.src = src;
        });
    }, []);

    // Рендеринг сцены
    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = runtimeState || runtime.getState();
        const project = currentProject;
        if (!project) return;

        // Очищаем
        ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

        // Рисуем фон
        const backdrop = project.stage.costumes[project.stage.currentBackdrop];
        if (backdrop) {
            try {
                const bgImg = await loadImage(backdrop.dataUrl);
                ctx.drawImage(bgImg, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            } catch {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            }
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        }

        // Определяем спрайты для рисования
        const spritesToDraw = isRunning && state.sprites.length > 0
            ? state.sprites
            : project.sprites.map(s => ({
                id: s.id,
                name: s.name,
                x: s.x,
                y: s.y,
                direction: s.direction,
                size: s.size,
                visible: s.visible,
                currentCostume: s.currentCostume,
                costumes: s.costumes.map(c => ({ name: c.name, dataUrl: c.dataUrl, width: c.width, height: c.height })),
                rotationStyle: s.rotationStyle,
                sayText: '',
                sayType: '' as const,
                effects: {},
                volume: s.volume,
                penDown: false,
                penColor: '#0000FF',
                penSize: 1,
                isClone: false,
            }));

        // Рисуем спрайты
        for (const sprite of spritesToDraw) {
            if (!sprite.visible) continue;

            const costume = sprite.costumes[sprite.currentCostume];
            if (!costume) continue;

            try {
                const img = await loadImage(costume.dataUrl);

                ctx.save();

                // Конвертируем координаты Scratch в координаты Canvas
                // Scratch: центр (0,0), x вправо, y вверх
                // Canvas: верхний левый (0,0), x вправо, y вниз
                const canvasX = STAGE_WIDTH / 2 + sprite.x;
                const canvasY = STAGE_HEIGHT / 2 - sprite.y;

                ctx.translate(canvasX, canvasY);

                // Вращение
                const scale = sprite.size / 100;
                if (sprite.rotationStyle === 'all around') {
                    ctx.rotate(((sprite.direction - 90) * Math.PI) / 180);
                } else if (sprite.rotationStyle === 'left-right') {
                    if (sprite.direction < 0 || sprite.direction > 180) {
                        ctx.scale(-1, 1);
                    }
                }
                // 'don\'t rotate' — не вращаем

                ctx.scale(scale, scale);

                // Эффекты
                if (sprite.effects.GHOST) {
                    ctx.globalAlpha = 1 - Math.min(100, Math.max(0, sprite.effects.GHOST)) / 100;
                }

                // Рисуем спрайт по центру
                const drawW = costume.width;
                const drawH = costume.height;
                ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

                ctx.restore();

                // Рисуем облачко с текстом
                if (sprite.sayText) {
                    drawSpeechBubble(ctx, canvasX, canvasY - (costume.height * scale) / 2 - 10, sprite.sayText, sprite.sayType as 'say' | 'think');
                }
            } catch (e) {
                // Если не удалось загрузить изображение
            }
        }
    }, [runtimeState, currentProject, isRunning, loadImage]);

    // Перерисовка
    useEffect(() => {
        render();
    }, [render]);

    // Обработка мыши
    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = STAGE_WIDTH / rect.width;
        const scaleY = STAGE_HEIGHT / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX - STAGE_WIDTH / 2;
        const mouseY = STAGE_HEIGHT / 2 - (e.clientY - rect.top) * scaleY;

        runtime.handleMouseMove(mouseX, mouseY);
    };

    const handleMouseDown = () => runtime.handleMouseDown();
    const handleMouseUp = () => runtime.handleMouseUp();

    const handleClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = STAGE_WIDTH / rect.width;
        const scaleY = STAGE_HEIGHT / rect.height;

        const clickX = (e.clientX - rect.left) * scaleX - STAGE_WIDTH / 2;
        const clickY = STAGE_HEIGHT / 2 - (e.clientY - rect.top) * scaleY;

        // Проверяем клик по спрайтам
        const project = currentProject;
        if (!project) return;

        for (const sprite of [...project.sprites].reverse()) {
            if (!sprite.visible) continue;
            const costume = sprite.costumes[sprite.currentCostume];
            if (!costume) continue;

            const scale = sprite.size / 100;
            const halfW = (costume.width * scale) / 2;
            const halfH = (costume.height * scale) / 2;

            if (
                clickX >= sprite.x - halfW &&
                clickX <= sprite.x + halfW &&
                clickY >= sprite.y - halfH &&
                clickY <= sprite.y + halfH
            ) {
                runtime.handleSpriteClick(sprite.id);
                break;
            }
        }
    };

    // Клавиатура
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyMap: Record<string, string> = {
                'ArrowUp': 'up arrow',
                'ArrowDown': 'down arrow',
                'ArrowLeft': 'left arrow',
                'ArrowRight': 'right arrow',
                ' ': 'space',
            };
            runtime.handleKeyDown(keyMap[e.key] || e.key.toLowerCase());
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const keyMap: Record<string, string> = {
                'ArrowUp': 'up arrow',
                'ArrowDown': 'down arrow',
                'ArrowLeft': 'left arrow',
                'ArrowRight': 'right arrow',
                ' ': 'space',
            };
            runtime.handleKeyUp(keyMap[e.key] || e.key.toLowerCase());
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative bg-white rounded-lg overflow-hidden border border-ui-border">
            <canvas
                ref={canvasRef}
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                className="w-full h-full stage-canvas"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handleClick}
                tabIndex={0}
            />
        </div>
    );
};

// Функция рисования облачка
function drawSpeechBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    type: 'say' | 'think'
) {
    const padding = 10;
    const fontSize = 14;
    ctx.font = `${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const bubbleWidth = textWidth + padding * 2;
    const bubbleHeight = fontSize + padding * 2;

    const bubbleX = x - bubbleWidth / 2;
    const bubbleY = y - bubbleHeight - 15;

    // Фон
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 2;

    // Скруглённый прямоугольник
    const r = 10;
    ctx.beginPath();
    ctx.moveTo(bubbleX + r, bubbleY);
    ctx.lineTo(bubbleX + bubbleWidth - r, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + r);
    ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - r);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - r, bubbleY + bubbleHeight);
    ctx.lineTo(bubbleX + r, bubbleY + bubbleHeight);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - r);
    ctx.lineTo(bubbleX, bubbleY + r);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + r, bubbleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Хвостик
    if (type === 'say') {
        ctx.beginPath();
        ctx.moveTo(x - 5, bubbleY + bubbleHeight);
        ctx.lineTo(x, bubbleY + bubbleHeight + 10);
        ctx.lineTo(x + 5, bubbleY + bubbleHeight);
        ctx.fill();
        ctx.stroke();
    } else {
        // Думает — кружочки
        ctx.beginPath();
        ctx.arc(x, bubbleY + bubbleHeight + 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - 3, bubbleY + bubbleHeight + 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // Текст
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);
}

export default StageCanvas;