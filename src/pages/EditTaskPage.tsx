import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { Loader2, ChevronLeft, Play, Save, AlertCircle, CheckCircle } from 'lucide-react';
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

// Фильтруем toolbox по выбранным категориям (для предпросмотра)
const filterToolbox = (categories: string[]) => {
    const fullToolbox = JSON.parse(JSON.stringify(toolboxConfig));
    fullToolbox.contents = fullToolbox.contents.filter((cat: any) =>
        categories.some(c => cat.name.toLowerCase().includes(c.toLowerCase()) ||
        cat.name.toLowerCase().replace(/[^a-z]/g, '').includes(c.toLowerCase()))
    );
    return fullToolbox;
};

const EditTaskPage: React.FC = () => {
    const { courseId, lessonId, taskId } = useParams<{ courseId: string; lessonId: string; taskId: string }>();
    const navigate = useNavigate();
    const isNewTask = taskId === 'new';

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

    // Blockly для отображения эталонного решения (только для чтения)
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

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
                title: currentTask.title,
                description: currentTask.description,
                hint: '', // TODO: Добавить в API
                expectedOutput: currentTask.expectedOutput || '',
                checkLevel: currentTask.checkLevel,
            });
            if (currentTask.blockCategories) {
                setSelectedCategories(currentTask.blockCategories);
            }
        }
    }, [currentTask, isNewTask]);

    // Загружаем эталонное решение из localStorage (временно)
    useEffect(() => {
        if (taskId && taskId !== 'new') {
            const savedSolution = localStorage.getItem(`task_solution_${taskId}`);
            setHasSolution(!!savedSolution);
        }
    }, [taskId]);

    // Инициализация Blockly только для отображения эталонного решения
    useEffect(() => {
        if (!blocklyRef.current || workspaceRef.current || selectedCategories.length === 0) return;

        const toolbox = filterToolbox(selectedCategories);

        workspaceRef.current = Blockly.inject(blocklyRef.current, {
            toolbox: toolbox,
            theme: 'zelos',
            renderer: 'zelos',
            readOnly: true, // Только для чтения!
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

        // Загружаем эталонное решение если есть
        if (taskId && taskId !== 'new') {
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
        }

        return () => {
            workspaceRef.current?.dispose();
            workspaceRef.current = null;
        };
    }, [selectedCategories, taskId]);

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
            const taskData = {
                title: formData.title,
                description: formData.description,
                order: 1,
                lessonId: lessonId || '',
                initialCode: '',
                expectedOutput: formData.expectedOutput,
                checkLevel: formData.checkLevel,
                blockCategories: selectedCategories,
            };

            if (isNewTask) {
                const task = await createTask(taskData);
                if (task) {
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

        // Если это новое задание, сначала создаем его
        if (isNewTask) {
            const task = await createTask({
                title: formData.title,
                description: formData.description,
                order: 1,
                lessonId: lessonId,
                initialCode: '',
                expectedOutput: formData.expectedOutput,
                checkLevel: formData.checkLevel,
                blockCategories: selectedCategories,
            });

            if (task) {
                addToast('Задание создано, перехожу к записи решения', 'success');
                navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${task.id}/record-solution`);
            } else {
                addToast('Ошибка создания задания', 'error');
            }
        } else if (taskId) {
            // Обновляем существующее задание перед записью решения
            await updateTask(taskId, {
                title: formData.title,
                description: formData.description,
                order: currentTask?.order || 1,
                initialCode: '',
                expectedOutput: formData.expectedOutput,
                checkLevel: formData.checkLevel,
                blockCategories: selectedCategories,
            });

            navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/record-solution`);
        }
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
                        <span className="text-sm">← Редактор задания</span>
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
                            Записать решение
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

            {/* Main Content - 3 columns */}
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
                        <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные блоки</h3>
                        <p className="text-xs text-[#6B7280] mb-3">
                            Выберите категории блоков, доступные ученику
                        </p>

                        <div className="space-y-2">
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
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color }}
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

                    <div className="flex-1 p-4 flex gap-4">
                        {/* Blockly Preview (только для чтения) */}
                        <div className="flex-1">
                            {selectedCategories.length === 0 ? (
                                <div className="w-full h-full bg-white rounded-[16px] border border-[#EEF0F4] flex items-center justify-center">
                                    <div className="text-center">
                                        <AlertCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                                        <p className="text-[#6B7280]">Выберите категории блоков слева</p>
                                    </div>
                                </div>
                            ) : !hasSolution ? (
                                <div className="w-full h-full bg-white rounded-[16px] border border-[#EEF0F4] flex items-center justify-center">
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
                                <div
                                    ref={blocklyRef}
                                    className="w-full h-full bg-white rounded-[16px] shadow-sm border border-[#EEF0F4]"
                                />
                            )}
                        </div>

                        {/* Stage Preview */}
                        <div className="w-72 flex flex-col">
                            <div className="bg-gradient-to-br from-[#E0F2FE] to-[#F0FDF4] rounded-[16px] aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-[#EEF0F4] mb-3">
                                <div className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <div className="relative w-full h-full">
                                    <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 text-3xl">🐱</div>
                                    <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 text-3xl">🍎</div>
                                </div>
                            </div>
                            <p className="text-xs text-[#6B7280]">
                                Спрайты: 🐱 Кот 🍎 Яблоко
                            </p>

                            {hasSolution && (
                                <div className="mt-4 p-3 bg-green-50 rounded-[12px] border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Эталонное решение записано</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskPage;
