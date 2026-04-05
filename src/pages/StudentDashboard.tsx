import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import Header from '@/components/layout/Header';
import { getTasks, getStudentSubmissions, saveSubmission } from '@/services/storage';
import { Submission, ExportedCode } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { BookOpen, CheckCircle, Clock, Send, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const StudentDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const { currentProject, projects, loadProject } = useProjectStore();
    const navigate = useNavigate();

    if (!user || user.role !== 'student') return null;

    const allTasks = getTasks(user.classId);
    const mySubmissions = getStudentSubmissions(user.id);

    const getSubmissionForTask = (taskId: string) => {
        return mySubmissions.find(s => s.taskId === taskId);
    };

    const handleSubmit = (taskId: string) => {
        // Выбираем проект для отправки
        const userProjects = projects.filter(p => p.authorId === user.id);

        if (userProjects.length === 0) {
            alert('Сначала создайте проект в редакторе');
            return;
        }

        const projectNames = userProjects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
        const choice = prompt(`Выберите проект для отправки (номер):\n${projectNames}`);

        if (!choice) return;

        const idx = parseInt(choice) - 1;
        const project = userProjects[idx];

        if (!project) {
            alert('Неверный номер проекта');
            return;
        }

        // Создаём экспорт
        const exportedCode: ExportedCode = {
            json: JSON.stringify(project, null, 2),
            blocklyXml: project.sprites.map(s => s.blocks).join('\n'),
            javascript: '// Код будет сгенерирован при открытии в редакторе',
            python: '# Код будет сгенерирован при открытии в редакторе',
        };

        const submission: Submission = {
            id: uuidv4(),
            taskId,
            studentId: user.id,
            studentName: user.displayName,
            project,
            exportedCode,
            submittedAt: new Date().toISOString(),
            status: 'submitted',
        };

        saveSubmission(submission);

        // TODO: Отправка на сервер для проверки с эталонным решением
        // api.post('/submissions', submission);
        // api.post('/submissions/check', { submissionId: submission.id, taskId });

        alert('Решение отправлено!');
        window.location.reload();
    };

    return (
        <div className="h-screen flex flex-col bg-ui-bg">
            <Header />

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои задания</h1>

                    {allTasks.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-ui-border">
                            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Нет доступных заданий</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Попросите преподавателя добавить вас в класс
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {allTasks.map(task => {
                                const submission = getSubmissionForTask(task.id);
                                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

                                return (
                                    <div key={task.id} className="bg-white rounded-xl border border-ui-border p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{task.title}</h3>
                                                    {submission ? (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                            submission.status === 'reviewed'
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-blue-100 text-blue-600'
                                                        }`}>
                              {submission.status === 'reviewed' ? '✓ Проверено' : '⏳ На проверке'}
                            </span>
                                                    ) : isOverdue ? (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                              Просрочено
                            </span>
                                                    ) : null}
                                                </div>

                                                <p className="text-gray-500 text-sm mt-2">{task.description}</p>

                                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> Создано: {formatDate(task.createdAt)}
                          </span>
                                                    {task.dueDate && (
                                                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                              <AlertCircle size={12} /> Срок: {formatDate(task.dueDate)}
                            </span>
                                                    )}
                                                    <span>Макс. балл: {task.maxScore}</span>
                                                </div>

                                                {/* Результат проверки */}
                                                {submission?.status === 'reviewed' && (
                                                    <div className="mt-3 bg-green-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle size={16} className="text-green-500" />
                                                            <span className="font-bold text-green-700">
                                Оценка: {submission.score}/{task.maxScore}
                              </span>
                                                        </div>
                                                        {submission.feedback && (
                                                            <p className="text-sm text-green-600 mt-1">{submission.feedback}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="ml-4 flex flex-col gap-2">
                                                {!submission && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/editor')}
                                                            className="text-xs bg-scratch-blue text-white px-4 py-2 rounded-lg font-medium hover:brightness-110"
                                                        >
                                                            Открыть редактор
                                                        </button>
                                                        <button
                                                            onClick={() => handleSubmit(task.id)}
                                                            className="text-xs bg-scratch-green text-white px-4 py-2 rounded-lg font-medium hover:brightness-110 flex items-center gap-1"
                                                        >
                                                            <Send size={14} /> Отправить
                                                        </button>
                                                    </>
                                                )}
                                                {submission && submission.status !== 'reviewed' && (
                                                    <button
                                                        onClick={() => handleSubmit(task.id)}
                                                        className="text-xs bg-scratch-orange text-white px-4 py-2 rounded-lg font-medium hover:brightness-110"
                                                    >
                                                        Отправить заново
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;