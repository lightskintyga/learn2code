import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { Plus, Upload, Paintbrush, Search } from 'lucide-react';

const SpriteList: React.FC = () => {
    const { currentProject, addSprite, removeSprite, duplicateSprite } = useProjectStore();
    const { selectedSpriteId, selectSprite, setShowSpriteLibrary } = useEditorStore();

    if (!currentProject) return null;

    const sprites = currentProject.sprites;

    const handleAddSprite = () => {
        const name = `Спрайт${sprites.length + 1}`;
        const id = addSprite({ name });
        selectSprite(id);
    };

    const handleContextMenu = (e: React.MouseEvent, spriteId: string) => {
        e.preventDefault();
        const action = window.confirm('Удалить спрайт?');
        if (action) {
            removeSprite(spriteId);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Список спрайтов */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-wrap gap-2 content-start">
                {sprites.map((sprite) => {
                    const costume = sprite.costumes[sprite.currentCostume];
                    const isSelected = selectedSpriteId === sprite.id;

                    return (
                        <div
                            key={sprite.id}
                            onClick={() => selectSprite(sprite.id)}
                            onContextMenu={(e) => handleContextMenu(e, sprite.id)}
                            className={`relative group ${
                                isSelected ? 'sprite-thumb-active' : 'sprite-thumb-inactive'
                            }`}
                        >
                            {/* Превью */}
                            <div className="w-full h-14 flex items-center justify-center overflow-hidden">
                                {costume && (
                                    <img
                                        src={costume.dataUrl}
                                        alt={sprite.name}
                                        className="max-w-full max-h-full object-contain"
                                        draggable={false}
                                    />
                                )}
                            </div>

                            {/* Имя */}
                            <div className="text-center text-[10px] font-medium truncate px-1 mt-1">
                                {sprite.name}
                            </div>

                            {/* Кнопка удаления */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSprite(sprite.id);
                                }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                ×
                            </button>

                            {/* Кнопка дублирования */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateSprite(sprite.id);
                                }}
                                className="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Дублировать"
                            >
                                ⊕
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Кнопки добавления */}
            <div className="border-t border-ui-border p-4 flex items-center justify-center gap-2 min-h-[76px]">
                <button
                    onClick={handleAddSprite}
                    className="w-11 h-11 bg-scratch-blue text-white rounded-full flex items-center justify-center hover:bg-scratch-blue-dark transition-colors shadow-md shrink-0"
                    title="Добавить спрайт"
                >
                    <Plus size={21} />
                </button>
            </div>
        </div>
    );
};

export default SpriteList;