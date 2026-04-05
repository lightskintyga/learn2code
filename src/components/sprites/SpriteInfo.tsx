import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { Eye, EyeOff } from 'lucide-react';

const SpriteInfo: React.FC = () => {
    const { currentProject, updateSprite } = useProjectStore();
    const { selectedSpriteId, isStageSelected } = useEditorStore();

    if (isStageSelected || !selectedSpriteId || !currentProject) return null;

    const sprite = currentProject.sprites.find(s => s.id === selectedSpriteId);
    if (!sprite) return null;

    return (
        <div className="bg-white border border-ui-border rounded-lg p-3 text-sm">
            <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Спрайт</span>
                    <input
                        type="text"
                        value={sprite.name}
                        onChange={(e) => updateSprite(sprite.id, { name: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-28 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">↔ x</span>
                    <input
                        type="number"
                        value={Math.round(sprite.x)}
                        onChange={(e) => updateSprite(sprite.id, { x: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-16 text-center"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">↕ y</span>
                    <input
                        type="number"
                        value={Math.round(sprite.y)}
                        onChange={(e) => updateSprite(sprite.id, { y: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-16 text-center"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Показать</span>
                    <button
                        onClick={() => updateSprite(sprite.id, { visible: true })}
                        className={`p-1 rounded ${sprite.visible ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => updateSprite(sprite.id, { visible: false })}
                        className={`p-1 rounded ${!sprite.visible ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <EyeOff size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Размер</span>
                    <input
                        type="number"
                        value={sprite.size}
                        onChange={(e) => updateSprite(sprite.id, { size: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-16 text-center"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Направление</span>
                    <input
                        type="number"
                        value={Math.round(sprite.direction)}
                        onChange={(e) => updateSprite(sprite.id, { direction: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-0.5 text-sm w-16 text-center"
                    />
                </div>
            </div>
        </div>
    );
};

export default SpriteInfo;