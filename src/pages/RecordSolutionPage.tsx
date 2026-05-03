import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime } from '@/engine/Runtime';
import { Loader2, ChevronLeft, Play, Square, Save, AlertCircle } from 'lucide-react';
import { toolboxConfig } from '@/blockly/toolbox';

// Категории блоков для выбора
const blockCategories = [
    { id: 'motion', name: 'Движение', color: '#3B82F6' },
    { id: 'looks', name: 'Внешность', color: '#8B5CF6' },
    { id: 'sound', name: 'Звук', color: '#EC4899' },
    { id: 'events', name: 'События', color: '#F59E0B' },
    { id: 'control', name: 'Управление', color: '#F97316' },
    { id: 'sensing', name: 'Сенсоры', color: '#06B6D4' },
    { id: 'operators', name: 'Операторы', color: '#10B981' },
    { id: 'variables', name: 'Переменные', color: '#F97316' },
];

// Фильтруем toolbox по выбранным категориям
const filterToolbox = (categories: string[]) => {
    const fullToolbox = JSON.parse(JSON.stringify(toolboxConfig));
    fullToolbox.contents = fullToolbox.contents.filter((cat: any) =>
        categories.some(c => cat.name.toLowerCase().includes(c.toLowerCase()) ||
        cat.name.toLowerCase().replace(/[^a-z]/g, '').includes(c.toLowerCase()))
    );
    return fullToolbox;
};

const RecordSolutionPage: React.FC = () => {
    const { courseId, lessonId, taskId } = useParams<{ courseId: string; lessonId: string; taskId: string }>();
    const navigate = useNavigate();
    const { addToast } = useToastStore();
    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTask, setIsLoadingTask] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [taskData, setTaskData] = useState<any>(null);

    const {
        currentTask,
        fetchTask,
        updateTask,
    } = useCourseStore();

    const { currentProject, createProject } = useProjectStore();
    const { isRunning, setRunning } = useEditorStore();

    // Blockly
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    // Загружаем задание
    useEffect(() => {
        if (taskId && taskId !== 'new') {
            setIsLoadingTask(true);
            fetchTask(taskId).then(() => {
                setIsLoadingTask(false);
            });
        } else {
            setIsLoadingTask(false);
        }
    }, [taskId, fetchTask]);

    // Загружаем выбранные категории из задания
    useEffect(() => {
        if (currentTask?.blockCategories) {
            setSelectedCategories(currentTask.blockCategories);
        }
    }, [currentTask]);

    // Инициализация Blockly после загрузки категорий
    useEffect(() => {
        if (!blocklyRef.current || workspaceRef.current || selectedCategories.length === 0) return;

        const toolbox = filterToolbox(selectedCategories);

        workspaceRef.current = Blockly.inject(blocklyRef.current, {
            toolbox: toolbox,
            theme: 'zelos',
            renderer: 'zelos',
            grid: {
                spacing: 40,
                length: 2,
                colour: '#DDD',
                snap: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.675,
                maxScale: 4,
                minScale: 0.25,
                scaleSpeed: 1.1,
            },
            trashcan: true,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true,
            },
        });

        // Загружаем сохраненное решение если есть
        const savedSolution = localStorage.getItem(`task_solution_${taskId}`);
        if (savedSolution) {
            try {
                const parser = new DOMParser();
                const xml = parser.parseFromString(savedSolution, 'text/xml');
                Blockly.Xml.domToWorkspace(xml.documentElement, workspaceRef.current);
            } catch (e) {
                console.error('Failed to load solution:', e);
            }
        }

        return () => {
            workspaceRef.current?.dispose();
            workspaceRef.current = null;
        };
    }, [selectedCategories, taskId]);

    // Инициализация проекта для сцены
    useEffect(() => {
        if (!currentProject) {
            createProject('Новый проект', 'teacher', 'Teacher');
        }
    }, [currentProject, createProject]);

    const handleStart = async () => {
        if (!currentProject || !workspaceRef.current) return;

        const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
        console.log('Generated code:', code);

        runtime.loadProject(currentProject);
        setRunning(true);
        await runtime.start();
        setRunning(false);
    };

    const handleStop = () => {
        runtime.stop();
        setRunning(false);
        if (currentProject) runtime.loadProject(currentProject);
    };

    const handleSaveSolution = () => {
        if (!workspaceRef.current || !taskId) return;

        setIsSaving(true);

        try {
            const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
            const xmlText = Blockly.Xml.domToText(xml);

            // Сохраняем в localStorage (временно, пока нет поля в API)
            localStorage.setItem(`task_solution_${taskId}`, xmlText);

            addToast('Эталонное решение сохранено', 'success');
            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/edit`);
        } catch (error) {
            addToast('Ошибка сохранения решения', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Проверяем валидность задания
    const isTaskValid = () => {
        if (!currentTask) return false;
        // Проверяем selectedCategories, так как они могут быть установлены из currentTask
        const hasCategories = selectedCategories.length > 0 || (currentTask.blockCategories && currentTask.blockCategories.length > 0);
        return (
            currentTask.title?.trim() &&
            currentTask.description?.trim() &&
            hasCategories
        );
    };

    // Показываем лоадер пока загружается задание
    if (isLoadingTask) {
        return (
            <div className="h-screen flex flex-col bg-[#F8FAFB]">
                <header className="bg-white border-b border-[#EEF0F4]">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm">Назад</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#734DE6] animate-spin" />
                        <span className="text-[#6B7280]">Загрузка задания...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!isTaskValid()) {
        return (
            <div className="h-screen flex flex-col bg-[#F8FAFB]">
                <header className="bg-white border-b border-[#EEF0F4]">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm">Назад</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-8 max-w-md text-center">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-amber-800 mb-2">
                            Нельзя записать решение
                        </h2>
                        <p className="text-amber-700 text-sm mb-4">
                            Перед записью решения необходимо заполнить:<br />
                            • Название задания<br />
                            • Описание задания<br />
                            • Выбрать хотя бы одну категорию блоков
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-[#734DE6] text-white rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors"
                        >
                            Вернуться к редактированию
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">← Запись эталонного решения</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                isRunning
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            <Play className="w-4 h-4" />
                            {isRunning ? 'Выполняется...' : 'Запуск'}
                        </button>
                        <button
                            onClick={handleStop}
                            className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Square className="w-4 h-4" />
                            Стоп
                        </button>
                        <button
                            onClick={handleSaveSolution}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Сохранить решение
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Blockly Workspace */}
                <div className="flex-1 p-4">
                    <div
                        ref={blocklyRef}
                        className="w-full h-full bg-white rounded-[16px] shadow-sm border border-[#EEF0F4]"
                    />
                </div>

                {/* Stage Preview */}
                <div className="w-80 bg-white border-l border-[#EEF0F4] p-4 flex flex-col">
                    <h3 className="text-sm font-semibold text-[#1A1D2D] mb-4">Сцена</h3>
                    <div className="bg-gradient-to-br from-[#E0F2FE] to-[#F0FDF4] rounded-[16px] aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-[#EEF0F4]">
                        {/* Grid */}
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                        {/* Sprites */}
                        <div className="relative w-full h-full">
                            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 text-3xl">🐱</div>
                            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 text-3xl">🍎</div>
                        </div>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-3">
                        Спрайты: 🐱 Кот 🍎 Яблоко
                    </p>

                    <div className="mt-6 p-4 bg-blue-50 rounded-[12px] border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Подсказка</h4>
                        <p className="text-xs text-blue-700">
                            Соберите программу, которая будет считаться эталонным решением для этого задания.
                            Ученики должны будут собрать такую же программу.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordSolutionPage;
