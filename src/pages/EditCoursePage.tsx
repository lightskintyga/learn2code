import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Settings, Save, Eye, Plus, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { LessonDto } from '@/services/api';
import AddLessonModal from '@/components/modals/AddLessonModal';
import EditLessonModal from '@/components/modals/EditLessonModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

// Расширенный тип урока с заданиями для UI
interface LessonWithTasks extends LessonDto {
    tasks: { id: string; title: string; order: number }[];
}

const EditCoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null);
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
    const [deletingLesson, setDeletingLesson] = useState<LessonDto | null>(null);

    const {
        currentCourse,
        lessons,
        isLoading,
        error,
        fetchCourse,
        fetchLessons,
        createCourse,
        updateCourse,
        createLesson,
        updateLesson,
        deleteLesson,
        clearError,
    } = useCourseStore();

    const { addToast } = useToastStore();

    const isNewCourse = courseId === 'new';

    // Форма данных курса
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        emoji: '📚',
        status: 'published' as 'published' | 'draft',
    });

    // Загружаем данные курса
    useEffect(() => {
        if (!isNewCourse && courseId) {
            fetchCourse(courseId);
            fetchLessons(courseId);
        }
    }, [isNewCourse, courseId, fetchCourse, fetchLessons]);

    // Обновляем форму при загрузке курса
    useEffect(() => {
        if (currentCourse && !isNewCourse) {
            setFormData({
                title: currentCourse.title,
                description: currentCourse.description,
                emoji: '📚', // TODO: Хранить в API
                status: 'published', // TODO: Хранить в API
            });
        }
    }, [currentCourse, isNewCourse]);

    // Преобразуем уроки в формат с заданиями
    const lessonsWithTasks: LessonWithTasks[] = lessons.map(lesson => ({
        ...lesson,
        tasks: [], // TODO: Получать задания из API
    }));

    const toggleLesson = (lessonId: string) => {
        setExpandedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            if (isNewCourse) {
                // Создаем новый курс
                const course = await createCourse({
                    title: formData.title,
                    description: formData.description,
                });
                if (course) {
                    addToast('Курс успешно создан', 'success');
                    navigate(`/teacher/course/${course.id}/edit`);
                }
            } else if (courseId) {
                // Обновляем существующий курс
                await updateCourse(courseId, {
                    title: formData.title,
                    description: formData.description,
                });
                addToast('Изменения сохранены', 'success');
            }
        } catch {
            // Ошибка уже обрабатывается в store
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddLessonSubmit = async (data: { title: string; description: string; order: number }) => {
        if (!courseId || isNewCourse) return;

        const lesson = await createLesson({
            title: data.title,
            description: data.description,
            order: data.order,
            courseId: courseId,
        });

        if (lesson) {
            setExpandedLessons(prev => [...prev, lesson.id]);
            addToast('Урок добавлен', 'success');
            setIsAddLessonModalOpen(false);
        }
    };

    const handleDeleteLessonClick = (lesson: LessonDto) => {
        setDeletingLesson(lesson);
        setIsDeleteLessonModalOpen(true);
    };

    const handleConfirmDeleteLesson = async () => {
        if (!deletingLesson) return;
        const success = await deleteLesson(deletingLesson.id);
        if (success) {
            addToast('Урок удален', 'success');
            setIsDeleteLessonModalOpen(false);
            setDeletingLesson(null);
        }
    };

    const handleEditLessonClick = (lesson: LessonDto) => {
        setEditingLesson(lesson);
        setIsEditLessonModalOpen(true);
    };

    const handleEditLessonSubmit = async (data: { title: string; description: string; order: number }) => {
        if (!editingLesson) return;

        const lesson = await updateLesson(editingLesson.id, {
            title: data.title,
            description: data.description,
            order: data.order,
        });

        if (lesson) {
            addToast('Урок обновлен', 'success');
            setIsEditLessonModalOpen(false);
            setEditingLesson(null);
        }
    };

    const handleAddTask = (lessonId: string) => {
        navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/new/edit`);
    };

    const handleEditTask = (lessonId: string, taskId: string) => {
        navigate(`/teacher/course/${courseId}/lesson/${lessonId}/task/${taskId}/edit`);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/teacher')}
                        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">{isNewCourse ? 'Новый курс' : 'Редактирование курса'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 border border-[#E0E4EB] text-[#6B7280] px-3 py-2 rounded-[10px] text-sm hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4" />
                            Предпросмотр
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.title.trim()}
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Сохранить
                        </button>
                    </div>
                </div>
            </header>

            {/* Error Message */}
            {error && (
                <div className="max-w-4xl mx-auto px-4 pt-4">
                    <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between">
                        <span className="text-red-600 text-sm">{error}</span>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
                            activeTab === 'content'
                                ? 'bg-white text-[#1A1D2D] shadow-sm border border-[#E0E4EB]'
                                : 'text-[#6B7280] hover:text-[#1A1D2D]'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Контент
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
                            activeTab === 'settings'
                                ? 'bg-white text-[#1A1D2D] shadow-sm border border-[#E0E4EB]'
                                : 'text-[#6B7280] hover:text-[#1A1D2D]'
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        Настройки
                    </button>
                </div>

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-4">
                        {/* Course Info Card */}
                        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4]">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                    Название курса <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Введите название курса"
                                    className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Описание</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="Опишите, что ученики изучат в этом курсе"
                                    className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Эмодзи</label>
                                    <input
                                        type="text"
                                        value={formData.emoji}
                                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                        className="w-16 bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-center text-xl focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Статус</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setFormData({ ...formData, status: 'published' })}
                                            className={`px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                                formData.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Опубликован
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, status: 'draft' })}
                                            className={`px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                                                formData.status === 'draft'
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Черновик
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lessons Section */}
                        {!isNewCourse && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-bold text-[#1A1D2D]">Уроки</h2>
                                    <button
                                        onClick={() => setIsAddLessonModalOpen(true)}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[10px] text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        Добавить урок
                                    </button>
                                </div>

                                {isLoading && lessons.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 bg-white rounded-[16px] border border-[#EEF0F4]">
                                        <Loader2 className="w-6 h-6 text-[#734DE6] animate-spin mb-3" />
                                        <p className="text-[#6B7280] text-sm">Загрузка уроков...</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {lessonsWithTasks.map((lesson) => (
                                        <div key={lesson.id} className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4] overflow-hidden">
                                            {/* Lesson Header */}
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => toggleLesson(lesson.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[rgba(115,77,230,0.1)] rounded-full flex items-center justify-center text-[#734DE6] font-semibold text-sm">
                                                        {lesson.order}
                                                    </div>
                                                    <h3 className="font-semibold text-[#1A1D2D]">{lesson.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditLessonClick(lesson);
                                                        }}
                                                        className="p-1.5 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteLessonClick(lesson);
                                                        }}
                                                        className="p-1.5 text-[#6B7280] hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <div className="p-1.5 text-[#6B7280] cursor-grab">
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tasks List */}
                                            {expandedLessons.includes(lesson.id) && (
                                                <div className="border-t border-[#EEF0F4]">
                                                    {lesson.tasks.length === 0 ? (
                                                        <div className="px-4 py-3 text-sm text-[#9CA3AF]">
                                                            В этом уроке пока нет заданий
                                                        </div>
                                                    ) : (
                                                        lesson.tasks.map((task) => (
                                                            <div
                                                                key={task.id}
                                                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-2 h-2 rounded-full bg-[#E0E4EB]" />
                                                                    <span className="text-sm text-[#1A1D2D]">{task.title}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleEditTask(lesson.id, task.id)}
                                                                    className="flex items-center gap-1 bg-[#14B8A6] text-white px-2.5 py-1 rounded-[6px] text-xs hover:bg-[#0d9488] transition-colors"
                                                                >
                                                                    Редактировать
                                                                    <ChevronLeft className="w-3 h-3 rotate-180" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                    <button
                                                        onClick={() => handleAddTask(lesson.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-3 text-[#734DE6] text-sm hover:bg-gray-50 transition-colors border-t border-[#EEF0F4]"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Добавить задание
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {lessonsWithTasks.length === 0 && !isLoading && (
                                    <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4]">
                                        <p className="text-[#6B7280] mb-4">В этом курсе пока нет уроков</p>
                                        <button
                                            onClick={() => setIsAddLessonModalOpen(true)}
                                            className="text-[#734DE6] font-medium hover:underline"
                                        >
                                            Добавить первый урок
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {isNewCourse && (
                            <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4">
                                <p className="text-amber-700 text-sm">
                                    Сначала сохраните курс, чтобы добавить уроки
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4]">
                        <h2 className="text-lg font-bold text-[#1A1D2D] mb-4">Настройки курса</h2>
                        <p className="text-[#6B7280] text-sm">Дополнительные настройки будут доступны здесь.</p>
                    </div>
                )}
            </div>

            {/* Add Lesson Modal */}
            <AddLessonModal
                isOpen={isAddLessonModalOpen}
                onClose={() => setIsAddLessonModalOpen(false)}
                onSubmit={handleAddLessonSubmit}
                defaultOrder={lessons.length + 1}
                isLoading={isLoading}
            />

            {/* Edit Lesson Modal */}
            <EditLessonModal
                isOpen={isEditLessonModalOpen}
                onClose={() => {
                    setIsEditLessonModalOpen(false);
                    setEditingLesson(null);
                }}
                onSubmit={handleEditLessonSubmit}
                initialData={editingLesson ? {
                    title: editingLesson.title,
                    description: editingLesson.description || '',
                    order: editingLesson.order,
                } : null}
                isLoading={isLoading}
            />

            {/* Confirm Delete Lesson Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteLessonModalOpen}
                onClose={() => {
                    setIsDeleteLessonModalOpen(false);
                    setDeletingLesson(null);
                }}
                onConfirm={handleConfirmDeleteLesson}
                title="Удалить урок"
                message="Вы уверены, что хотите удалить этот урок?"
                itemName={deletingLesson?.title}
                isLoading={isLoading}
            />
        </div>
    );
};

export default EditCoursePage;
