import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import closeTagIcon from '../../public/closeTagIcon.svg';
import { BookOpen, Users, Star, Clock, BookOpenCheck } from 'lucide-react';

// Моковые данные курсов (в реальности будут приходить с бэкенда)
const courses = [
    {
        id: '1',
        title: 'Мои первые шаги',
        description: 'Научись основам программирования с котом Скретчем!',
        emoji: '🐱',
        gradient: 'from-[#6366F1] to-[#8B5CF6]',
        lessonsCount: 8,
        studentsCount: 124,
        rating: 4.8,
        progress: 62,
    },
    {
        id: '2',
        title: 'Создаём игры',
        description: 'Создай свою первую игру с анимацией и звуками!',
        emoji: '🎮',
        gradient: 'from-[#A855F7] to-[#EC4899]',
        lessonsCount: 12,
        studentsCount: 89,
        rating: 4.9,
        progress: 25,
    },
    {
        id: '3',
        title: 'Анимации и истории',
        description: 'Оживляй персонажей и рассказывай интерактивные истории.',
        emoji: '🎬',
        gradient: 'from-[#F59E0B] to-[#F97316]',
        lessonsCount: 6,
        studentsCount: 67,
        rating: 4.7,
        progress: 0,
    },
    {
        id: '4',
        title: 'Музыка и звуки',
        description: 'Создавай музыкальные проекты и работай со звуками.',
        emoji: '🎵',
        gradient: 'from-[#10B981] to-[#14B8A6]',
        lessonsCount: 5,
        studentsCount: 45,
        rating: 4.6,
        progress: 0,
    },
];

// Моковая статистика
const stats = {
    coursesStarted: 2,
    tasksCompleted: 15,
    hoursLearned: 8.5,
};

const StudentDashboard: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!user || user.role !== 'student') return null;

    return (
        <div className="min-h-screen bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[10px] p-2">
                            <img src={closeTagIcon} alt="Logo" className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-[#1A1D2D]">Learn2Code</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span className="text-sm">Профиль</span>
                        </button>
                        <button 
                            onClick={logout}
                            className="text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1A1D2D] mb-2">
                        Привет, {user.displayName || 'Ученик'}! 👋
                    </h1>
                    <p className="text-[#6B7280]">
                        Продолжай учиться и создавай крутые проекты
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-[#734DE6]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{stats.coursesStarted}</div>
                            <div className="text-sm text-[#6B7280]">Курсов начато</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(245,158,11,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <BookOpenCheck className="w-6 h-6 text-[#F59E0B]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{stats.tasksCompleted}</div>
                            <div className="text-sm text-[#6B7280]">Заданий выполнено</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(20,184,166,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#14B8A6]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{stats.hoursLearned}</div>
                            <div className="text-sm text-[#6B7280]">Часов обучения</div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <h2 className="text-xl font-bold text-[#1A1D2D] mb-5">Мои курсы</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {courses.map(course => (
                            <div 
                                key={course.id}
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#EEF0F4] cursor-pointer hover:shadow-md transition-shadow"
                            >
                                {/* Course Header with Gradient */}
                                <div className={`h-28 bg-gradient-to-r ${course.gradient} relative flex items-center justify-center`}>
                                    {course.progress > 0 && (
                                        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-medium text-[#1A1D2D]">
                                            {course.progress}%
                                        </div>
                                    )}
                                    <span className="text-5xl">{course.emoji}</span>
                                </div>
                                
                                {/* Course Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-[#1A1D2D] mb-1">{course.title}</h3>
                                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{course.description}</p>
                                    
                                    {/* Course Meta */}
                                    <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-3">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {course.lessonsCount} уроков
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {course.studentsCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                                            {course.rating}
                                        </span>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    {course.progress > 0 && (
                                        <div className="h-1.5 bg-[#EEF0F4] rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#734DE6] to-[#14B8A6] rounded-full"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
