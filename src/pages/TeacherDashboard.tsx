import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/layout/Header';
import { v4 as uuidv4 } from 'uuid';
import { Task, Submission, ClassGroup } from '@/types';
import {
    getTasksByTeacher, saveTask, deleteTask,
    getSubmissions, saveSubmission,
    getClassesByTeacher, saveClass,
} from '@/services/storage';
import {
    Plus, Users, BookOpen, CheckCircle, Clock,
    Trash2, Eye, Award, FileText
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const TeacherDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'tasks' | 'students' | 'classes'>('tasks');
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showCreateClass, setShowCreateClass] = useState(false);

    if (!user || user.role !== 'teacher') return null;

    const tasks = getTasksByTeacher(user.id);
    const classes = getClassesByTeacher(user.id);

    return (
        <div className="h-screen flex flex-col bg-ui-bg">
            <Header />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Панель преподавателя</h1>

                    {/* Навигация */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'tasks' as const, label: 'Задания', icon: <BookOpen size={18} /> },
                            { id: 'students' as const, label: 'Решения', icon: <CheckCircle size={18} /> },
                            { id: 'classes' as const, label: 'Классы', icon: <Users size={18} /> },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    activeSection === item.id
                                        ? 'bg-scratch-purple text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-ui-border'
                                }`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Задания */}
                    {activeSection === 'tasks' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">Задания</h2>
                                <button
                                    onClick={() => setShowCreateTask(true)}
                                    className="scratch-btn-primary flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} /> Создать задание
                                </button>
                            </div>

                            {tasks.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center border border-ui-border">
                                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Нет заданий</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map(task => {
                                        const submissions = getSubmissions(task.id);
                                        return (
                                            <div key={task.id} className="bg-white rounded-xl border border-ui-border p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                                        <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                            <span>Создано: {formatDate(task.createdAt)}</span>
                                                            {task.dueDate && <span>Срок: {formatDate(task.dueDate)}</span>}
                                                            <span>Макс. балл: {task.maxScore}</span>
                                                            <span className="flex items-center gap-1">
                                <FileText size={12} /> {submissions.length} решений
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                // TODO: Просмотр решений
                                                                alert(`Решений: ${submissions.length}`);
                                                            }}
                                                            className="p-2 hover:bg-gray-100 rounded"
                                                            title="Просмотреть решения"
                                                        >
                                                            <Eye size={18} className="text-gray-500" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Удалить задание?')) {
                                                                    deleteTask(task.id);
                                                                    window.location.reload(); // Простое обновление
                                                                }
                                                            }}
                                                            className="p-2 hover:bg-red-50 rounded"
                                                            title="Удалить"
                                                        >
                                                            <Trash2 size={18} className="text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Модальное окно создания задания */}
                            {showCreateTask && (
                                <CreateTaskModal
                                    teacherId={user.id}
                                    classes={classes}
                                    onClose={() => setShowCreateTask(false)}
                                    onSave={(task) => {
                                        saveTask(task);
                                        setShowCreateTask(false);
                                        window.location.reload();
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Решения */}
                    {activeSection === 'students' && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Решения учеников</h2>
                            {tasks.map(task => {
                                const submissions = getSubmissions(task.id);
                                if (submissions.length === 0) return null;

                                return (
                                    <div key={task.id} className="mb-6">
                                        <h3 className="font-bold text-md mb-2">{task.title}</h3>
                                        <div className="space-y-2">
                                            {submissions.map(sub => (
                                                <div key={sub.id} className="bg-white rounded-lg border border-ui-border p-3 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium text-sm">{sub.studentName}</span>
                                                        <span className="text-xs text-gray-400 ml-3">{formatDate(sub.submittedAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                sub.status === 'reviewed' ? 'bg-green-100 text-green-600' :
                                    sub.status === 'returned' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                            }`}>
                              {sub.status === 'reviewed' ? 'Проверено' :
                                  sub.status === 'returned' ? 'Возвращено' : 'Отправлено'}
                            </span>
                                                        {sub.score !== undefined && (
                                                            <span className="text-sm font-bold">{sub.score}/{task.maxScore}</span>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                const score = prompt('Оценка:', String(sub.score || 0));
                                                                const feedback = prompt('Комментарий:', sub.feedback || '');
                                                                if (score !== null) {
                                                                    saveSubmission({
                                                                        ...sub,
                                                                        score: Number(score),
                                                                        feedback: feedback || '',
                                                                        status: 'reviewed',
                                                                    });
                                                                    window.location.reload();
                                                                }
                                                            }}
                                                            className="text-xs bg-scratch-purple text-white px-3 py-1 rounded-full hover:brightness-110"
                                                        >
                                                            <Award size={14} className="inline mr-1" />
                                                            Оценить
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Классы */}
                    {activeSection === 'classes' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">Классы</h2>
                                <button
                                    onClick={() => setShowCreateClass(true)}
                                    className="scratch-btn-primary flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} /> Создать класс
                                </button>
                            </div>

                            {classes.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center border border-ui-border">
                                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Нет классов</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {classes.map(cls => (
                                        <div key={cls.id} className="bg-white rounded-xl border border-ui-border p-4">
                                            <h3 className="font-bold text-lg">{cls.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Код класса: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{cls.id.slice(0, 8)}</code>
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Учеников: {cls.studentIds.length}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showCreateClass && (
                                <CreateClassModal
                                    teacherId={user.id}
                                    onClose={() => setShowCreateClass(false)}
                                    onSave={(cls) => {
                                        saveClass(cls);
                                        setShowCreateClass(false);
                                        window.location.reload();
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Модальное окно создания задания
const CreateTaskModal: React.FC<{
    teacherId: string;
    classes: ClassGroup[];
    onClose: () => void;
    onSave: (task: Task) => void;
}> = ({ teacherId, classes, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classId, setClassId] = useState(classes[0]?.id || '');
    const [maxScore, setMaxScore] = useState(100);
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            teacherId,
            classId,
            maxScore,
            dueDate: dueDate || undefined,
            createdAt: new Date().toISOString(),
        };
        onSave(task);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                <h2 className="text-xl font-bold mb-4">Новое задание</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Название</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Описание</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Класс</label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Без класса</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Макс. балл</label>
                            <input
                                type="number"
                                value={maxScore}
                                onChange={(e) => setMaxScore(Number(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Срок сдачи</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            Отмена
                        </button>
                        <button type="submit" className="scratch-btn-primary text-sm">
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Модальное окно создания класса
const CreateClassModal: React.FC<{
    teacherId: string;
    onClose: () => void;
    onSave: (cls: ClassGroup) => void;
}> = ({ teacherId, onClose, onSave }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cls: ClassGroup = {
            id: uuidv4(),
            name,
            teacherId,
            studentIds: [],
            createdAt: new Date().toISOString(),
        };
        onSave(cls);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Новый класс</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Название класса</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Например: 5А класс"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                            Отмена
                        </button>
                        <button type="submit" className="scratch-btn-primary text-sm">
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherDashboard;