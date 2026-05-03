import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, GraduationCap, BookOpen, MoreVertical, Edit } from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const mockGroups = [
    { id: '1', name: 'Питон-Кадеты-3', teacher: 'Иванов И.И.', students: 18, course: 'Мои первые шаги', emoji: '🐍' },
    { id: '2', name: 'Робо-1', teacher: 'Петрова А.С.', students: 14, course: 'Создаём игры', emoji: '🤖' },
    { id: '3', name: 'Геймеры-7А', teacher: 'Сидоров В.К.', students: 22, course: 'Создаём игры', emoji: '🎮' },
    { id: '4', name: 'Юные алгоритмисты', teacher: '—', students: 0, course: '—', emoji: '🧩' },
];

const inputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminGroups: React.FC = () => {
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
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input type="search" placeholder="Поиск групп..." className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGroups.map((g) => (
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
                                <p className="text-sm text-[#6B7280]">{g.students} учеников</p>
                            </div>
                            <button
                                className="p-2 rounded-[10px] text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1D2D]"
                                type="button"
                                aria-label="Ещё"
                            >
                                <MoreVertical className="w-4 h-4" />
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
                                {g.course === '—' ? (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800">
                                        не привязан
                                    </span>
                                ) : (
                                    <span className="font-semibold text-[#1A1D2D] truncate">{g.course}</span>
                                )}
                            </div>
                        </div>

                        <Link
                            to={`/admin/groups/${g.id}`}
                            className="flex items-center justify-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors w-full"
                        >
                            <Edit className="w-4 h-4" /> Управлять
                        </Link>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminGroups;
