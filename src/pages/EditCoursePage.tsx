import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Settings, Save, Eye, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

// Моковые данные курса
const mockCourse = {
    id: '1',
    title: 'Мои первые шаги',
    description: 'Научись основам программирования с котом Скретчем!',
    emoji: '🐱',
    status: 'published',
    lessons: [
        {
            id: 'lesson-1',
            order: 1,
            title: 'Знакомство со Скретчем',
            tasks: [
                { id: 'task-1-1', title: 'Перемести кота', order: 1 },
                { id: 'task-1-2', title: 'Измени размер', order: 2 },
                { id: 'task-1-3', title: 'Добавь звук', order: 3 },
            ],
        },
        {
            id: 'lesson-2',
            order: 2,
            title: 'Движение',
            tasks: [
                { id: 'task-2-1', title: 'Кот идет к яблоку', order: 1 },
                { id: 'task-2-2', title: 'Кот ходит по кругу', order: 2 },
            ],
        },
    ],
};

const EditCoursePage: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [expandedLessons, setExpandedLessons] = useState<string[]>(['lesson-1']);
    const [course, setCourse] = useState(mockCourse);
    const [formData, setFormData] = useState({
        title: course.title,
        description: course.description,
        emoji: course.emoji,
        status: course.status,
    });

    const isNewCourse = courseId === 'new';

    const toggleLesson = (lessonId: string) => {
        setExpandedLessons(prev => 
            prev.includes(lessonId) 
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleSave = () => {
        // TODO: Сохранить курс
        alert('Курс сохранен!');
        if (isNewCourse) {
            navigate('/teacher');
        }
    };

    const handleAddLesson = () => {
        const newLesson = {
            id: `lesson-${Date.now()}`,
            order: course.lessons.length + 1,
            title: `Урок ${course.lessons.length + 1}`,
            tasks: [],
        };
        setCourse(prev => ({
            ...prev,
            lessons: [...prev.lessons, newLesson],
        }));
        setExpandedLessons(prev => [...prev, newLesson.id]);
    };

    const handleAddTask = (lessonId: string) => {
        const lesson = course.lessons.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const newTask = {
            id: `task-${Date.now()}`,
            title: `Задание ${lesson.tasks.length + 1}`,
            order: lesson.tasks.length + 1,
        };
        
        setCourse(prev => ({
            ...prev,
            lessons: prev.lessons.map(l => 
                l.id === lessonId 
                    ? { ...l, tasks: [...l.tasks, newTask] }
                    : l
            ),
        }));
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
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Сохранить
                        </button>
                    </div>
                </div>
            </header>

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
                                <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Название курса</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Описание</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
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
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-[#1A1D2D]">Уроки</h2>
                                <button 
                                    onClick={handleAddLesson}
                                    className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[10px] text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Добавить урок
                                </button>
                            </div>

                            <div className="space-y-3">
                                {course.lessons.map((lesson) => (
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
                                                <button className="p-1.5 text-[#6B7280] hover:text-[#1A1D2D] transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-[#6B7280] hover:text-red-500 transition-colors">
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
                                                {lesson.tasks.map((task) => (
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
                                                ))}
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
                        </div>
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
        </div>
    );
};

export default EditCoursePage;
