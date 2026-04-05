import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useProjectStore } from '@/store/useProjectStore';
import { runtime } from '@/engine/Runtime';
import { Play, Square, Maximize2 } from 'lucide-react';

const StageControls: React.FC = () => {
    const { isRunning, setRunning, toggleFullscreen } = useEditorStore();
    const { currentProject } = useProjectStore();

    const handleStart = () => {
        if (currentProject) {
            runtime.loadProject(currentProject);
            runtime.start();
            setRunning(true);
        }
    };

    const handleStop = () => {
        runtime.stop();
        setRunning(false);
    };

    return (
        <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-1">
                {/* Зелёный флаг */}
                <button
                    onClick={handleStart}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isRunning
                            ? 'bg-green-100 text-green-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    title="Запустить (зелёный флаг)"
                >
                    <Play size={18} className="ml-0.5" />
                </button>

                {/* Красный стоп */}
                <button
                    onClick={handleStop}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        !isRunning
                            ? 'bg-red-100 text-red-400'
                            : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    title="Остановить"
                >
                    <Square size={14} fill="currentColor" />
                </button>
            </div>

            {/* Полноэкранный режим */}
            <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Полноэкранный режим"
            >
                <Maximize2 size={18} className="text-gray-500" />
            </button>
        </div>
    );
};

export default StageControls;