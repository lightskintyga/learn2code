import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, Users, Layers, Edit, MoreVertical } from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const mockCourses = [
    { id: '1', title: 'Мои первые шаги', emoji: '🐱', lessons: 5, groups: 3, author: 'Иванов И.И.', published: true },
    { id: '2', title: 'Создаём игры', emoji: '🎮', lessons: 12, groups: 2, author: 'Петрова А.С.', published: true },
    { id: '3', title: 'Продвинутые алгоритмы', emoji: '🧩', lessons: 8, groups: 0, author: 'Сидоров В.К.', published: false },
    { id: '4', title: 'Робототехника', emoji: '🤖', lessons: 6, groups: 1, author: 'Иванов И.И.', published: true },
];

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminCourses: React.FC = () => {
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
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input type="search" placeholder="Поиск курсов..." className={searchInputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCourses.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white rounded-[16px] shadow-sm border border-[#EEF0F4] hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                    >
                        <div className="bg-gradient-to-br from-[rgba(115,77,230,0.12)] to-blue-50 p-6 flex items-center justify-between">
                            <span className="text-5xl">{c.emoji}</span>
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                    c.published ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-[#6B7280]'
                                }`}
                            >
                                {c.published ? 'Опубликован' : 'Черновик'}
                            </span>
                        </div>
                        <div className="p-5 space-y-4 flex-1 flex flex-col">
                            <div>
                                <h3 className="font-bold text-lg text-[#1A1D2D] leading-tight">{c.title}</h3>
                                <p className="text-xs text-[#6B7280] mt-1">Автор: {c.author}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5" /> {c.lessons} уроков
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" /> {c.groups} групп
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
        </AdminLayout>
    );
};

export default AdminCourses;
