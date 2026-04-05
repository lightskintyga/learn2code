import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import {
    Globe, FolderOpen, Save, FileDown, FileUp,
    Settings, User, LogOut, ChevronDown
} from 'lucide-react';

interface HeaderProps {
    showProjectControls?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showProjectControls = false }) => {
    const { user, logout } = useAuthStore();
    const { currentProject, saveProject, setProjectName, exportProject, importProject } = useProjectStore();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const handleExport = () => {
        const json = exportProject();
        if (json) {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentProject?.name || 'project'}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const text = await file.text();
                importProject(text);
            }
        };
        input.click();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-12 bg-scratch-purple flex items-center px-4 text-white relative z-50">
            {/* Логотип */}
            <Link to="/" className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-scratch-purple font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-lg hidden md:block">ScratchEdu</span>
            </Link>

            {/* Навигация */}
            <nav className="flex items-center gap-1 mr-4">
                <Link to="/" className="px-3 py-1 rounded hover:bg-white/20 text-sm font-medium">
                    Главная
                </Link>
                <Link to="/projects" className="px-3 py-1 rounded hover:bg-white/20 text-sm font-medium">
                    Проекты
                </Link>
                {user?.role === 'teacher' && (
                    <Link to="/teacher" className="px-3 py-1 rounded hover:bg-white/20 text-sm font-medium">
                        Панель преподавателя
                    </Link>
                )}
                {user?.role === 'student' && (
                    <Link to="/student" className="px-3 py-1 rounded hover:bg-white/20 text-sm font-medium">
                        Мои задания
                    </Link>
                )}
            </nav>

            {/* Меню файла */}
            {showProjectControls && (
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="px-3 py-1 rounded hover:bg-white/20 text-sm font-medium flex items-center gap-1"
                        >
                            Файл <ChevronDown size={14} />
                        </button>
                        {showMenu && (
                            <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 min-w-48 z-50">
                                <button
                                    onClick={() => { saveProject(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                >
                                    <Save size={16} /> Сохранить
                                </button>
                                <button
                                    onClick={() => { handleExport(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                >
                                    <FileDown size={16} /> Экспортировать
                                </button>
                                <button
                                    onClick={() => { handleImport(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                                >
                                    <FileUp size={16} /> Импортировать
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Название проекта */}
                    <input
                        type="text"
                        value={currentProject?.name || ''}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="bg-white/20 text-white placeholder-white/60 px-3 py-1 rounded text-sm font-medium w-48 outline-none focus:bg-white/30"
                        placeholder="Название проекта"
                    />

                    <button
                        onClick={saveProject}
                        className="px-3 py-1 rounded hover:bg-white/20 text-sm"
                        title="Сохранить"
                    >
                        <Save size={18} />
                    </button>
                </div>
            )}

            <div className="flex-1" />

            {/* Пользователь */}
            <div className="relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/20"
                >
                    <div className="w-7 h-7 bg-white/30 rounded-full flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <span className="text-sm font-medium hidden md:block">{user?.displayName}</span>
                    <ChevronDown size={14} />
                </button>
                {showUserMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 min-w-48 z-50">
                        <div className="px-4 py-2 border-b">
                            <div className="font-medium text-sm">{user?.displayName}</div>
                            <div className="text-xs text-gray-500">{user?.role === 'teacher' ? 'Преподаватель' : 'Ученик'}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                        >
                            <LogOut size={16} /> Выйти
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;