import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { Plus, Search, GraduationCap, BookOpen, Edit, Loader2, Trash2 } from 'lucide-react';

const inputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const groupEmoji = (index: number) => ['📚', '🧩', '🎮', '🤖', '🐱'][index % 5];

const AdminGroups: React.FC = () => {
    const [query, setQuery] = useState('');
    const {
        courses,
        groups,
        isLoading: isCourseLoading,
        error: courseError,
        fetchCourses,
        fetchGroups,
        deleteGroup,
        clearError: clearCourseError,
    } = useCourseStore();
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
        clearError: clearUsersError,
    } = useAdminStore();
    const { addToast } = useToastStore();

    useEffect(() => {
        fetchCourses();
        fetchGroups();
        fetchUsers();
    }, [fetchCourses, fetchGroups, fetchUsers]);

    const getTeacherName = (teacherId: string) => {
        const teacher = users.find((user) => user.id === teacherId);
        return teacher?.displayName || teacher?.email || 'Не назначен';
    };

    const getCourseTitle = (courseId: string) => {
        const course = courses.find((item) => item.id === courseId);
        return course?.title || 'Курс не найден';
    };

    const preparedGroups = groups
        .map((group, index) => ({
            ...group,
            emoji: groupEmoji(index),
            teacher: getTeacherName(group.teacherId),
            course: getCourseTitle(group.courseId),
            studentsCount: group.students?.length || 0,
        }))
        .filter((group) => {
            const normalizedQuery = query.trim().toLowerCase();
            if (!normalizedQuery) return true;

            return [group.name, group.teacher, group.course]
                .filter(Boolean)
                .some((value) => value?.toLowerCase().includes(normalizedQuery));
        });

    const error = courseError || usersError;
    const isInitialLoading =
        (isCourseLoading && groups.length === 0 && courses.length === 0) ||
        (isUsersLoading && users.length === 0);

    const handleDeleteGroup = async (groupId: string, groupName: string) => {
        if (!confirm(`Удалить группу «${groupName}»?`)) return;

        const deleted = await deleteGroup(groupId);
        if (deleted) {
            addToast('Группа удалена', 'success');
        }
    };

    return (
        <AdminLayout
            title="Группы"
            description="Объединения учеников с преподавателем и курсом"
            actions={
                <Link
                    to="/admin/groups/new"
                    className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                >
                    <Plus className="w-4 h-4" /> Новая группа
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
                    placeholder="Поиск групп..."
                    className={inputClass}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {isInitialLoading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px] border border-[#EEF0F4]">
                    <Loader2 className="w-7 h-7 text-[#734DE6] animate-spin mb-3" />
                    <p className="text-sm text-[#6B7280]">Загрузка групп...</p>
                </div>
            )}

            {!isInitialLoading && preparedGroups.length === 0 && (
                <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4]">
                    <p className="font-semibold text-[#1A1D2D]">Группы не найдены</p>
                    <p className="text-sm text-[#6B7280] mt-1">
                        {query ? 'Попробуйте изменить поисковый запрос' : 'Создайте первую группу'}
                    </p>
                </div>
            )}

            {preparedGroups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preparedGroups.map((g) => (
                    <div
                        key={g.id}
                        className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4] space-y-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-[12px] bg-[rgba(115,77,230,0.1)] flex items-center justify-center text-2xl shrink-0">
                                {g.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-[#1A1D2D] truncate">{g.name}</h3>
                                <p className="text-sm text-[#6B7280]">{g.studentsCount} учеников</p>
                            </div>
                            <button
                                className="p-2 rounded-[10px] text-[#6B7280] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                type="button"
                                aria-label="Удалить группу"
                                title="Удалить группу"
                                disabled={isCourseLoading}
                                onClick={() => handleDeleteGroup(g.id, g.name || 'Без названия')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                                <span className="text-[#6B7280]">Преподаватель:</span>
                                <span className="font-semibold text-[#1A1D2D] truncate">{g.teacher}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <BookOpen className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                                <span className="text-[#6B7280]">Курс:</span>
                                {g.course === 'Курс не найден' ? (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800">
                                        не привязан
                                    </span>
                                ) : (
                                    <span className="font-semibold text-[#1A1D2D] truncate">{g.course}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                to={`/admin/groups/${g.id}`}
                                className="flex items-center justify-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors w-full"
                            >
                                <Edit className="w-4 h-4" /> Управлять
                            </Link>
                            <button
                                className="flex items-center justify-center gap-2 border border-red-200 text-red-600 px-3 py-2 rounded-[8px] text-sm hover:bg-red-50 transition-colors w-full disabled:opacity-50"
                                type="button"
                                disabled={isCourseLoading}
                                onClick={() => handleDeleteGroup(g.id, g.name || 'Без названия')}
                            >
                                <Trash2 className="w-4 h-4" /> Удалить
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGroups;
