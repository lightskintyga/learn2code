import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import closeTagIcon from '../../public/closeTagIcon.svg';
import {
    Plus, Users, BookOpen, CheckCircle, TrendingUp,
    Edit2, MoreVertical, Settings, LogOut, Loader2,
    GraduationCap, ChevronRight, Trash2
} from 'lucide-react';
import CreateGroupModal from '@/components/modals/CreateGroupModal';
import ManageGroupModal from '@/components/modals/ManageGroupModal';
import CreateCourseModal from '@/components/modals/CreateCourseModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

// Временные данные для активности (будут заменены на API позже)
const mockActivity = [
    { id: 1, user: 'Артём К.', action: 'выполнил задание', target: '«Кот идет к яблоку»', time: '5 мин назад', type: 'success' as const },
    { id: 2, user: 'Маша Д.', action: 'начала курс', target: '«Создаём игры»', time: '12 мин назад', type: 'info' as const },
    { id: 3, user: 'Дима Л.', action: 'не прошел проверку', target: '«Циклы»', time: '30 мин назад', type: 'error' as const },
    { id: 4, user: 'Аня С.', action: 'выполнила все задания в уроке', target: '«Движение»', time: '1 час назад', type: 'success' as const },
];

const TeacherDashboard: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const { addToast } = useToastStore();
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
    const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState<{ id: string; title: string } | null>(null);
    const [manageGroupId, setManageGroupId] = useState<string | null>(null);

    const {
        courses,
        groups,
        isLoading,
        error,
        fetchCourses,
        fetchGroups,
        createCourse,
        deleteCourse,
        createGroup,
        addStudentToGroup,
        removeStudentFromGroup,
        clearError,
    } = useCourseStore();

    // Загружаем данные при монтировании
    useEffect(() => {
        fetchCourses();
        // Группы загружаем только для админов
        if (user?.role === 'admin') {
            fetchGroups();
        }
    }, [fetchCourses, fetchGroups, user?.role]);

    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) return null;

    // Считаем статистику
    const totalStudents = groups.reduce((sum, group) => sum + (group.students?.length || 0), 0);

    // Подготавливаем курсы для отображения
    const displayCourses = courses.map(course => ({
        id: course.id,
        title: course.title,
        status: 'published' as const,
        emoji: '📚',
        lessonsCount: 0,
        studentsCount: groups
            .filter(g => g.courseId === course.id)
            .reduce((sum, g) => sum + (g.students?.length || 0), 0),
    }));

    const displayStats = {
        totalCourses: courses.length,
        totalStudents,
        completedTasks: 1247,
        averageProgress: courses.length > 0 ? 68 : 0,
    };

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

    const handleCreateCourse = async (data: { title: string; description: string }) => {
        const course = await createCourse({
            title: data.title,
            description: data.description,
        });

        if (course) {
            addToast('Курс создан', 'success');
            setIsCreateCourseModalOpen(false);
            navigate(`/teacher/course/${course.id}/edit`);
        }
    };

    const handleDeleteCourseClick = (courseId: string, courseTitle: string) => {
        setDeletingCourse({ id: courseId, title: courseTitle });
        setIsDeleteCourseModalOpen(true);
    };

    const handleConfirmDeleteCourse = async () => {
        if (!deletingCourse) return;

        const success = await deleteCourse(deletingCourse.id);
        if (success) {
            addToast('Курс удален', 'success');
            setIsDeleteCourseModalOpen(false);
            setDeletingCourse(null);
        }
    };

    const handleCreateGroup = async (data: { name: string; description: string; courseId: string; studentIds: string[] }) => {
        const group = await createGroup({
            name: data.name,
            description: data.description,
            courseId: data.courseId,
            teacherId: user?.id || '',
        });

        if (group) {
            // Добавляем выбранных студентов
            for (const studentId of data.studentIds) {
                await addStudentToGroup(group.id, studentId);
            }
            addToast('Группа создана', 'success');
            setIsCreateGroupModalOpen(false);
        }
    };

    const currentManageGroup = groups.find(g => g.id === manageGroupId) || null;

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
                    <div className="flex gap-3">
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setIsCreateGroupModalOpen(true)}
                                disabled={isLoading || courses.length === 0}
                                className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-4 py-2.5 rounded-[10px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <GraduationCap className="w-4 h-4" />
                                Новая группа
                            </button>
                        )}
                        <button
                            onClick={() => setIsCreateCourseModalOpen(true)}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Новый курс
                        </button>
                    </div>
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

                {/* Two Column Layout */}
                <div className={`grid grid-cols-1 gap-6 ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                    {/* Left Column - Courses */}
                    <div className={user?.role === 'admin' ? 'lg:col-span-2' : ''}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#1A1D2D]">Мои курсы</h2>
                        </div>

                        {/* Loading State */}
                        {isLoading && courses.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 bg-white rounded-[16px] border border-[#EEF0F4] mb-6">
                                <Loader2 className="w-6 h-6 text-[#734DE6] animate-spin mb-3" />
                                <p className="text-[#6B7280] text-sm">Загрузка курсов...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && displayCourses.length === 0 && (
                            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4] mb-6">
                                <p className="text-[#6B7280] mb-4">У вас пока нет созданных курсов</p>
                                <button
                                    onClick={() => setIsCreateCourseModalOpen(true)}
                                    className="text-[#734DE6] font-medium hover:underline"
                                >
                                    Создать первый курс
                                </button>
                            </div>
                        )}

                        {/* Courses List */}
                        {displayCourses.length > 0 && (
                            <div className="space-y-3 mb-8">
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
                                            <button
                                                onClick={() => handleDeleteCourseClick(course.id, course.title)}
                                                className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                                                title="Удалить курс"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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
                    </div>

                    {/* Right Column - Groups (только для админов) */}
                    {user?.role === 'admin' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-[#1A1D2D]">Группы</h2>
                                <button
                                    onClick={() => setIsCreateGroupModalOpen(true)}
                                    disabled={courses.length === 0}
                                    className="text-[#734DE6] text-sm font-medium hover:underline disabled:opacity-50"
                                >
                                    + Создать
                                </button>
                            </div>

                            {groups.length === 0 ? (
                                <div className="bg-white rounded-[16px] p-6 text-center border border-[#EEF0F4]">
                                    <div className="w-12 h-12 bg-[#F8FAFB] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <GraduationCap className="w-6 h-6 text-[#9CA3AF]" />
                                    </div>
                                    <p className="text-[#6B7280] text-sm mb-2">Нет созданных групп</p>
                                    <p className="text-xs text-[#9CA3AF]">
                                        Создайте группу, чтобы добавлять учеников
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {groups.map(group => {
                                        const course = courses.find(c => c.id === group.courseId);
                                        return (
                                            <div
                                                key={group.id}
                                                className="bg-white rounded-[16px] p-4 shadow-sm border border-[#EEF0F4]"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-[#1A1D2D]">{group.name}</h3>
                                                        <p className="text-xs text-[#6B7280]">
                                                            {course?.title || 'Курс не найден'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setManageGroupId(group.id)}
                                                        className="p-2 text-[#734DE6] hover:bg-[rgba(115,77,230,0.1)] rounded-[8px] transition-colors"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                                                    <Users className="w-4 h-4" />
                                                    <span>{group.students?.length || 0} учеников</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <CreateCourseModal
                isOpen={isCreateCourseModalOpen}
                onClose={() => setIsCreateCourseModalOpen(false)}
                onSubmit={handleCreateCourse}
                isLoading={isLoading}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteCourseModalOpen}
                onClose={() => {
                    setIsDeleteCourseModalOpen(false);
                    setDeletingCourse(null);
                }}
                onConfirm={handleConfirmDeleteCourse}
                title="Удалить курс"
                message="Вы уверены, что хотите удалить этот курс?"
                itemName={deletingCourse?.title}
                isLoading={isLoading}
            />

            {/* Модалки групп только для админов */}
            {user?.role === 'admin' && (
                <>
                    <CreateGroupModal
                        isOpen={isCreateGroupModalOpen}
                        onClose={() => setIsCreateGroupModalOpen(false)}
                        onSubmit={handleCreateGroup}
                        courses={courses.map(c => ({ id: c.id, title: c.title }))}
                        isLoading={isLoading}
                    />

                    <ManageGroupModal
                        isOpen={!!manageGroupId}
                        onClose={() => setManageGroupId(null)}
                        group={currentManageGroup}
                        onAddStudent={addStudentToGroup}
                        onRemoveStudent={removeStudentFromGroup}
                        availableStudents={[]}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
};

export default TeacherDashboard;
