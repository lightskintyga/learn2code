import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { Image, Plus } from 'lucide-react';

const BackdropSelector: React.FC = () => {
    const { currentProject } = useProjectStore();
    const { isStageSelected, selectStage, setShowBackdropLibrary } = useEditorStore();

    if (!currentProject) return null;

    const stage = currentProject.stage;
    const backdrop = stage.costumes[stage.currentBackdrop];

    return (
        <div
            onClick={selectStage}
            className={`cursor-pointer rounded-lg border-2 transition-all p-2 ${
                isStageSelected
                    ? 'border-scratch-blue bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
        >
            <div className="text-xs font-bold text-center mb-1">Сцена</div>

            {/* Превью фона */}
            <div className="w-16 h-12 mx-auto bg-white border border-gray-200 rounded overflow-hidden flex items-center justify-center">
                {backdrop ? (
                    <img
                        src={backdrop.dataUrl}
                        alt="Фон"
                        className="max-w-full max-h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <Image size={16} className="text-gray-300" />
                )}
            </div>

            <div className="text-[10px] text-center text-gray-500 mt-1">
                Фоны: {stage.costumes.length}
            </div>
        </div>
    );
};

export default BackdropSelector;