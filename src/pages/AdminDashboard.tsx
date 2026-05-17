import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import {
    Layers,
    Users,
    GraduationCap,
    BookOpen,
    FolderPlus,
    UserPlus,
    ChevronRight,
    TrendingUp,
    Loader2,
} from 'lucide-react';

const quickActions = [
    {
        label: 'Создать группу',
        desc: 'Объедините учеников и преподавателя',
        icon: FolderPlus,
        to: '/admin/groups/new',
        wrapClass: 'bg-[rgba(115,77,230,0.1)] text-[#734DE6]',
    },
    {
        label: 'Добавить ученика',
        desc: 'Регистрация одного или массовый импорт',
        icon: UserPlus,
        to: '/admin/students/new',
        wrapClass: 'bg-blue-50 text-blue-600',
    },
    {
        label: 'Привязать курс',
        desc: 'Назначить курс существующей группе',
        icon: BookOpen,
        to: '/admin/groups',
        wrapClass: 'bg-violet-50 text-violet-700',
    },
];

const isRole = (role: string | null, expected: 'student' | 'teacher' | 'admin') =>
    role?.toLowerCase() === expected;

const getDisplayName = (displayName: string | null, email: string | null) =>
    displayName || email || 'Без имени';

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'недавно';

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const AdminDashboard: React.FC = () => {
    const {
        courses,
        groups,
        isLoading: isCourseLoading,
        error: courseError,
        fetchCourses,
        fetchGroups,
        clearError: clearCourseError,
    } = useCourseStore();
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
        clearError: clearUsersError,
    } = useAdminStore();

    useEffect(() => {
        fetchCourses();
        fetchGroups();
        fetchUsers();
    }, [fetchCourses, fetchGroups, fetchUsers]);

    const studentsCount = users.filter((user) => isRole(user.role, 'student')).length;
    const teachersCount = users.filter((user) => isRole(user.role, 'teacher')).length;

    const stats = [
        {
            label: 'Группы',
            value: groups.length.toString(),
            icon: Layers,
            wrapClass: 'bg-[rgba(115,77,230,0.1)] text-[#734DE6]',
            to: '/admin/groups',
        },
        {
            label: 'Учеников',
            value: studentsCount.toString(),
            icon: Users,
            wrapClass: 'bg-blue-50 text-blue-600',
            to: '/admin/students',
        },
        {
            label: 'Преподавателей',
            value: teachersCount.toString(),
            icon: GraduationCap,
            wrapClass: 'bg-amber-50 text-amber-700',
            to: '/admin/teachers',
        },
        {
            label: 'Курсов',
            value: courses.length.toString(),
            icon: BookOpen,
            wrapClass: 'bg-emerald-50 text-emerald-700',
            to: '/admin/courses',
        },
    ];

    const recent = [
        ...groups.map((group) => ({
            id: `group-${group.id}`,
            text: `Создана группа «${group.name || 'Без названия'}»`,
            time: group.createdAt,
            icon: Layers,
        })),
        ...courses.map((course) => ({
            id: `course-${course.id}`,
            text: `Создан курс «${course.title || 'Без названия'}»`,
            time: course.createdAt,
            icon: BookOpen,
        })),
        ...users.map((user) => ({
            id: `user-${user.id}`,
            text: `Добавлен пользователь ${getDisplayName(user.displayName, user.email)}`,
            time: user.createdAt,
            icon: Users,
        })),
    ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

    const error = courseError || usersError;
    const isInitialLoading =
        (isCourseLoading && courses.length === 0 && groups.length === 0) ||
        (isUsersLoading && users.length === 0);

    return (
        <AdminLayout
            title="Админ-панель 🛡️"
            description="Управляйте группами, пользователями и курсами"
        >
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearCourseError();
                            clearUsersError();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            {isInitialLoading && (
                <div className="flex items-center gap-3 text-[#6B7280] bg-white rounded-[16px] border border-[#EEF0F4] p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#734DE6]" />
                    <span className="text-sm">Загрузка данных админ-панели...</span>
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Link key={s.label} to={s.to} className="group">
                        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4] hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 h-full">
                            <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${s.wrapClass}`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#1A1D2D]">{s.value}</p>
                                <p className="text-sm text-[#6B7280] font-medium">{s.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#1A1D2D]">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((a) => (
                        <Link key={a.label} to={a.to} className="group h-full">
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4] hover:shadow-md transition-all h-full flex flex-col gap-3">
                                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${a.wrapClass}`}>
                                    <a.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1A1D2D] flex items-center gap-2">
                                        {a.label}
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#734DE6]" />
                                    </h3>
                                    <p className="text-sm text-[#6B7280] mt-0.5">{a.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-[#1A1D2D]">Последняя активность</h2>
                    <button className="text-sm font-semibold text-[#6B7280] hover:text-[#1A1D2D] flex items-center gap-1" type="button">
                        <TrendingUp className="w-4 h-4" /> Аналитика
                    </button>
                </div>
                <div className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4] divide-y divide-[#EEF0F4]">
                    {recent.length === 0 ? (
                        <div className="p-6 text-sm text-[#6B7280] text-center">
                            Пока нет данных для отображения
                        </div>
                    ) : (
                        recent.map((r) => (
                            <div key={r.id} className="flex items-center gap-4 p-4">
                                <div className="w-9 h-9 rounded-[10px] bg-[#F8FAFB] border border-[#EEF0F4] text-[#734DE6] flex items-center justify-center shrink-0">
                                    <r.icon className="w-4 h-4" />
                                </div>
                                <p className="flex-1 text-sm text-[#1A1D2D]">{r.text}</p>
                                <span className="text-xs text-[#6B7280] shrink-0">{formatDateTime(r.time)}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminDashboard;
