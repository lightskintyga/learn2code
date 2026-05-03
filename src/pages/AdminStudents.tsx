import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, Upload, MoreVertical } from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const mockStudents = [
    { id: '1', name: 'Артём Кузнецов', login: 'a.kuznetsov', group: 'Питон-Кадеты-3', progress: 78, status: 'active' as const },
    { id: '2', name: 'Мария Демидова', login: 'm.demidova', group: 'Питон-Кадеты-3', progress: 92, status: 'active' as const },
    { id: '3', name: 'Дмитрий Лебедев', login: 'd.lebedev', group: 'Робо-1', progress: 45, status: 'active' as const },
    { id: '4', name: 'Анна Соколова', login: 'a.sokolova', group: 'Геймеры-7А', progress: 100, status: 'active' as const },
    { id: '5', name: 'Илья Морозов', login: 'i.morozov', group: '—', progress: 0, status: 'pending' as const },
];

const searchInputClass =
    'w-full border border-[#EEF0F4] rounded-[12px] h-11 pl-9 pr-3 text-[#1A1D2D] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminStudents: React.FC = () => {
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
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input type="search" placeholder="Поиск по имени или логину..." className={searchInputClass} />
                </div>
            </div>

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
                            {mockStudents.map((s) => (
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
                                        {s.group === '—' ? (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 text-[#6B7280]">
                                                не назначена
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-[#1A1D2D]">{s.group}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 max-w-[160px]">
                                            <div className="flex-1 h-2 bg-[#EEF0F4] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#734DE6] rounded-full"
                                                    style={{ width: `${s.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-[#6B7280] w-9">{s.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                                                s.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-800'
                                                    : 'bg-amber-50 text-amber-800'
                                            }`}
                                        >
                                            {s.status === 'active' ? 'Активен' : 'Ожидает'}
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
