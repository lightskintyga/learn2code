import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as Blockly from 'blockly';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime } from '@/engine/Runtime';
import { 
    Loader2, 
    ChevronLeft, 
    Play, 
    Save, 
    AlertCircle, 
    CheckCircle, 
    Flag,
    RotateCcw
} from 'lucide-react';
import { toolboxConfig } from '@/blockly/toolbox';
import { ScratchTheme } from '@/blockly/theme';
import StageCanvas from '@/components/stage/StageCanvas';
import SpriteList from '@/components/sprites/SpriteList';

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

        const solutionXml = localStorage.getItem(`task_solution_${solutionId}`);
        if (!solutionXml) return;

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
        createTaskDraft,
        updateTask,
        publishTask,
        unpublishTask,
        testSolution,
        clearError,
    } = useCourseStore();

    const { addToast } = useToastStore();
    const { currentProject, createProject } = useProjectStore();
    const { isRunning, setRunning } = useEditorStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        hint: '',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasSolution, setHasSolution] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    // Загружаем задание
    useEffect(() => {
        if (!isNewTask && taskId) {
            fetchTask(taskId);
        }
    }, [isNewTask, taskId, fetchTask]);

    // Обновляем форму при загрузке задания
    useEffect(() => {
        if (currentTask && !isNewTask) {
            setFormData({
                title: currentTask.title || '',
                description: currentTask.description || '',
                hint: '',
            });
            if (currentTask.solutionCode) {
                setHasSolution(true);
            }
        }
    }, [currentTask, isNewTask]);

    // Загружаем данные из draft
    useEffect(() => {
        if (isNewTask && solutionIdFromQuery) {
            const draftWithSolution = localStorage.getItem(`task_draft_with_solution`);
            if (draftWithSolution) {
                try {
                    const draft = JSON.parse(draftWithSolution);
                    setFormData({
                        title: draft.title || '',
                        description: draft.description || '',
                        hint: draft.hint || '',
                    });
                    setSelectedCategories(draft.selectedCategories || []);
                    if (draft.solutionPython) {
                        setHasSolution(true);
                    }
                } catch (e) {
                    console.error('Failed to parse draft:', e);
                }
            }
        }
    }, [isNewTask, solutionIdFromQuery]);

    // Инициализация проекта для сцены
    useEffect(() => {
        if (!currentProject) {
            createProject('Task Preview', 'teacher', 'Teacher');
        }
    }, [currentProject, createProject]);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Проверка валидности формы
    const isFormValid = () => {
        return formData.title.trim() && formData.description.trim() && selectedCategories.length > 0;
    };

    const canRecordSolution = isFormValid();
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
            const solutionId = isNewTask ? solutionIdFromQuery : taskId;
            if (!solutionId) {
                addToast('Ошибка: не найдено эталонное решение', 'error');
                setIsSaving(false);
                return;
            }

            const pythonCode = localStorage.getItem(`task_solution_python_${solutionId}`) || '';

            if (isNewTask) {
                // Создаем черновик
                const draftData = {
                    lessonId: lessonId || null,
                    order: 1,
                };
                const task = await createTaskDraft(draftData);
                
                if (task) {
                    // Обновляем черновик полными данными
                    const updateData = {
                        title: formData.title,
                        description: formData.description,
                        order: 1,
                        config: task.config,
                        initialState: task.initialState,
                        solutionCode: pythonCode,
                    };
                    await updateTask(task.id, updateData);
                    
                    addToast('Задание создано', 'success');
                    navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${task.id}/edit`);
                }
            } else if (taskId) {
                // Обновляем существующее задание
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    order: 1,
                    config: currentTask?.config || { gridWidth: 10, gridHeight: 10 },
                    initialState: currentTask?.initialState || { sprites: [] },
                    solutionCode: pythonCode,
                };
                await updateTask(taskId, updateData);
                addToast('Изменения сохранены', 'success');
            }
        } catch {
            // Ошибка обрабатывается в store
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!taskId || isNewTask) {
            addToast('Сначала сохраните задание', 'error');
            return;
        }
        
        setIsPublishing(true);
        try {
            const result = await publishTask(taskId);
            if (result) {
                addToast('Задание опубликовано', 'success');
            }
        } catch {
            // Ошибка обрабатывается в store
        } finally {
            setIsPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        if (!taskId || isNewTask) return;
        
        setIsPublishing(true);
        try {
            const result = await unpublishTask(taskId);
            if (result) {
                addToast('Задание снято с публикации', 'success');
            }
        } catch {
            // Ошибка обрабатывается в store
        } finally {
            setIsPublishing(false);
        }
    };

    // Запуск с тестированием через API
    const handleRunWithTest = async () => {
        if (!taskId || isNewTask) {
            addToast('Сначала сохраните задание', 'error');
            return;
        }

        const solutionId = isNewTask ? solutionIdFromQuery : taskId;
        const pythonCode = localStorage.getItem(`task_solution_python_${solutionId}`) || '';
        
        if (!pythonCode) {
            addToast('Нет кода решения для тестирования', 'error');
            return;
        }

        setIsTesting(true);
        setRunning(true);
        
        try {
            // Запускаем локально для визуализации
            if (currentProject) {
                runtime.loadProject(currentProject);
                await runtime.start();
            }
            
            // Тестируем через API
            const result = await testSolution(taskId, pythonCode);
            
            if (result?.success) {
                addToast('✅ Решение прошло тестирование', 'success');
            } else {
                addToast(result?.error || '❌ Решение не прошло тестирование', 'error');
            }
        } catch (e) {
            console.error('Test error:', e);
            addToast('Ошибка при тестировании', 'error');
        } finally {
            setIsTesting(false);
            setRunning(false);
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

        localStorage.setItem(`task_draft_${taskId || 'new'}`, JSON.stringify({
            title: formData.title,
            description: formData.description,
            hint: formData.hint,
            selectedCategories,
        }));

        if (isNewTask) {
            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/new/record-solution?draft=true`);
        } else if (taskId) {
            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/record-solution`);
        }
    };

    const isPublished = currentTask?.pipelineState === 'published';

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
                            <button onClick={clearError} className="text-red-600 hover:text-red-700 text-sm">✕</button>
                        </div>
                    )}

                    {/* Status Badge */}
                    {currentTask && (
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {isPublished ? 'Опубликовано' : 'Черновик'}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {/* Publish/Unpublish Button */}
                        {!isNewTask && currentTask && (
                            isPublished ? (
                                <button
                                    onClick={handleUnpublish}
                                    disabled={isPublishing}
                                    className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                                >
                                    {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                    Снять с публикации
                                </button>
                            ) : (
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing || !canSave}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                        canSave ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Опубликовать
                                </button>
                            )
                        )}

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
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
                        <span>Для сохранения задания необходимо: название, описание, выбранные категории блоков и эталонное решение</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Task Info */}
                <div className="w-80 bg-white border-r border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 space-y-4">
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
                    </div>

                    {/* Block Categories */}
                    <div className="border-t border-[#EEF0F4] p-4">
                        <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные категории блоков</h3>
                        <p className="text-xs text-[#6B7280] mb-3">Выберите категории блоков, доступные ученику</p>

                        <div className="space-y-2">
                            {blockCategories.map((cat) => (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-[8px] transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                        className="w-4 h-4 rounded border-[#E0E4EB] text-[#734DE6] focus:ring-[#734DE6]"
                                    />
                                    <div className={`w-4 h-4 rounded-full ${cat.colorClass}`} />
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
                            <p className="text-xs text-[#6B7280]">Ученик увидит только выбранные категории блоков и эталонное решение</p>
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

                            {/* Stage - Read Only (sprites cannot be moved) */}
                            <div className="relative rounded-[16px] overflow-hidden border border-[#EEF0F4] shadow-sm" style={{ aspectRatio: '4/3' }}>
                                {currentProject ? (
                                    <StageCanvas readOnly />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#E0F2FE] to-[#F0FDF4] flex items-center justify-center">
                                        <div className="text-3xl">🐱</div>
                                    </div>
                                )}
                            </div>

                            {/* Run with Test Button */}
                            {!isNewTask && hasSolution && (
                                <button
                                    onClick={handleRunWithTest}
                                    disabled={isTesting}
                                    className={`w-full flex items-center justify-center gap-2 mt-4 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                        isTesting
                                            ? 'bg-gray-200 text-gray-400'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {isTesting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Flag className="w-4 h-4" />
                                    )}
                                    {isTesting ? 'Тестирование...' : 'Запустить и протестировать'}
                                </button>
                            )}

                            {/* Sprites List (Read Only) */}
                            <div className="mt-4 border-t border-[#EEF0F4] pt-4">
                                <h4 className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Спрайты</h4>
                                <SpriteList readOnly />
                            </div>

                            {/* Requirements Checklist */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-[12px]">
                                <h4 className="text-xs font-medium text-[#1A1D2D] mb-2">Требования:</h4>
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
