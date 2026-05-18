// Утилиты для конвертации между Project (внутренний формат редактора) и SceneStateDto (API формат)

import type { Project, SpriteTarget } from '@/types';
import type { SceneStateDto, SpriteStateDto, TaskConfigDto, SpriteType } from '@/services/api';

/**
 * Конвертирует SpriteTarget из Project во формат SpriteStateDto для API
 */
export function spriteToSpriteStateDto(sprite: SpriteTarget): SpriteStateDto {
    // Определяем тип спрайта по имени (или можно использовать другую логику)
    const spriteType = detectSpriteType(sprite.name);
    
    // Конвертируем координаты сцены в координаты сетки
    // Предполагаем, что сцена 480x360 (стандарт Scratch), сетка обычно меньше
    const gridX = Math.round((sprite.x + 240) / 30); // 30px на ячейку
    const gridY = Math.round((sprite.y + 180) / 30);
    
    return {
        type: spriteType,
        gridX: Math.max(0, gridX),
        gridY: Math.max(0, gridY),
        visible: sprite.visible,
    };
}

/**
 * Определяет тип спрайта по имени
 */
function detectSpriteType(name: string): SpriteType {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('cat') || lowerName.includes('кот')) return 'cat';
    if (lowerName.includes('apple') || lowerName.includes('яблоко')) return 'apple';
    if (lowerName.includes('wall') || lowerName.includes('стена')) return 'wall';
    return 'cat'; // По умолчанию
}

/**
 * Конвертирует Project во SceneStateDto для отправки на API
 */
export function projectToSceneStateDto(project: Project): SceneStateDto {
    const sprites: SpriteStateDto[] = project.sprites
        .filter(sprite => sprite.visible) // Только видимые спрайты
        .map(sprite => spriteToSpriteStateDto(sprite));
    
    return {
        sprites,
    };
}

/**
 * Создает TaskConfigDto из размеров сцены проекта
 */
export function projectToTaskConfigDto(project: Project): TaskConfigDto {
    // Стандартный размер сцены Scratch 480x360
    // Конвертируем в размер сетки (16x12 для стандартной ячейки 30px)
    return {
        gridWidth: 16,
        gridHeight: 12,
    };
}

/**
 * Создает начальное состояние (initialState) для нового задания
 * с котом в начальной позиции
 */
export function createDefaultInitialState(): SceneStateDto {
    return {
        sprites: [
            {
                type: 'cat',
                gridX: 0,
                gridY: 0,
                visible: true,
            },
        ],
    };
}

/**
 * Создает ожидаемое конечное состояние (expectedFinalState) по умолчанию
 */
export function createDefaultExpectedState(): SceneStateDto {
    return {
        sprites: [
            {
                type: 'cat',
                gridX: 5,
                gridY: 5,
                visible: true,
            },
        ],
    };
}

/**
 * Создает конфигурацию задания по умолчанию
 */
export function createDefaultTaskConfig(): TaskConfigDto {
    return {
        gridWidth: 10,
        gridHeight: 10,
    };
}

/**
 * Конвертирует SceneStateDto обратно в формат для отображения
 * (используется при загрузке задания из API)
 */
export function sceneStateDtoToDisplayInfo(sceneState: SceneStateDto): {
    sprites: Array<{
        type: string;
        x: number;
        y: number;
        visible: boolean;
    }>;
} {
    return {
        sprites: (sceneState.sprites || []).map(sprite => ({
            type: sprite.type,
            x: sprite.gridX,
            y: sprite.gridY,
            visible: sprite.visible,
        })),
    };
}

/**
 * Создает спрайт для редактора на основе типа и координат сетки
 */
export function createSpriteFromType(
    type: 'cat' | 'apple' | 'wall',
    gridX: number,
    gridY: number,
    id?: string
): { id: string; name: string; type: 'cat' | 'apple' | 'wall'; gridX: number; gridY: number; visible: boolean; emoji: string } {
    const spritesMap = {
        cat: { name: 'Кот', emoji: '🐱' },
        apple: { name: 'Яблоко', emoji: '🍎' },
        wall: { name: 'Стена', emoji: '🧱' },
    };
    
    const info = spritesMap[type];
    
    return {
        id: id || `${type}_${Date.now()}`,
        name: info.name,
        type,
        gridX,
        gridY,
        visible: true,
        emoji: info.emoji,
    };
}

/**
 * Конвертирует координаты сетки в координаты сцены
 */
export function gridToSceneCoordinates(gridX: number, gridY: number, config: TaskConfigDto): { x: number; y: number } {
    const cellWidth = 480 / config.gridWidth;
    const cellHeight = 360 / config.gridHeight;
    
    return {
        x: (gridX * cellWidth) - 240 + (cellWidth / 2),
        y: (gridY * cellHeight) - 180 + (cellHeight / 2),
    };
}

/**
 * Конвертирует координаты сцены в координаты сетки
 */
export function sceneToGridCoordinates(x: number, y: number, config: TaskConfigDto): { gridX: number; gridY: number } {
    const cellWidth = 480 / config.gridWidth;
    const cellHeight = 360 / config.gridHeight;
    
    return {
        gridX: Math.round((x + 240 - (cellWidth / 2)) / cellWidth),
        gridY: Math.round((y + 180 - (cellHeight / 2)) / cellHeight),
    };
}
