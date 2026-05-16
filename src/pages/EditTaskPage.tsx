import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as Blockly from 'blockly';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime } from '@/engine/Runtime';
import { Loader2, ChevronLeft, Play, Save, AlertCircle, CheckCircle, FlaskConical, Square } from 'lucide-react';
import { toolboxConfig } from '@/blockly/toolbox';
import { ScratchTheme } from '@/blockly/theme';
import StageCanvas from '@/components/stage/StageCanvas';
import SpriteList from '@/components/sprites/SpriteList';
import SpriteInfo from '@/components/sprites/SpriteInfo';
import BackdropSelector from '@/components/sprites/BackdropSelector';

// Компонент для отображения превью решения
interface SolutionPreviewProps {
    solutionId: string;
    selectedCategories: string[];
}

const SolutionPreview: React.FC<SolutionPreviewProps> = ({ solutionId, selectedCategories }) => {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!blocklyRef.current || hasInitializedRef.current || !solutionId) return;

        // Получаем XML решения
        const solutionXml = localStorage.getItem(`task_solution_${solutionId}`);
        if (!solutionXml) return;

        // Создаем read-only workspace
        workspaceRef.current = Blockly.inject(blocklyRef.current, {
            readOnly: true,
            theme: ScratchTheme,
            renderer: 'zelos',
            scrollbars: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.675,
            },
            grid: {
                spacing: 40,
                length: 2,
                colour: '#DDD',
            },
        });

        // Загружаем блоки
        try {
            const parser = new DOMParser();
            const xml = parser.parseFromString(solutionXml, 'text/xml');
            Blockly.Xml.domToWorkspace(xml.documentElement, workspaceRef.current);
        } catch (e) {
            console.error('Failed to load solution for preview:', e);
        }

        hasInitializedRef.current = true;

        return () => {
            workspaceRef.current?.dispose();
            workspaceRef.current = null;
            hasInitializedRef.current = false;
        };
    }, [solutionId]);

    if (!solutionId) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#6B7280]">Нет данных решения</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div ref={blocklyRef} className="w-full h-full" />
        </div>
    );
};

// Категории блоков для выбора
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

