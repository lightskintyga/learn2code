import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { api } from '@/services/api';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { Plus, Search, Upload, MoreVertical, Loader2 } from 'lucide-react';

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminStudents: React.FC = () => {
    const [query, setQuery] = useState('');
    const [progressByStudent, setProgressByStudent] = useState<Record<string, number | null>>({});
    const [isProgressLoading, setIsProgressLoading] = useState(false);
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
        clearError: clearUsersError,
    } = useAdminStore();
    const {
        groups,
        isLoading: isGroupsLoading,
        error: groupsError,
        fetchGroups,
        clearError: clearGroupsError,
    } = useCourseStore();

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, [fetchUsers, fetchGroups]);

    const students = useMemo(
        () => users.filter((user) => user.role?.toLowerCase() === 'student'),
        [users]
    );

    useEffect(() => {
        if (students.length === 0) {
            setProgressByStudent({});
            return;
        }

        let isMounted = true;
        setIsProgressLoading(true);

        Promise.all(
            students.map(async (student) => {
                try {
                    const progress = await api.getStudentProgress(student.id);
                    if (progress.length === 0) {
                        return [student.id, null] as const;
                    }

                    const completed = progress.filter((item) => item.completed).length;
                    return [student.id, Math.round((completed / progress.length) * 100)] as const;
                } catch {
                    return [student.id, null] as const;
                }
            })
        ).then((entries) => {
            if (isMounted) {
                setProgressByStudent(Object.fromEntries(entries));
                setIsProgressLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [students]);

    const preparedStudents = students
        .map((student) => {
            const studentGroups = groups.filter((group) =>
                group.students?.some((groupStudent) => groupStudent.id === student.id)
            );
            const name = student.displayName || student.email || 'Без имени';
            const login = student.email?.split('@')[0] || student.id.slice(0, 8);

            return {
                id: student.id,
                name,
                login,
                email: student.email || '',
                groups: studentGroups.map((group) => group.name || 'Без названия'),
                progress: progressByStudent[student.id] ?? null,
            };
        })
        .filter((student) => {
            const normalizedQuery = query.trim().toLowerCase();
            if (!normalizedQuery) return true;
            return `${student.name} ${student.login} ${student.email} ${student.groups.join(' ')}`
                .toLowerCase()
                .includes(normalizedQuery);
        });

    const error = usersError || groupsError;
    const isInitialLoading =
        (isUsersLoading && users.length === 0) ||
        (isGroupsLoading && groups.length === 0);

    return (
        <AdminLayout
            title="Ученики"
            description="Регистрация и управление учётными записями учеников"
            actions={
                <>
                    <button
                        className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-4 py-2.5 rounded-[10px] font-medium hover:bg-gray-50"
                        type="button"
                    >
                        <Upload className="w-4 h-4" /> Импорт CSV
                    </button>
                    <Link
                        to="/admin/students/new"
                        className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] shadow-lg shadow-purple-200"
                    >
                        <Plus className="w-4 h-4" /> Новый ученик
                    </Link>
                </>
            }
        >
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearUsersError();
                            clearGroupsError();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        type="search"
                        placeholder="Поиск по имени или логину..."
                        className={searchInputClass}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
            </div>

            {isInitialLoading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px] border border-[#EEF0F4]">
                    <Loader2 className="w-7 h-7 text-[#734DE6] animate-spin mb-3" />
                    <p className="text-sm text-[#6B7280]">Загрузка учеников...</p>
                </div>
            )}

            <div className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#EEF0F4] text-left">
                                <th className="font-bold text-[#1A1D2D] p-4">Ученик</th>
                                <th className="font-bold text-[#1A1D2D] p-4">Логин</th>
                                <th className="font-bold text-[#1A1D2D] p-4">Группа</th>
                                <th className="font-bold text-[#1A1D2D] p-4">Прогресс</th>
                                <th className="font-bold text-[#1A1D2D] p-4">Статус</th>
                                <th className="w-12 p-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {!isInitialLoading && preparedStudents.length === 0 && (
                                <tr>
                                    <td className="p-8 text-center text-[#6B7280]" colSpan={6}>
                                        {query ? 'Ученики не найдены' : 'Пока нет учеников'}
                                    </td>
                                </tr>
                            )}
                            {preparedStudents.map((s) => (
                                <tr key={s.id} className="border-b border-[#EEF0F4]/80 hover:bg-[#F8FAFB]/80">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-[10px] bg-[rgba(115,77,230,0.15)] text-[#734DE6] font-bold text-xs flex items-center justify-center">
                                                {s.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </div>
                                            <span className="font-semibold text-[#1A1D2D]">{s.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#6B7280] font-mono text-sm">@{s.login}</td>
                                    <td className="p-4">
                                        {s.groups.length === 0 ? (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 text-[#6B7280]">
                                                не назначена
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-[#1A1D2D]">{s.groups.join(', ')}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {isProgressLoading && s.progress === null ? (
                                            <span className="text-xs text-[#6B7280]">загрузка...</span>
                                        ) : s.progress === null ? (
                                            <span className="text-xs text-[#6B7280]">нет данных</span>
                                        ) : (
                                            <div className="flex items-center gap-2 max-w-[160px]">
                                                <div className="flex-1 h-2 bg-[#EEF0F4] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#734DE6] rounded-full"
                                                        style={{ width: `${s.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-[#6B7280] w-9">{s.progress}%</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800">
                                            Создан
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="p-2 rounded-[10px] text-[#6B7280] hover:bg-gray-50"
                                            type="button"
                                            aria-label="Ещё"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminStudents;
