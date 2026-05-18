import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { Plus, Search, Mail, MoreVertical, Layers, BookOpen, Loader2, Save, X } from 'lucide-react';

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const fieldClass =
    'w-full border border-[#EEF0F4] rounded-[10px] h-11 px-3 text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const teacherEmoji = (index: number) => ['👩‍🏫', '👨‍🏫', '🧑‍💻', '📘'][index % 4];

const AdminTeachers: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({
        displayName: '',
        email: '',
        password: 'teacher-123',
    });
    const { addToast } = useToastStore();
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
        createUser,
        clearError: clearUsersError,
    } = useAdminStore();
    const {
        courses,
        groups,
        isLoading: isCourseLoading,
        error: courseError,
        fetchCourses,
        fetchGroups,
        clearError: clearCourseError,
    } = useCourseStore();

    useEffect(() => {
        fetchUsers();
        fetchCourses();
        fetchGroups();
    }, [fetchUsers, fetchCourses, fetchGroups]);

    const teachers = users
        .filter((user) => user.role?.toLowerCase() === 'teacher')
        .map((teacher, index) => ({
            ...teacher,
            name: teacher.displayName || teacher.email || 'Без имени',
            email: teacher.email || 'Нет email',
            emoji: teacherEmoji(index),
            groupsCount: groups.filter((group) => group.teacherId === teacher.id).length,
            coursesCount: courses.filter((course) => course.teacherId === teacher.id).length,
        }))
        .filter((teacher) => {
            const normalizedQuery = query.trim().toLowerCase();
            if (!normalizedQuery) return true;
            return `${teacher.name} ${teacher.email}`.toLowerCase().includes(normalizedQuery);
        });

    const handleCreateTeacher = async (event: React.FormEvent) => {
        event.preventDefault();
        const displayName = form.displayName.trim();
        const email = form.email.trim();
        const password = form.password.trim();

        if (!displayName || !email || password.length < 6) {
            addToast('Заполните имя, email и пароль от 6 символов', 'error');
            return;
        }

        const teacher = await createUser({
            displayName,
            email,
            password,
            role: 'Teacher',
        });

        if (teacher) {
            addToast('Преподаватель создан', 'success');
            setForm({ displayName: '', email: '', password: 'teacher-123' });
            setIsFormOpen(false);
        }
    };

    const error = usersError || courseError;
    const isInitialLoading =
        (isUsersLoading && users.length === 0) ||
        (isCourseLoading && courses.length === 0 && groups.length === 0);

    return (
        <AdminLayout
            title="Преподаватели"
            description="Учётные записи и нагрузка преподавателей"
            actions={
                <button
                    onClick={() => setIsFormOpen((value) => !value)}
                    className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] shadow-lg shadow-purple-200"
                    type="button"
                >
                    <Plus className="w-4 h-4" /> Новый преподаватель
                </button>
            }
        >
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearUsersError();
                            clearCourseError();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            {isFormOpen && (
                <form
                    onSubmit={handleCreateTeacher}
                    className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4] grid grid-cols-1 md:grid-cols-[1fr_1fr_180px_auto] gap-3 items-end"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Имя</label>
                        <input
                            className={fieldClass}
                            value={form.displayName}
                            onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
                            placeholder="Иван Иванов"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Email</label>
                        <input
                            className={fieldClass}
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                            placeholder="teacher@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Пароль</label>
                        <input
                            className={fieldClass}
                            value={form.password}
                            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="inline-flex items-center justify-center gap-2 bg-[#734DE6] text-white h-11 px-4 rounded-[10px] font-medium hover:bg-[#5a3eb8] disabled:opacity-50"
                            type="submit"
                            disabled={isUsersLoading}
                        >
                            {isUsersLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Создать
                        </button>
                        <button
                            className="inline-flex items-center justify-center border border-[#E0E4EB] h-11 w-11 rounded-[10px] text-[#6B7280] hover:bg-gray-50"
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            aria-label="Закрыть форму"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            )}

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                    type="search"
                    placeholder="Поиск преподавателя..."
                    className={searchInputClass}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {isInitialLoading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px] border border-[#EEF0F4]">
                    <Loader2 className="w-7 h-7 text-[#734DE6] animate-spin mb-3" />
                    <p className="text-sm text-[#6B7280]">Загрузка преподавателей...</p>
                </div>
            )}

            {!isInitialLoading && teachers.length === 0 && (
                <div className="bg-white rounded-[16px] p-8 text-center border border-[#EEF0F4]">
                    <p className="font-semibold text-[#1A1D2D]">Преподаватели не найдены</p>
                    <p className="text-sm text-[#6B7280] mt-1">
                        {query ? 'Попробуйте изменить поисковый запрос' : 'Создайте первого преподавателя'}
                    </p>
                </div>
            )}

            {teachers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEF0F4] hover:shadow-md transition-shadow space-y-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-[12px] bg-blue-50 flex items-center justify-center text-2xl shrink-0">
                                {t.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#1A1D2D] leading-tight">{t.name}</h3>
                                <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1 truncate">
                                    <Mail className="w-3 h-3 shrink-0" /> {t.email}
                                </p>
                            </div>
                            <button
                                className="p-2 rounded-[10px] text-[#6B7280] hover:bg-gray-50 shrink-0"
                                type="button"
                                aria-label="Ещё"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-[#F8FAFB] rounded-[12px] p-3 text-center border border-[#EEF0F4]">
                                <Layers className="w-4 h-4 text-[#734DE6] mx-auto mb-1" />
                                <p className="font-bold text-[#1A1D2D]">{t.groupsCount}</p>
                                <p className="text-xs text-[#6B7280] font-medium">групп</p>
                            </div>
                            <div className="bg-[#F8FAFB] rounded-[12px] p-3 text-center border border-[#EEF0F4]">
                                <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                <p className="font-bold text-[#1A1D2D]">{t.coursesCount}</p>
                                <p className="text-xs text-[#6B7280] font-medium">курсов</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminTeachers;
