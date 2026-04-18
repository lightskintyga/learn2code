import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { useAuthStore } from '@/store/useAuthStore';
import TabBar from '@/components/editor/TabBar';
import BlocklyEditor from '@/components/editor/BlocklyEditor';
import CostumeEditor from '@/components/editor/CostumeEditor';
import SoundEditor from '@/components/editor/SoundEditor';
import StageCanvas from '@/components/stage/StageCanvas';
import SpriteList from '@/components/sprites/SpriteList';
import SpriteInfo from '@/components/sprites/SpriteInfo';
import BackdropSelector from '@/components/sprites/BackdropSelector';
import { ChevronLeft, Play, RotateCcw, CheckCircle, Lightbulb, Maximize2, Square, Plus } from 'lucide-react';
import { runtime } from '@/engine/Runtime';

// Категории блоков для левой панели (teacher mode)
const blockCategories = [
    { id: 'motion', name: 'Движение', color: '#3B82F6', colorClass: 'bg-blue-500' },
    { id: 'looks', name: 'Внешность', color: '#8B5CF6', colorClass: 'bg-violet-500' },
    { id: 'sound', name: 'Звук', color: '#EC4899', colorClass: 'bg-pink-500' },
    { id: 'events', name: 'События', color: '#F59E0B', colorClass: 'bg-amber-500' },
    { id: 'control', name: 'Управление', color: '#F97316', colorClass: 'bg-orange-500' },
    { id: 'sensing', name: 'Сенсоры', color: '#06B6D4', colorClass: 'bg-cyan-500' },
    { id: 'operators', name: 'Операторы', color: '#10B981', colorClass: 'bg-emerald-500' },
    { id: 'variables', name: 'Переменные', color: '#F97316', colorClass: 'bg-orange-500' },
];

