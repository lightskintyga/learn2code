import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Layers,
    Users,
    GraduationCap,
    BookOpen,
    FolderPlus,
    UserPlus,
    ChevronRight,
    TrendingUp,
} from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const stats = [
    { label: 'Группы', value: '12', icon: Layers, wrapClass: 'bg-[rgba(115,77,230,0.1)] text-[#734DE6]', to: '/admin/groups' },
    { label: 'Учеников', value: '248', icon: Users, wrapClass: 'bg-blue-50 text-blue-600', to: '/admin/students' },
    { label: 'Преподавателей', value: '8', icon: GraduationCap, wrapClass: 'bg-amber-50 text-amber-700', to: '/admin/teachers' },
    { label: 'Курсов', value: '15', icon: BookOpen, wrapClass: 'bg-emerald-50 text-emerald-700', to: '/admin/courses' },
];

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

const recent = [
    { text: 'Создана группа «Питон-Кадеты-3»', time: '10 мин назад', emoji: '📚' },
    { text: 'Зарегистрировано 12 учеников', time: '1 ч назад', emoji: '👥' },
    { text: 'Преподаватель Иванов И.И. привязан к группе «Робо-1»', time: '3 ч назад', emoji: '👨‍🏫' },
    { text: 'Курс «Создаём игры» привязан к группе «Геймеры-7А»', time: 'вчера', emoji: '🎮' },
];

const AdminDashboard: React.FC = () => {
    return (
        <AdminLayout
            title="Админ-панель 🛡️"
            description="Управляйте группами, пользователями и курсами"
        >
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
                    {recent.map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-4">
                            <span className="text-xl shrink-0">{r.emoji}</span>
                            <p className="flex-1 text-sm text-[#1A1D2D]">{r.text}</p>
                            <span className="text-xs text-[#6B7280] shrink-0">{r.time}</span>
                        </div>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminDashboard;
