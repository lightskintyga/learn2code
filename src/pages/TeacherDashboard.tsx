import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import closeTagIcon from '../../public/closeTagIcon.svg';
import {
    Plus, Users, BookOpen, CheckCircle, TrendingUp,
    Edit2, MoreVertical, Settings, LogOut
} from 'lucide-react';

// Моковые данные для дашборда
const mockStats = {
    totalCourses: 3,
    totalStudents: 213,
    completedTasks: 1247,
    averageProgress: 68,
};

const mockCourses = [
    {
        id: '1',
        title: 'Мои первые шаги',
        status: 'published' as const,
        emoji: '🐱',
        lessonsCount: 5,
        studentsCount: 124,
    },
    {
        id: '2',
        title: 'Создаём игры',
        status: 'published' as const,
        emoji: '🎮',
        lessonsCount: 12,
        studentsCount: 89,
    },
    {
        id: '3',
        title: 'Продвинутые алгоритмы',
        status: 'draft' as const,
        emoji: '🧩',
        lessonsCount: 3,
        studentsCount: 0,
    },
];

const mockActivity = [
    { id: 1, user: 'Артём К.', action: 'выполнил задание', target: '«Кот идет к яблоку»', time: '5 мин назад', type: 'success' as const },
    { id: 2, user: 'Маша Д.', action: 'начала курс', target: '«Создаём игры»', time: '12 мин назад', type: 'info' as const },
    { id: 3, user: 'Дима Л.', action: 'не прошел проверку', target: '«Циклы»', time: '30 мин назад', type: 'error' as const },
    { id: 4, user: 'Аня С.', action: 'выполнила все задания в уроке', target: '«Движение»', time: '1 час назад', type: 'success' as const },
];

const TeacherDashboard: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!user || user.role !== 'teacher') return null;

    const displayCourses = mockCourses;
    const displayStats = mockStats;
    const displayActivity = mockActivity;

    const getStatusBadge = (status: string) => {
        if (status === 'published') {
            return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Опубликован</span>;
        }
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">Черновик</span>;
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">✓</div>;
            case 'error':
                return <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">✕</div>;
            default:
                return <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">🎮</div>;
        }
    };

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
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Преподаватель</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors">
                            <Settings className="w-5 h-5" />
                            <span className="text-sm">Настройки</span>
                        </button>
                        <button 
                            onClick={logout}
                            className="text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1D2D] mb-1">
                            Панель преподавателя 👨‍🏫
                        </h1>
                        <p className="text-[#6B7280]">
                            Управляйте курсами и отслеживайте прогресс учеников
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/teacher/course/new')}
                        className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                    >
                        <Plus className="w-4 h-4" />
                        Новый курс
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-[#734DE6]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{displayStats.totalCourses}</div>
                            <div className="text-sm text-[#6B7280]">Всего курсов</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(59,130,246,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{displayStats.totalStudents}</div>
                            <div className="text-sm text-[#6B7280]">Учеников</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(16,185,129,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{displayStats.completedTasks.toLocaleString()}</div>
                            <div className="text-sm text-[#6B7280]">Заданий выполнено</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(245,158,11,0.1)] rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#1A1D2D]">{displayStats.averageProgress}%</div>
                            <div className="text-sm text-[#6B7280]">Средний прогресс</div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1A1D2D]">Мои курсы</h2>
                    </div>
                    <div className="space-y-3 mb-10">
                        {displayCourses.map(course => (
                            <div 
                                key={course.id}
                                className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-[#EEF0F4]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#F8FAFB] rounded-[12px] flex items-center justify-center text-2xl">
                                        {course.emoji}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-[#1A1D2D]">{course.title}</h3>
                                            {getStatusBadge(course.status)}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {course.lessonsCount} уроков
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {course.studentsCount} учеников
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => navigate(`/teacher/course/${course.id}/edit`)}
                                        className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Редактировать
                                    </button>
                                    <button className="p-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h2 className="text-lg font-bold text-[#1A1D2D] mb-4">Последняя активность</h2>
                        <div className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4]">
                            {displayActivity.map((activity, index) => (
                                <div 
                                    key={activity.id}
                                    className={`flex items-center justify-between p-4 ${index !== displayActivity.length - 1 ? 'border-b border-[#EEF0F4]' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getActivityIcon(activity.type)}
                                        <span className="text-sm">
                                            <span className="font-medium text-[#1A1D2D]">{activity.user}</span>
                                            {' '}{activity.action}{' '}
                                            <span className="font-medium text-[#1A1D2D]">{activity.target}</span>
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#6B7280]">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            </main>
        </div>
    );
};

export default TeacherDashboard;
