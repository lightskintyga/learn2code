import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime } from '@/engine/Runtime';
import { Loader2, ChevronLeft, Square, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toolboxConfig } from '@/blockly/toolbox';
import { ScratchTheme } from '@/blockly/theme';
import { loadWorkspaceFromXml, getWorkspaceXml } from '@/blockly/setup';
import StageCanvas from '@/components/stage/StageCanvas';
import SpriteList from '@/components/sprites/SpriteList';
import SpriteInfo from '@/components/sprites/SpriteInfo';
import BackdropSelector from '@/components/sprites/BackdropSelector';
import TabBar from '@/components/editor/TabBar';
import CostumeEditor from '@/components/editor/CostumeEditor';
import SoundEditor from '@/components/editor/SoundEditor';

// Категории блоков
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

// Фильтруем toolbox по выбранным категориям
const filterToolbox = (categories: string[]) => {
    const fullToolbox = JSON.parse(JSON.stringify(toolboxConfig));

    const categoryNameToId: Record<string, string> = {
        'движение': 'motion',
        'внешнийвид': 'looks',
        'внешний вид': 'looks',
        'внешность': 'looks',
        'звук': 'sound',
        'события': 'events',
        'управление': 'control',
        'сенсоры': 'sensing',
        'операторы': 'operators',
        'переменные': 'variables',
        'другиеблоки': 'procedures',
    };

    fullToolbox.contents = fullToolbox.contents.filter((cat: any) => {
        const catName = cat.name.toLowerCase().replace(/[^a-zа-я]/g, '');
        const catId = categoryNameToId[catName] || catName;
        return categories.some(selectedId =>
            selectedId.toLowerCase() === catId.toLowerCase() ||
            cat.name.toLowerCase().includes(selectedId.toLowerCase()) ||
            catId.toLowerCase().includes(selectedId.toLowerCase())
        );
    });

    return fullToolbox;
};

// Очистка workspace от блоков неразрешенных категорий
const clearDisallowedBlocks = (workspace: Blockly.WorkspaceSvg, allowedCategories: string[]) => {
    const allBlocks = workspace.getAllBlocks(false);
    const allowedTypes = new Set<string>();

    // Собираем разрешенные типы блоков
    const toolbox = filterToolbox(allowedCategories);
    const collectBlockTypes = (contents: any[]) => {
        for (const item of contents) {
            if (item.kind === 'block' && item.type) {
                allowedTypes.add(item.type);
            }
            if (item.contents) {
                collectBlockTypes(item.contents);
            }
        }
    };
    collectBlockTypes(toolbox.contents);

    // Удаляем неразрешенные блоки
    allBlocks.forEach(block => {
        if (!allowedTypes.has(block.type)) {
            block.dispose();
        }
    });
};

// Интерфейс для draft данных
interface TaskDraft {
    title: string;
    description: string;
    hint: string;
    expectedOutput: string;
    checkLevel: 'State' | 'Trace' | 'Ast';
    selectedCategories: string[];
}

