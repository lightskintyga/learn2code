import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { BookOpen, Clock, CheckCircle, Play, Lock, ChevronLeft } from 'lucide-react';

// Моковые данные курса
const courseData = {
    id: '1',
    title: 'Мои первые шаги',
    description: 'Научись основам программирования с котом Скретчем! Создавай анимации, управляй персонажами и решай задачи.',
    emoji: '🐱',
    lessonsCount: 5,
    hoursCount: 2,
    progress: 62,
};

// Моковые данные уроков
const lessons = [
    {
        id: '1-1',
        title: 'Знакомство со Скретчем',
        tasksCompleted: 3,
        tasksTotal: 3,
        duration: 15,
        status: 'completed',
    },
    {
        id: '1-2',
        title: 'Движение персонажей',
        tasksCompleted: 2,
        tasksTotal: 4,
        duration: 20,
        status: 'in-progress',
    },
    {
        id: '1-3',
        title: 'События и реакции',
        tasksCompleted: 0,
        tasksTotal: 3,
        duration: 25,
        status: 'available',
    },
    {
        id: '1-4',
        title: 'Циклы и повторения',
        tasksCompleted: 0,
        tasksTotal: 5,
        duration: 30,
        status: 'locked',
    },
    {
        id: '1-5',
        title: 'Условия и выбор',
        tasksCompleted: 0,
        tasksTotal: 4,
        duration: 25,
        status: 'locked',
    },
];

const CoursePage: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    if (!user || user.role !== 'student') return null;

    const getLessonIcon = (status: string) => {
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

    const getLessonStyles = (status: string) => {
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

    const getActionButton = (lesson: typeof lessons[0]) => {
        switch (lesson.status) {
            case 'completed':
                return null;
            case 'in-progress':
                return (
                    <button 
                        onClick={() => navigate(`/editor/${lesson.id}`)}
                        className="bg-[#734DE6] text-white px-5 py-2.5 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors"
                    >
                        Продолжить
                    </button>
                );
            case 'available':
                return (
                    <button 
                        onClick={() => navigate(`/editor/${lesson.id}`)}
                        className="border border-[#E0E4EB] text-[#1A1D2D] px-5 py-2.5 rounded-[10px] text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Начать
                    </button>
                );
            case 'locked':
                return (
                    <button 
                        disabled
                        className="border border-[#E0E4EB] text-gray-400 px-5 py-2.5 rounded-[10px] text-sm font-medium cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                    </button>
                );
            default:
                return null;
        }
    };

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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-4xl">{courseData.emoji}</span>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{courseData.title}</h1>
                            </div>
                            <p className="text-white/80 max-w-xl mb-4">
                                {courseData.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-white/70">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    {courseData.lessonsCount} уроков
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    ~{courseData.hoursCount} часа
                                </span>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-5 min-w-[180px]">
                            <div className="text-white/70 text-sm mb-1">Прогресс</div>
                            <div className="text-3xl font-bold text-white mb-3">{courseData.progress}%</div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#734DE6] rounded-full"
                                    style={{ width: `${courseData.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-xl font-bold text-[#1A1D2D] mb-5">Уроки</h2>
                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <div 
                            key={lesson.id}
                            className={`flex items-center gap-4 p-4 rounded-[16px] border-2 ${getLessonStyles(lesson.status)} ${lesson.status !== 'locked' ? 'cursor-pointer' : ''}`}
                            onClick={() => lesson.status !== 'locked' && navigate(`/editor/${lesson.id}`)}
                        >
                            {/* Lesson Icon */}
                            {getLessonIcon(lesson.status)}

                            {/* Lesson Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className={`font-semibold ${lesson.status === 'locked' ? 'text-gray-400' : 'text-[#1A1D2D]'}`}>
                                        {lesson.title}
                                    </h3>
                                    {lesson.status === 'in-progress' && (
                                        <span className="bg-[rgba(115,77,230,0.1)] text-[#734DE6] text-xs px-2 py-0.5 rounded-full">
                                            В процессе
                                        </span>
                                    )}
                                </div>
                                <div className={`text-sm mt-1 ${lesson.status === 'locked' ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                    {lesson.tasksCompleted}/{lesson.tasksTotal} заданий · {lesson.duration} мин
                                </div>
                            </div>

                            {/* Action Button */}
                            <div onClick={e => e.stopPropagation()}>
                                {getActionButton(lesson)}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CoursePage;
