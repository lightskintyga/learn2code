import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, Mail, MoreVertical, Layers, BookOpen } from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const mockTeachers = [
    { id: '1', name: 'Иванов Иван Иванович', email: 'ivanov@school.ru', groups: 2, courses: 3, emoji: '👨‍🏫' },
    { id: '2', name: 'Петрова Анна Сергеевна', email: 'petrova@school.ru', groups: 1, courses: 2, emoji: '👩‍🏫' },
    { id: '3', name: 'Сидоров Виктор Константинович', email: 'sidorov@school.ru', groups: 3, courses: 4, emoji: '👨‍💻' },
];

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminTeachers: React.FC = () => {
    return (
        <AdminLayout
            title="Преподаватели"
            description="Учётные записи и нагрузка преподавателей"
            actions={
                <button
                    className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] shadow-lg shadow-purple-200"
                    type="button"
                >
                    <Plus className="w-4 h-4" /> Новый преподаватель
                </button>
            }
        >
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input type="search" placeholder="Поиск преподавателя..." className={searchInputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTeachers.map((t) => (
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
                                <p className="font-bold text-[#1A1D2D]">{t.groups}</p>
                                <p className="text-xs text-[#6B7280] font-medium">групп</p>
                            </div>
                            <div className="bg-[#F8FAFB] rounded-[12px] p-3 text-center border border-[#EEF0F4]">
                                <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                <p className="font-bold text-[#1A1D2D]">{t.courses}</p>
                                <p className="text-xs text-[#6B7280] font-medium">курсов</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminTeachers;
