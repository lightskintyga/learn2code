import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { BookOpen, Clock, CheckCircle, Play, Lock, ChevronLeft, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskDto } from '@/services/api';

// Расширенный тип урока с задачами
interface LessonWithTasks {
    id: string;
    title: string;
    order: number;
    tasks: TaskDto[];
    status: 'completed' | 'in-progress' | 'available' | 'locked';
}

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const [lessonTasks, setLessonTasks] = useState<Record<string, TaskDto[]>>({});

    const {
        currentCourse,
        lessons,
        tasks,
        progress,
        isLoading,
        error,
        fetchCourse,
        fetchLessons,
        fetchTasks,
        fetchProgress,
        clearError,
    } = useCourseStore();

    // Загружаем курс и уроки
    useEffect(() => {
        if (courseId) {
            fetchCourse(courseId);
            fetchLessons(courseId);
            fetchProgress();
        }
    }, [courseId, fetchCourse, fetchLessons, fetchProgress]);

    // Загружаем задачи при раскрытии урока
    useEffect(() => {
        if (expandedLessonId) {
            fetchTasks(expandedLessonId);
        }
    }, [expandedLessonId, fetchTasks]);

    if (!user || user.role !== 'student') return null;

    // Считаем прогресс курса
    const courseProgress = progress.find(p => p.courseId === courseId);
    const progressPercentage = courseProgress?.percentage || 0;

    // Определяем статус урока
    const getLessonStatus = (index: number): LessonWithTasks['status'] => {
        if (index === 0) return 'available';
        // TODO: Реальная логика на основе прогресса
        return 'locked';
    };

    // Подготавливаем уроки
    const lessonsWithStatus: LessonWithTasks[] = lessons.map((lesson, index) => ({
        ...lesson,
        tasks: lessonTasks[lesson.id] || [],
        status: getLessonStatus(index),
    }));

    const getLessonIcon = (status: LessonWithTasks['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                );
            case 'in-progress':
                return (
                    <div className="w-12 h-12 bg-[rgba(115,77,230,0.1)] rounded-[12px] flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#734DE6]" />
                    </div>
                );
            case 'available':
                return (
                    <div className="w-12 h-12 bg-gray-100 rounded-[12px] flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
                    </div>
                );
            case 'locked':
                return (
                    <div className="w-12 h-12 bg-gray-100 rounded-[12px] flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                );
            default:
                return null;
        }
    };

    const getLessonStyles = (status: LessonWithTasks['status']) => {
        switch (status) {
            case 'in-progress':
                return 'border-[#734DE6] bg-white shadow-sm';
            case 'completed':
                return 'border-[#EEF0F4] bg-white';
            case 'available':
                return 'border-[#EEF0F4] bg-white hover:border-[#734DE6] transition-colors';
            case 'locked':
                return 'border-[#EEF0F4] bg-gray-50 opacity-60';
            default:
                return '';
        }
    };

    const handleLessonClick = (lessonId: string, status: LessonWithTasks['status']) => {
        if (status === 'locked') return;
        setExpandedLessonId(prev => prev === lessonId ? null : lessonId);
    };

    const handleStartTask = (taskId: string) => {
        navigate(`/editor/${taskId}`);
    };

    const courseEmoji = '🐱';

    return (
        <div className="min-h-screen bg-[#F8FAFB]">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-[#734DE6] via-[#6366F1] to-[#14B8A6] relative">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/student')}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Назад к курсам</span>
                    </button>

                    {/* Course Info */}
                    {isLoading && !currentCourse ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                            <span className="text-white">Загрузка курса...</span>
                        </div>
                    ) : currentCourse ? (
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-4xl">{courseEmoji}</span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">{currentCourse.title}</h1>
                                </div>
                                <p className="text-white/80 max-w-xl mb-4">
                                    {currentCourse.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" />
                                        {lessons.length} уроков
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        ~{Math.round(lessons.length * 0.5)} часа
                                    </span>
                                </div>
                            </div>

                            {/* Progress Card */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-5 min-w-[180px]">
                                <div className="text-white/70 text-sm mb-1">Прогресс</div>
                                <div className="text-3xl font-bold text-white mb-3">{progressPercentage}%</div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#734DE6] rounded-full"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Lessons List */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between">
                        <span className="text-red-600 text-sm">{error}</span>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && lessons.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#734DE6] animate-spin mb-4" />
                        <p className="text-[#6B7280]">Загрузка уроков...</p>
                    </div>
                )}

                <h2 className="text-xl font-bold text-[#1A1D2D] mb-5">Уроки</h2>

                {lessons.length === 0 && !isLoading ? (
                    <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4]">
                        <p className="text-[#6B7280]">В этом курсе пока нет уроков</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lessonsWithStatus.map((lesson) => (
                            <div key={lesson.id}>
                                <div
                                    className={`flex items-center gap-4 p-4 rounded-[16px] border-2 ${getLessonStyles(lesson.status)} ${lesson.status !== 'locked' ? 'cursor-pointer' : ''}`}
                                    onClick={() => handleLessonClick(lesson.id, lesson.status)}
                                >
                                    {/* Lesson Icon */}
                                    {getLessonIcon(lesson.status)}

                                    {/* Lesson Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`font-semibold ${lesson.status === 'locked' ? 'text-gray-400' : 'text-[#1A1D2D]'}`}>
                                                {lesson.order}. {lesson.title}
                                            </h3>
                                            {lesson.status === 'in-progress' && (
                                                <span className="bg-[rgba(115,77,230,0.1)] text-[#734DE6] text-xs px-2 py-0.5 rounded-full">
                                                    В процессе
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm mt-1 ${lesson.status === 'locked' ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                            {lesson.tasks.length} заданий · ~{lesson.tasks.length * 15} мин
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    {lesson.status !== 'locked' && (
                                        <div className="text-[#6B7280]">
                                            {expandedLessonId === lesson.id ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Tasks List */}
                                {expandedLessonId === lesson.id && lesson.status !== 'locked' && (
                                    <div className="ml-16 mt-2 space-y-2">
                                        {isLoading ? (
                                            <div className="flex items-center gap-2 py-3">
                                                <Loader2 className="w-4 h-4 text-[#734DE6] animate-spin" />
                                                <span className="text-sm text-[#6B7280]">Загрузка заданий...</span>
                                            </div>
                                        ) : tasks.length === 0 ? (
                                            <div className="py-3 text-sm text-[#9CA3AF]">
                                                В этом уроке пока нет заданий
                                            </div>
                                        ) : (
                                            tasks.map((task, index) => (
                                                <div
                                                    key={task.id}
                                                    className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-[#EEF0F4] hover:border-[#734DE6] transition-colors cursor-pointer"
                                                    onClick={() => handleStartTask(task.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-[rgba(115,77,230,0.1)] rounded-full flex items-center justify-center text-[#734DE6] text-xs font-medium">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-sm font-medium text-[#1A1D2D]">{task.title}</span>
                                                    </div>
                                                    <button className="px-3 py-1.5 bg-[#734DE6] text-white text-xs font-medium rounded-[8px] hover:bg-[#5a3eb8] transition-colors">
                                                        Начать
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CoursePage;
