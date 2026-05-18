import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { api } from '@/services/api';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { Plus, Search, Users, Layers, Edit, MoreVertical, Loader2 } from 'lucide-react';

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const courseEmoji = (title: string | null, index: number) => {
    const lowerTitle = (title || '').toLowerCase();
    if (lowerTitle.includes('игр')) return '🎮';
    if (lowerTitle.includes('алгоритм')) return '🧩';
    if (lowerTitle.includes('робот')) return '🤖';
    if (lowerTitle.includes('перв')) return '🐱';
    return ['📚', '💡', '🧠', '🚀'][index % 4];
};

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'дата неизвестна';

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const AdminCourses: React.FC = () => {
    const [query, setQuery] = useState('');
    const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});
    const [lessonCountError, setLessonCountError] = useState<string | null>(null);
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

    useEffect(() => {
        if (courses.length === 0) {
            setLessonCounts({});
            return;
        }

        let isMounted = true;
        setLessonCountError(null);

        Promise.all(
            courses.map(async (course) => {
                const lessons = await api.getLessons(course.id);
                return [course.id, lessons.length] as const;
            })
        )
            .then((entries) => {
                if (isMounted) {
                    setLessonCounts(Object.fromEntries(entries));
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLessonCountError('Не удалось загрузить количество уроков');
                }
            });

        return () => {
            isMounted = false;
        };
    }, [courses]);

    const preparedCourses = courses
        .map((course, index) => {
            const teacher = users.find((user) => user.id === course.teacherId);
            return {
                ...course,
                title: course.title || 'Без названия',
                emoji: courseEmoji(course.title, index),
                lessonsCount: lessonCounts[course.id] || 0,
                groupsCount: groups.filter((group) => group.courseId === course.id).length,
                author: teacher?.displayName || teacher?.email || 'Автор не найден',
                createdAtText: formatDate(course.createdAt),
            };
        })
        .filter((course) => {
            const normalizedQuery = query.trim().toLowerCase();
            if (!normalizedQuery) return true;
            return `${course.title} ${course.author}`.toLowerCase().includes(normalizedQuery);
        });

    const error = courseError || usersError || lessonCountError;
    const isInitialLoading =
        (isCourseLoading && courses.length === 0 && groups.length === 0) ||
        (isUsersLoading && users.length === 0);

    return (
        <AdminLayout
            title="Курсы"
            description="Все курсы платформы — созданы администратором или преподавателями"
            actions={
                <Link
                    to="/teacher"
                    className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] shadow-lg shadow-purple-200"
                >
                    <Plus className="w-4 h-4" /> Новый курс
                </Link>
            }
        >
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearCourseError();
                            clearUsersError();
                            setLessonCountError(null);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                    type="search"
                    placeholder="Поиск курсов..."
                    className={searchInputClass}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {isInitialLoading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px] border border-[#EEF0F4]">
                    <Loader2 className="w-7 h-7 text-[#734DE6] animate-spin mb-3" />
                    <p className="text-sm text-[#6B7280]">Загрузка курсов...</p>
                </div>
            )}

            {!isInitialLoading && preparedCourses.length === 0 && (
                <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4]">
                    <p className="font-semibold text-[#1A1D2D]">Курсы не найдены</p>
                    <p className="text-sm text-[#6B7280] mt-1">
                        {query ? 'Попробуйте изменить поисковый запрос' : 'Создайте первый курс'}
                    </p>
                </div>
            )}

            {preparedCourses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {preparedCourses.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4] hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                        >
                            <div className="bg-gradient-to-br from-[rgba(115,77,230,0.12)] to-blue-50 p-6 flex items-center justify-between">
                                <span className="text-5xl">{c.emoji}</span>
                                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800">
                                    {c.createdAtText}
                                </span>
                            </div>
                            <div className="p-5 space-y-4 flex-1 flex flex-col">
                                <div>
                                    <h3 className="font-bold text-lg text-[#1A1D2D] leading-tight">{c.title}</h3>
                                    <p className="text-xs text-[#6B7280] mt-1">Автор: {c.author}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                    <span className="flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5" /> {c.lessonsCount} уроков
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" /> {c.groupsCount} групп
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-auto pt-2">
                                    <Link
                                        to={`/teacher/course/${c.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" /> Открыть
                                    </Link>
                                    <button
                                        className="p-2 rounded-[10px] text-[#6B7280] hover:bg-gray-50"
                                        type="button"
                                        aria-label="Ещё"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCourses;