const RecordSolutionPage: React.FC = () => {
    const { courseId, lessonId, taskId } = useParams<{ courseId: string; lessonId: string; taskId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDraftMode = searchParams.get('draft') === 'true';
    const isNewTask = taskId === 'new' || !taskId;

    const { addToast } = useToastStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTask, setIsLoadingTask] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [draftData, setDraftData] = useState<TaskDraft | null>(null);

    const {
        currentTask,
        fetchTask,
    } = useCourseStore();

    const { currentProject, createProject } = useProjectStore();
    const { activeTab, selectedSpriteId, isStageSelected, isRunning, setRunning, selectSprite } = useEditorStore();

    // Blockly refs
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const hasInitializedRef = useRef(false);

    // Загружаем данные
    useEffect(() => {
        const loadData = async () => {
            setIsLoadingTask(true);

            if (isDraftMode && isNewTask) {
                const draftJson = localStorage.getItem(`task_draft_new`);
                if (draftJson) {
                    try {
                        const draft: TaskDraft = JSON.parse(draftJson);
                        setDraftData(draft);
                        setSelectedCategories(draft.selectedCategories || []);
                    } catch (e) {
                        console.error('Failed to parse draft:', e);
                    }
                }
                setIsLoadingTask(false);
            } else if (taskId && !isNewTask) {
                await fetchTask(taskId);
                setIsLoadingTask(false);
            } else {
                setIsLoadingTask(false);
            }
        };

        loadData();
    }, [isDraftMode, isNewTask, taskId, fetchTask]);

    // Загружаем выбранные категории
    useEffect(() => {
        if (isDraftMode && draftData?.selectedCategories) {
            setSelectedCategories(draftData.selectedCategories);
        } else if (currentTask?.blockCategories) {
            setSelectedCategories(currentTask.blockCategories);
        }
    }, [currentTask, draftData, isDraftMode]);

    // Инициализация проекта
    useEffect(() => {
        if (!currentProject) {
            createProject('Solution Recording', 'teacher', 'Teacher');
        }
    }, [currentProject, createProject]);

    // Выбираем первый спрайт
    useEffect(() => {
        if (currentProject && !selectedSpriteId && currentProject.sprites.length > 0) {
            selectSprite(currentProject.sprites[0].id);
        }
    }, [currentProject?.id, selectSprite, selectedSpriteId]);

    // Инициализация Blockly (когда появятся категории)
    useEffect(() => {
        if (!blocklyRef.current || hasInitializedRef.current) return;
        if (selectedCategories.length === 0) return;

        const toolbox = filterToolbox(selectedCategories);

        workspaceRef.current = Blockly.inject(blocklyRef.current, {
            toolbox: toolbox,
            theme: ScratchTheme,
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
            sounds: true,
            media: 'https://unpkg.com/blockly/media/',
        });

        hasInitializedRef.current = true;

        // Загружаем сохраненное решение если есть
        const storageKey = isDraftMode ? `task_draft_solution_new` : `task_solution_${taskId}`;
        const savedSolution = localStorage.getItem(storageKey);
        if (savedSolution) {
            try {
                loadWorkspaceFromXml(workspaceRef.current, savedSolution);
            } catch (e) {
                console.error('Failed to load saved solution:', e);
            }
        }

        return () => {
            workspaceRef.current?.dispose();
            workspaceRef.current = null;
            hasInitializedRef.current = false;
        };
    }, [selectedCategories, isDraftMode, taskId]);

    // Обновляем размер Blockly при смене таба (когда возвращаемся на code)
    useEffect(() => {
        if (activeTab === 'code' && workspaceRef.current && hasInitializedRef.current) {
            // Небольшая задержка чтобы DOM обновился
            requestAnimationFrame(() => {
                setTimeout(() => {
                    Blockly.svgResize(workspaceRef.current!);
                }, 50);
            });
        }
    }, [activeTab]);

    const handleStart = async () => {
        if (!currentProject) return;

        runtime.loadProject(currentProject);
        setRunning(true);
        try {
            await runtime.start();
        } catch (e) {
            console.error('Runtime error:', e);
        }
        setRunning(false);
    };

    const handleStop = () => {
        runtime.stop();
        setRunning(false);
        if (currentProject) runtime.loadProject(currentProject);
    };

    const handleSaveSolution = async () => {
        if (!workspaceRef.current || !courseId || !lessonId) return;

        setIsSaving(true);

        try {
            // Получаем XML и Python код
            const xml = getWorkspaceXml(workspaceRef.current);
            const pythonCode = pythonGenerator.workspaceToCode(workspaceRef.current);

            // Генерируем ID для нового задания если draft
            const solutionId = isDraftMode
                ? `draft_${Date.now()}`
                : taskId;

            if (!solutionId) {
                addToast('Ошибка: не удалось определить ID задания', 'error');
                setIsSaving(false);
                return;
            }

            // Сохраняем решение в localStorage
            localStorage.setItem(`task_solution_${solutionId}`, xml || '');
            localStorage.setItem(`task_solution_python_${solutionId}`, pythonCode || '');

            // Если draft mode - сохраняем draft данные с ID решения
            if (isDraftMode && draftData) {
                const draftWithSolution = {
                    ...draftData,
                    solutionId,
                    solutionXml: xml,
                    solutionPython: pythonCode,
                };
                localStorage.setItem(`task_draft_with_solution`, JSON.stringify(draftWithSolution));

                addToast('Эталонное решение сохранено', 'success');
                // Возвращаемся на страницу редактирования задания (без создания на бэкенде)
                navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/new/edit?solution=${solutionId}`);
            } else if (taskId) {
                // Сохраняем для существующего задания
                addToast('Эталонное решение сохранено', 'success');
                navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/edit`);
            }
        } catch (error) {
            console.error('Error saving solution:', error);
            addToast('Ошибка сохранения решения', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Проверяем валидность
    const isValid = () => {
        if (isDraftMode && draftData) {
            return (
                draftData.title?.trim() &&
                draftData.description?.trim() &&
                draftData.selectedCategories?.length > 0
            );
        }
        return (
            currentTask?.title?.trim() &&
            currentTask?.description?.trim() &&
            selectedCategories.length > 0
        );
    };

    // Показываем лоадер
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

    if (!isValid()) {
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
        <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
            {/* Header - только навигация и кнопка сохранения */}
            <header className="bg-white border-b border-[#EEF0F4] flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">← Запись эталонного решения</span>
                    </button>
                    <div className="h-6 w-px bg-[#EEF0F4]" />
                    <div>
                        <div className="text-sm text-[#734DE6] font-medium">
                            {isDraftMode ? 'Новое задание' : (currentTask?.title || 'Запись решения')}
                        </div>
                        <div className="text-sm text-[#1A1D2D] font-semibold">
                            Доступно {selectedCategories.length} категорий блоков
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSaveSolution}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Сохранить решение
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Available Categories */}
                <div className="w-64 bg-white border-r border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 border-b border-[#EEF0F4]">
                        <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные блоки</h3>
                        <p className="text-xs text-[#6B7280]">Ученику будут доступны только эти категории:</p>
                    </div>
                    <div className="p-4">
                        <div className="space-y-3">
                            {selectedCategories.map(catId => {
                                const cat = blockCategories.find(c => c.id === catId);
                                return cat ? (
                                    <div key={catId} className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
                                        <span className="text-sm text-[#1A1D2D]">{cat.name}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                    <div className="mt-auto p-4 border-t border-[#EEF0F4]">
                        <div className="p-3 bg-blue-50 rounded-[12px] border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Инструкция</h4>
                            <p className="text-xs text-blue-700">
                                Соберите программу, которая будет эталонным решением. Ученик должен собрать такую же программу.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center - Editor Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFB]">
                    <TabBar />
                    <div className="flex-1 overflow-hidden relative">
                        {/* Все вкладки рендерятся но скрываются через CSS, чтобы Blockly не размонтировался */}
                        <div className="absolute inset-0" style={{ display: activeTab === 'code' ? 'block' : 'none' }}>
                            <div ref={blocklyRef} className="w-full h-full" />
                        </div>
                        <div className="absolute inset-0" style={{ display: activeTab === 'costumes' ? 'block' : 'none' }}>
                            <CostumeEditor />
                        </div>
                        <div className="absolute inset-0" style={{ display: activeTab === 'sounds' ? 'block' : 'none' }}>
                            <SoundEditor />
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
                                title="Запустить"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
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

export default RecordSolutionPage;