const EditTaskPage: React.FC = () => {
    const { courseId, lessonId, taskId } = useParams<{ courseId: string; lessonId: string; taskId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isNewTask = taskId === 'new';
    const solutionIdFromQuery = searchParams.get('solution');

    const {
        currentTask,
        isLoading,
        error,
        fetchTask,
        createTask,
        updateTask,
        clearError,
    } = useCourseStore();

    const { addToast } = useToastStore();
    const { currentProject, createProject } = useProjectStore();
    const { isRunning, setRunning, selectSprite } = useEditorStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        hint: '',
        expectedOutput: '',
        checkLevel: 'State' as 'State' | 'Trace' | 'Ast',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSolution, setHasSolution] = useState(false);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // Blockly для отображения эталонного решения (только для чтения)
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    // Загружаем задание
    useEffect(() => {
        if (!isNewTask && taskId) {
            fetchTask(taskId);
        }
    }, [isNewTask, taskId, fetchTask]);

    // Обновляем форму при загрузке задания или draft с решением
    useEffect(() => {
        if (currentTask && !isNewTask) {
            setFormData({
                title: currentTask.title || '',
                description: currentTask.description || '',
                hint: '', // TODO: Добавить в API
                expectedOutput: currentTask.expectedStateJson || '',
                checkLevel: 'State', // TODO: Получать из configJson
            });
            // TODO: Получать категории из configJson
            setSelectedCategories([]);
        }
        // Загружаем draft данные для нового задания с решением
        else if (isNewTask && solutionIdFromQuery) {
            const draftWithSolution = localStorage.getItem(`task_draft_with_solution`);
            if (draftWithSolution) {
                try {
                    const draft = JSON.parse(draftWithSolution);
                    setFormData({
                        title: draft.title || '',
                        description: draft.description || '',
                        hint: draft.hint || '',
                        expectedOutput: draft.expectedOutput || '',
                        checkLevel: draft.checkLevel || 'State',
                    });
                    setSelectedCategories(draft.selectedCategories || []);
                } catch (e) {
                    console.error('Failed to parse draft with solution:', e);
                }
            }
        }
    }, [currentTask, isNewTask, solutionIdFromQuery]);

    // Загружаем эталонное решение из localStorage
    useEffect(() => {
        // Для существующего задания - ищем по taskId
        if (taskId && taskId !== 'new') {
            const savedSolution = localStorage.getItem(`task_solution_${taskId}`);
            setHasSolution(!!savedSolution);
        }
        // Для нового задания - ищем по solutionId из query param
        else if (isNewTask && solutionIdFromQuery) {
            const savedSolution = localStorage.getItem(`task_solution_${solutionIdFromQuery}`);
            setHasSolution(!!savedSolution);
        }
    }, [taskId, isNewTask, solutionIdFromQuery]);

    // Инициализация проекта для сцены в превью
    useEffect(() => {
        if (!currentProject) {
            createProject('Task Preview', 'teacher', 'Teacher');
        }
    }, [currentProject, createProject]);

    // Загружаем эталонное решение в проект
    useEffect(() => {
        if (!taskId || taskId === 'new' || !currentProject) return;

        const savedProject = localStorage.getItem(`task_solution_project_${taskId}`);
        if (savedProject) {
            try {
                const projectData = JSON.parse(savedProject);
                // Загружаем спрайты и блоки из эталонного решения
                const { setProject } = useProjectStore.getState();
                setProject(projectData);
                setHasSolution(true);
            } catch (e) {
                console.error('Failed to load solution project:', e);
            }
        }
    }, [taskId, currentProject]);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Проверка валидности формы
    const isFormValid = () => {
        return (
            formData.title.trim() &&
            formData.description.trim() &&
            selectedCategories.length > 0
        );
    };

    // Проверка возможности записи решения
    const canRecordSolution = isFormValid();

    // Проверка возможности сохранения
    const canSave = isFormValid() && hasSolution;

    const handleSave = async () => {
        if (!canSave) {
            if (!isFormValid()) {
                addToast('Заполните название, описание и выберите категории блоков', 'error');
            } else if (!hasSolution) {
                addToast('Запишите эталонное решение перед сохранением', 'error');
            }
            return;
        }

        setIsSaving(true);

        try {
            // Определяем ID решения (из query param для новых или taskId для существующих)
            const solutionId = isNewTask ? solutionIdFromQuery : taskId;
            if (!solutionId) {
                addToast('Ошибка: не найдено эталонное решение', 'error');
                setIsSaving(false);
                return;
            }

            // Получаем Python код решения из localStorage
            const pythonCode = localStorage.getItem(`task_solution_python_${solutionId}`) || '';
            const solutionXml = localStorage.getItem(`task_solution_${solutionId}`) || '';

            // Формируем данные для API в новом формате
            const taskData = {
                title: formData.title,
                description: formData.description,
                order: 1,
                lessonId: lessonId || '',
                referenceCode: pythonCode, // Python код как эталонное решение
                initialStateJson: '', // TODO: Добавить начальное состояние
                expectedStateJson: formData.expectedOutput || '',
                configJson: JSON.stringify({
                    checkLevel: formData.checkLevel,
                    blockCategories: selectedCategories,
                }),
            };

            if (isNewTask) {
                // Создаем задание на бэкенде с эталонным Python кодом
                const task = await createTask(taskData);
                if (task) {
                    // Переносим решение на новый ID
                    if (solutionXml) {
                        localStorage.setItem(`task_solution_${task.id}`, solutionXml);
                        localStorage.setItem(`task_solution_python_${task.id}`, pythonCode);
                        // Очищаем draft
                        localStorage.removeItem(`task_solution_${solutionId}`);
                        localStorage.removeItem(`task_solution_python_${solutionId}`);
                        localStorage.removeItem(`task_draft_with_solution`);
                    }
                    addToast('Задание создано', 'success');
                    navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${task.id}/edit`);
                }
            } else if (taskId) {
                await updateTask(taskId, taskData);
                addToast('Изменения сохранены', 'success');
            }
        } catch {
            // Ошибка уже обрабатывается в store
        } finally {
            setIsSaving(false);
        }
    };

    const handleRecordSolution = async () => {
        if (!canRecordSolution) {
            addToast('Заполните название, описание и выберите категории блоков', 'error');
            return;
        }

        if (!lessonId) {
            addToast('Ошибка: не найден ID урока', 'error');
            return;
        }

        // Сохраняем текущие данные формы в localStorage для передачи на страницу записи
        const draftData = {
            title: formData.title,
            description: formData.description,
            hint: formData.hint,
            expectedOutput: formData.expectedOutput,
            checkLevel: formData.checkLevel,
            selectedCategories,
        };
        localStorage.setItem(`task_draft_${taskId || 'new'}`, JSON.stringify(draftData));

        if (isNewTask) {
            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/new/record-solution?draft=true`);
        } else if (taskId) {
            // Для существующего задания просто переходим на страницу записи решения
            // Не обновляем задание на бэкенде - это произойдет только при нажатии "Сохранить"
            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/record-solution`);
        }
    };

    // Запуск эталонного решения в превью
    const handleStartPreview = async () => {
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

    const handleStopPreview = () => {
        runtime.stop();
        setRunning(false);
        if (currentProject) runtime.loadProject(currentProject);
    };

    // Тест проверки
    const handleTestCheck = () => {
        addToast('Проверка эталонного решения...', 'info');
        // TODO: Реализовать логику проверки
        setTimeout(() => {
            addToast('Проверка завершена успешно', 'success');
        }, 1000);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/teacher/course/${courseId}/edit`)}
                        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">Редактор задания</span>
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-[8px] px-3 py-2 flex items-center gap-2">
                            <span className="text-red-600 text-sm">{error}</span>
                            <button
                                onClick={clearError}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRecordSolution}
                            disabled={!canRecordSolution}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                canRecordSolution
                                    ? 'border border-[#E0E4EB] text-[#1A1D2D] hover:bg-gray-50'
                                    : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Play className="w-4 h-4" />
                            {hasSolution ? 'Перезаписать решение' : 'Записать решение'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !canSave}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                canSave
                                    ? 'bg-[#734DE6] text-white hover:bg-[#5a3eb8]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Сохранить
                        </button>
                    </div>
                </div>
            </header>

            {/* Validation Warning */}
            {!isFormValid() && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                            Для сохранения задания необходимо: название, описание, выбранные категории блоков и эталонное решение
                        </span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Task Info */}
                <div className="w-80 bg-white border-r border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {/* Название */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Название задания <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Например: Кот идет к яблоку"
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Описание */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Описание задания <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Собери программу, чтобы кот дошел до яблока..."
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        {/* Подсказка */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Подсказка <span className="text-[#9CA3AF]">(необязательно)</span>
                            </label>
                            <textarea
                                value={formData.hint}
                                onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                                rows={3}
                                placeholder="Начни с блока «когда нажат» и добавь блок движения..."
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Доступные блоки */}
                    <div className="border-t border-[#EEF0F4] p-4">
                        <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные категории блоков</h3>
                        <p className="text-xs text-[#6B7280] mb-3">
                            Выберите категории блоков, доступные ученику
                        </p>

                        <div className="space-y-2">
                            {blockCategories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-[8px] transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                        className="w-4 h-4 rounded border-[#E0E4EB] text-[#734DE6] focus:ring-[#734DE6]"
                                    />
                                    <div
                                        className={`w-4 h-4 rounded-full ${cat.colorClass}`}
                                    />
                                    <span className="text-sm text-[#1A1D2D]">{cat.name}</span>
                                </label>
                            ))}
                        </div>

                        {selectedCategories.length === 0 && (
                            <div className="mt-3 p-2 bg-amber-50 rounded-[8px] text-xs text-amber-700">
                                Выберите хотя бы одну категорию
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Preview Workspace */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFB]">
                    <div className="px-4 py-3 border-b border-[#EEF0F4] bg-white flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-[#1A1D2D]">Предпросмотр рабочей области</h2>
                            <p className="text-xs text-[#6B7280]">
                                Ученик увидит только выбранные категории блоков и эталонное решение
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 flex">
                        {/* Left - Available Categories */}
                        <div className="w-48 bg-white border-r border-[#EEF0F4] p-4 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-[#1A1D2D] mb-3">Доступные категории</h3>
                            {selectedCategories.length === 0 ? (
                                <p className="text-xs text-[#9CA3AF]">Выберите категории слева</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedCategories.map(catId => {
                                        const cat = blockCategories.find(c => c.id === catId);
                                        return cat ? (
                                            <div key={catId} className="flex items-center gap-2 p-2 rounded-[8px] bg-gray-50">
                                                <div className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
                                                <span className="text-sm text-[#1A1D2D]">{cat.name}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}

                            {hasSolution && (
                                <div className="mt-6 p-3 bg-green-50 rounded-[12px] border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Решение записано</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Center - Block Sequence Preview */}
                        <div className="flex-1 p-4 flex flex-col">
                            <div className="flex-1 bg-white rounded-[16px] border border-[#EEF0F4] overflow-hidden">
                                {selectedCategories.length === 0 ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                                            <p className="text-[#6B7280]">Выберите категории блоков слева</p>
                                        </div>
                                    </div>
                                ) : !hasSolution ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                            <p className="text-[#6B7280] mb-2">Эталонное решение не записано</p>
                                            <button
                                                onClick={handleRecordSolution}
                                                disabled={!canRecordSolution}
                                                className="px-4 py-2 bg-[#734DE6] text-white rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                                            >
                                                Записать решение
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <SolutionPreview 
                                        solutionId={isNewTask ? (solutionIdFromQuery || '') : (taskId || '')}
                                        selectedCategories={selectedCategories}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right - Stage Preview & Controls */}
                        <div className="w-72 bg-white border-l border-[#EEF0F4] p-4 flex flex-col">
                            <h3 className="text-sm font-semibold text-[#1A1D2D] mb-3">Сцена</h3>

                            {/* Stage */}
                            <div className="relative rounded-[16px] overflow-hidden border border-[#EEF0F4] shadow-sm" style={{ aspectRatio: '4/3' }}>
                                {currentProject ? (
                                    <StageCanvas />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#E0F2FE] to-[#F0FDF4] flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-10"
                                            style={{
                                                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                                backgroundSize: '20px 20px'
                                            }}
                                        />
                                        <div className="text-3xl">🐱</div>
                                    </div>
                                )}
                            </div>

                            {/* Controls - только иконки запуска/стоп */}
                            {hasSolution && currentProject && (
                                <>
                                    <div className="flex items-center gap-2 mt-4">
                                        <button
                                            onClick={handleStartPreview}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                                isRunning
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                            title="Запустить"
                                        >
                                            <Play size={18} className="ml-0.5" />
                                        </button>
                                        <button
                                            onClick={handleStopPreview}
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
                                        onClick={handleTestCheck}
                                        className="w-full flex items-center justify-center gap-2 bg-[#734DE6] text-white px-3 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors mt-3"
                                    >
                                        <FlaskConical className="w-4 h-4" />
                                        Проверить решение
                                    </button>

                                    {/* Sprites */}
                                    <div className="mt-4 border-t border-[#EEF0F4] pt-4">
                                        <h4 className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Спрайты</h4>
                                        <SpriteList readOnly />
                                    </div>
                                </>
                            )}

                            {/* Requirements Checklist */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-[12px]">
                                <h4 className="text-xs font-medium text-[#1A1D2D] mb-2">Требования для сохранения:</h4>
                                <div className="space-y-1.5">
                                    <div className={`flex items-center gap-2 text-xs ${formData.title.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                                        {formData.title.trim() ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        <span>Название</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${formData.description.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                                        {formData.description.trim() ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        <span>Описание</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${selectedCategories.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {selectedCategories.length > 0 ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        <span>Категории блоков</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${hasSolution ? 'text-green-600' : 'text-gray-400'}`}>
                                        {hasSolution ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        <span>Эталонное решение</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskPage;
