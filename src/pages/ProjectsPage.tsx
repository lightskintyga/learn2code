import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import Header from '@/components/layout/Header';
import { Plus, Trash2, FolderOpen, Download } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const ProjectsPage: React.FC = () => {
    const { user } = useAuthStore();
    const { projects, createProject, deleteProject, loadProject, exportProject } = useProjectStore();
    const navigate = useNavigate();

    if (!user) return null;

    const userProjects = projects
        .filter(p => p.authorId === user.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const handleNew = () => {
        const project = createProject('Новый проект', user.id, user.displayName);
        navigate(`/editor/${project.id}`);
    };

    const handleOpen = (id: string) => {
        loadProject(id);
        navigate(`/editor/${id}`);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Удалить проект "${name}"?`)) {
            deleteProject(id);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-ui-bg">
            <Header />

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Мои проекты</h1>
                        <button onClick={handleNew} className="scratch-btn-primary flex items-center gap-2">
                            <Plus size={18} /> Новый проект
                        </button>
                    </div>

                    {userProjects.length === 0 ? (
                        <div className="bg-white rounded-xl p-16 text-center border border-ui-border">
                            <FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-xl font-bold text-gray-500 mb-2">Нет проектов</h2>
                            <p className="text-gray-400 mb-6">Создайте свой первый проект!</p>
                            <button onClick={handleNew} className="scratch-btn-primary">
                                Создать проект
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {userProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-xl border border-ui-border overflow-hidden group hover:shadow-lg transition-all"
                                >
                                    {/* Превью */}
                                    <div
                                        onClick={() => handleOpen(project.id)}
                                        className="aspect-[4/3] bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
                                    >
                                        {project.sprites[0]?.costumes[0] ? (
                                            <img
                                                src={project.sprites[0].costumes[0].dataUrl}
                                                alt=""
                                                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <div className="text-gray-300 text-5xl">🎨</div>
                                        )}
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-bold text-sm truncate">{project.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(project.updatedAt)}</p>

                                        <div className="flex items-center gap-1 mt-3">
                                            <button
                                                onClick={() => handleOpen(project.id)}
                                                className="flex-1 text-xs bg-scratch-blue text-white rounded py-1.5 font-medium hover:bg-scratch-blue-dark transition-colors"
                                            >
                                                Открыть
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id, project.name)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Удалить"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;