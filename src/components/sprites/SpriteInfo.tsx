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
        <div className="bg-[#F8FAFB] rounded-[12px] p-3 text-sm">
            {/* Имя спрайта */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[#6B7280] text-xs font-medium">Спрайт</span>
                <input
                    type="text"
                    value={sprite.name}
                    onChange={(e) => updateSprite(sprite.id, { name: e.target.value })}
                    className="border border-[#E0E4EB] rounded-[8px] px-2 py-1 text-sm flex-1 font-medium bg-white focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                />
            </div>

            {/* Координаты - первая строка */}
            <div className="flex gap-2 mb-2">
                {/* X */}
                <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[#6B7280] text-xs whitespace-nowrap">Позиция X</span>
                    <input
                        type="number"
                        value={Math.round(sprite.x)}
                        onChange={(e) => updateSprite(sprite.id, { x: Number(e.target.value) })}
                        className="border border-[#E0E4EB] rounded-[6px] px-1.5 py-1 text-xs w-full text-center bg-white focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                    />
                </div>

                {/* Y */}
                <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[#6B7280] text-xs whitespace-nowrap">Позиция Y</span>
                    <input
                        type="number"
                        value={Math.round(sprite.y)}
                        onChange={(e) => updateSprite(sprite.id, { y: Number(e.target.value) })}
                        className="border border-[#E0E4EB] rounded-[6px] px-1.5 py-1 text-xs w-full text-center bg-white focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Размер и направление - вторая строка */}
            <div className="flex gap-2 mb-3">
                {/* Размер */}
                <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[#6B7280] text-xs whitespace-nowrap">Размер</span>
                    <input
                        type="number"
                        value={sprite.size}
                        onChange={(e) => updateSprite(sprite.id, { size: Number(e.target.value) })}
                        className="border border-[#E0E4EB] rounded-[6px] px-1.5 py-1 text-xs w-full text-center bg-white focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                    />
                </div>

                {/* Направление */}
                <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[#6B7280] text-xs whitespace-nowrap">Направл.</span>
                    <input
                        type="number"
                        value={Math.round(sprite.direction)}
                        onChange={(e) => updateSprite(sprite.id, { direction: Number(e.target.value) })}
                        className="border border-[#E0E4EB] rounded-[6px] px-1.5 py-1 text-xs w-full text-center bg-white focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Видимость */}
            <div className="flex items-center gap-2">
                <span className="text-[#6B7280] text-xs">Показать:</span>
                <button
                    onClick={() => updateSprite(sprite.id, { visible: true })}
                    className={`p-1 rounded ${sprite.visible ? 'bg-[#734DE6] text-white' : 'text-[#6B7280] hover:bg-gray-100'}`}
                >
                    <Eye size={16} />
                </button>
                <button
                    onClick={() => updateSprite(sprite.id, { visible: false })}
                    className={`p-1 rounded ${!sprite.visible ? 'bg-[#734DE6] text-white' : 'text-[#6B7280] hover:bg-gray-100'}`}
                >
                    <EyeOff size={16} />
                </button>
            </div>
        </div>
    );
};

export default SpriteInfo;
