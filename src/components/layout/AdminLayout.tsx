import React, { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import closeTagIcon from '../../../public/closeTagIcon.svg';
import {
    LayoutDashboard,
    Layers,
    Users,
    GraduationCap,
    BookOpen,
    LogOut,
    Settings,
    ArrowLeft,
    ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    backTo?: string;
}

const navItems = [
    { to: '/admin', label: 'Дашборд', end: true, icon: LayoutDashboard },
    { to: '/admin/groups', label: 'Группы', icon: Layers },
    { to: '/admin/students', label: 'Ученики', icon: Users },
    { to: '/admin/teachers', label: 'Преподаватели', icon: GraduationCap },
    { to: '/admin/courses', label: 'Курсы', icon: BookOpen },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, description, actions, children, backTo }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB]">
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-2 min-w-0">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[10px] p-2 shrink-0">
                            <img src={closeTagIcon} alt="Logo" className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-[#1A1D2D] truncate">Learn2Code</span>
                        <span className="hidden sm:inline-flex items-center gap-1 bg-[rgba(115,77,230,0.12)] text-[#734DE6] text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0">
                            <ShieldCheck className="w-3 h-3" /> Админ
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 shrink-0">
                        <button
                            className="hidden sm:flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                            type="button"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm">Настройки</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                            type="button"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
                <aside className="lg:sticky lg:top-8 self-start">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-semibold whitespace-nowrap transition-colors',
                                        isActive
                                            ? 'bg-[#734DE6] text-white shadow-md shadow-purple-200'
                                            : 'text-[#6B7280] hover:bg-white hover:text-[#1A1D2D] border border-transparent hover:border-[#EEF0F4]',
                                    ].join(' ')
                                }
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="space-y-6 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                            {backTo && (
                                <button
                                    onClick={() => navigate(backTo)}
                                    className="text-sm text-[#6B7280] hover:text-[#1A1D2D] font-semibold flex items-center gap-1 mb-1"
                                    type="button"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Назад
                                </button>
                            )}
                            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D2D]">{title}</h1>
                            {description && <p className="text-[#6B7280]">{description}</p>}
                        </div>
                        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