// Интерфейс для пропсов EditorPage
interface EditorPageProps {
    // Teacher mode props
    isTeacherMode?: boolean;
    taskData?: {
        id: string;
        lessonTitle?: string;
        title: string;
        description: string;
        hint?: string;
        totalTasks?: number;
        currentTask?: number;
    };
    allowedBlocks?: string[];
    onSaveTask?: (data: any) => void;
    onRecordSolution?: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ 
    isTeacherMode = false,
    taskData: externalTaskData,
    allowedBlocks = [],
    onSaveTask,
    onRecordSolution
}) => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentProject, createProject } = useProjectStore();
    const { activeTab, selectedSpriteId, selectSprite, isRunning, setRunning, toggleFullscreen } = useEditorStore();
    const [showHint, setShowHint] = useState(true);
    
    // Teacher mode: выбор доступных категорий
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        allowedBlocks.length > 0 ? allowedBlocks : ['motion', 'events']
    );

    // Default task data for student mode
    const defaultTaskData = {
        id: '1-2-1',
        lessonTitle: 'Урок 2 · Задание 1',
        title: 'Кот идет к яблоку',
        description: 'Собери программу, чтобы кот дошел до яблока. Используй блок «идти 10 шагов» из категории «Движение».',
        hint: 'Начни с блока «когда ⚑ нажат» и добавь блок движения.',
        totalTasks: 4,
        currentTask: 1,
    };

    const taskData = externalTaskData || defaultTaskData;

    // Загружаем или создаём проект
    useEffect(() => {
        if (!currentProject && user) {
            createProject('Новый проект', user.id, user.displayName);
        }
    }, []);

    // Выбираем первый спрайт
    useEffect(() => {
        if (currentProject && !selectedSpriteId && currentProject.sprites.length > 0) {
            selectSprite(currentProject.sprites[0].id);
        }
    }, [currentProject?.id]);

    const handleStart = async () => {
        const project = useProjectStore.getState().currentProject;
        if (project) {
            runtime.loadProject(project);
            setRunning(true);
            try {
                await runtime.start();
            } catch (e) {
                console.error('Runtime error:', e);
            }
            setRunning(false);
            
            const finalState = runtime.getState();
            const { updateSprite } = useProjectStore.getState();
            for (const sprite of finalState.sprites) {
                updateSprite(sprite.id, { 
                    x: sprite.x, 
                    y: sprite.y,
                    direction: sprite.direction 
                });
            }
        }
    };

    const handleStop = () => {
        runtime.stop();
        setRunning(false);
        const project = useProjectStore.getState().currentProject;
        if (project) {
            runtime.loadProject(project);
        }
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    if (!currentProject) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-gray-400">Загрузка проекта...</div>
            </div>
        );
    }

    const renderEditorContent = () => {
        switch (activeTab) {
            case 'code':
                return <BlocklyEditor />;
            case 'costumes':
                return <CostumeEditor />;
            case 'sounds':
                return <SoundEditor />;
            default:
                return <BlocklyEditor />;
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4] flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">Назад</span>
                    </button>
                    <div className="h-6 w-px bg-[#EEF0F4]" />
                    <div>
                        {taskData.lessonTitle && (
                            <div className="text-sm text-[#734DE6] font-medium">
                                {taskData.totalTasks ? `Задание ${taskData.currentTask} из ${taskData.totalTasks}` : taskData.lessonTitle}
                            </div>
                        )}
                        <div className="text-sm text-[#1A1D2D] font-semibold">{taskData.title}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isTeacherMode && onRecordSolution && (
                        <button 
                            onClick={onRecordSolution}
                            className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Записать решение
                        </button>
                    )}
                    <button 
                        onClick={handleStart}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                            isRunning 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-[#734DE6] text-white hover:bg-[#5a3eb8]'
                        }`}
                    >
                        <Play className="w-4 h-4" />
                        {isRunning ? 'Выполняется...' : 'Запуск'}
                    </button>
                    <button 
                        onClick={handleStop}
                        className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Сбросить
                    </button>
                    <button 
                        onClick={() => onSaveTask?.({ categories: selectedCategories })}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {isTeacherMode ? 'Сохранить' : 'Проверить'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Task Description or Block Categories */}
                <div className="w-72 bg-white border-r border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    {isTeacherMode ? (
                        // Teacher Mode: Block Categories Selection
                        <>
                            <div className="p-4 border-b border-[#EEF0F4]">
                                <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные блоки</h3>
                                <p className="text-xs text-[#6B7280]">Выберите категории блоков, доступные ученику</p>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    {blockCategories.map((cat) => (
                                        <label 
                                            key={cat.id}
                                            className="flex items-center gap-3 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => handleCategoryToggle(cat.id)}
                                                className="w-4 h-4 rounded border-[#E0E4EB] text-[#734DE6] focus:ring-[#734DE6]"
                                            />
                                            <div className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
                                            <span className="text-sm text-[#1A1D2D]">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Student Mode: Task Description
                        <>
                            <div className="p-4 border-b border-[#EEF0F4]">
                                {taskData.totalTasks && (
                                    <div className="bg-[rgba(115,77,230,0.1)] text-[#734DE6] text-xs px-2 py-1 rounded-full inline-block mb-3">
                                        Задание {taskData.currentTask} из {taskData.totalTasks}
                                    </div>
                                )}
                                <h2 className="font-semibold text-[#1A1D2D] mb-2">{taskData.title}</h2>
                                <p className="text-sm text-[#6B7280] leading-relaxed">
                                    {taskData.description}
                                </p>
                            </div>
                            {showHint && taskData.hint && (
                                <div className="p-4 bg-amber-50 m-3 rounded-[12px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-medium text-amber-700">Подсказка</span>
                                    </div>
                                    <p className="text-sm text-amber-600">
                                        {taskData.hint}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Center - Blockly Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFB]">
                    <TabBar />
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-0">
                            {renderEditorContent()}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Stage & Sprites */}
                <div className="w-80 flex flex-col border-l border-[#EEF0F4] bg-white shrink-0">
                    {/* Stage Controls */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-[#EEF0F4]">
                        <div className="flex items-center gap-2">
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
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Полноэкранный режим"
                        >
                            <Maximize2 size={18} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Stage */}
                    <div className="p-4">
                        <div className="relative rounded-[16px] overflow-hidden border border-[#EEF0F4] shadow-sm" style={{ aspectRatio: '4/3' }}>
                            <StageCanvas />
                        </div>
                    </div>

                    {/* Sprite Info */}
                    <div className="px-4 py-2 border-t border-[#EEF0F4]">
                        <SpriteInfo />
                    </div>

                    {/* Sprites */}
                    <div className="flex-1 flex flex-col min-h-0 border-t border-[#EEF0F4]">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-[#6B7280] uppercase">Спрайты</h3>
                        </div>
                        <div className="flex-1 overflow-hidden px-4 pb-4">
                            <SpriteList />
                        </div>
                    </div>

                    {/* Backdrop */}
                    <div className="px-4 py-3 border-t border-[#EEF0F4]">
                        <h3 className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Сцена</h3>
                        <BackdropSelector />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
