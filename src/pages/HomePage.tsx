import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import Header from '@/components/layout/Header';
import { Plus, FolderOpen, BookOpen, Users } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const HomePage: React.FC = () => {
    const { user } = useAuthStore();
    const { projects, createProject, loadProject } = useProjectStore();
    const navigate = useNavigate();

    if (!user) return null;

    const userProjects = projects.filter(p => p.authorId === user.id);

    const handleNewProject = () => {
        const project = createProject('Новый проект', user.id, user.displayName);
        navigate(`/editor/${project.id}`);
    };

    const handleOpenProject = (projectId: string) => {
        loadProject(projectId);
        navigate(`/editor/${projectId}`);
    };

    // Создаём демо-аккаунты при первом запуске
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('scratch_users') || '[]');
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 'teacher-1',
                    username: 'teacher',
                    email: 'teacher@edu.com',
                    role: 'teacher',
                    displayName: 'Иван Петрович',
                    password: '123456',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'student-1',
                    username: 'student',
                    email: 'student@edu.com',
                    role: 'student',
                    displayName: 'Алиса',
                    password: '123456',
                    createdAt: new Date().toISOString(),
                    classId: 'class-1',
                },
            ];
            localStorage.setItem('scratch_users', JSON.stringify(demoUsers));
        }
    }, []);

    return (
        <div className="h-screen flex flex-col bg-ui-bg">
            <Header />

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Приветствие */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Привет, {user.displayName}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {user.role === 'teacher'
                                ? 'Создавайте задания и следите за прогрессом учеников'
                                : 'Создавайте проекты и выполняйте задания'}
                        </p>
                    </div>

                    {/* Быстрые действия */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <button
                            onClick={handleNewProject}
                            className="bg-scratch-purple text-white rounded-xl p-6 text-left hover:brightness-110 transition-all shadow-lg"
                        >
                            <Plus size={32} className="mb-3" />
                            <h3 className="text-lg font-bold">Новый проект</h3>
                            <p className="text-white/80 text-sm mt-1">Создать пустой проект</p>
                        </button>

                        <button
                            onClick={() => navigate('/projects')}
                            className="bg-scratch-blue text-white rounded-xl p-6 text-left hover:brightness-110 transition-all shadow-lg"
                        >
                            <FolderOpen size={32} className="mb-3" />
                            <h3 className="text-lg font-bold">Мои проекты</h3>
                            <p className="text-white/80 text-sm mt-1">{userProjects.length} проектов</p>
                        </button>

                        {user.role === 'teacher' ? (
                            <button
                                onClick={() => navigate('/teacher')}
                                className="bg-scratch-orange text-white rounded-xl p-6 text-left hover:brightness-110 transition-all shadow-lg"
                            >
                                <Users size={32} className="mb-3" />
                                <h3 className="text-lg font-bold">Панель преподавателя</h3>
                                <p className="text-white/80 text-sm mt-1">Задания и ученики</p>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/student')}
                                className="bg-scratch-green text-white rounded-xl p-6 text-left hover:brightness-110 transition-all shadow-lg"
                            >
                                <BookOpen size={32} className="mb-3" />
                                <h3 className="text-lg font-bold">Мои задания</h3>
                                <p className="text-white/80 text-sm mt-1">Просмотреть задания</p>
                            </button>
                        )}
                    </div>

                    {/* Последние проекты */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Последние проекты</h2>
                        {userProjects.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center border border-ui-border">
                                <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">У вас пока нет проектов</p>
                                <button
                                    onClick={handleNewProject}
                                    className="mt-4 scratch-btn-primary"
                                >
                                    Создать первый проект
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {userProjects
                                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                    .slice(0, 8)
                                    .map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleOpenProject(project.id)}
                                            className="bg-white rounded-xl border border-ui-border overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                                        >
                                            {/* Превью */}
                                            <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {project.sprites[0]?.costumes[0] ? (
                                                    <img
                                                        src={project.sprites[0].costumes[0].dataUrl}
                                                        alt=""
                                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="text-gray-300 text-4xl">🎨</div>
                                                )}
                                            </div>

                                            <div className="p-3">
                                                <h3 className="font-bold text-sm truncate">{project.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDate(project.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;