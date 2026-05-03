import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Save, UserPlus, X, Users, GraduationCap, BookOpen, Trash2 } from 'lucide-react';

// Моковые данные (в реальности будут приходить с бэкенда)
const allTeachers = [
    { id: 't1', name: 'Иванов И.И.' },
    { id: 't2', name: 'Петрова А.С.' },
    { id: 't3', name: 'Сидоров В.К.' },
];

const allCourses = [
    { id: 'c1', name: 'Мои первые шаги' },
    { id: 'c2', name: 'Создаём игры' },
    { id: 'c3', name: 'Продвинутые алгоритмы' },
];

const allStudents = [
    { id: 's1', name: 'Артём Кузнецов', login: 'a.kuznetsov' },
    { id: 's2', name: 'Мария Демидова', login: 'm.demidova' },
    { id: 's3', name: 'Дмитрий Лебедев', login: 'd.lebedev' },
    { id: 's4', name: 'Анна Соколова', login: 'a.sokolova' },
];

const field =
    'w-full border border-[#EEF0F4] rounded-[10px] h-11 px-3 text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminGroupEditor: React.FC = () => {
    const { groupId } = useParams();
    const isNew = groupId === 'new';
    const [students, setStudents] = useState(isNew ? [] : allStudents.slice(0, 2));

    return (
        <AdminLayout
            title={isNew ? 'Новая группа' : 'Редактирование группы'}
            description={isNew ? 'Создайте группу, назначьте преподавателя и учеников' : 'Питон-Кадеты-3'}
            backTo="/admin/groups"
            actions={
                <>
                    {!isNew && (
                        <button
                            className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-[10px] font-medium hover:bg-red-50"
                            type="button"
                        >
                            <Trash2 className="w-4 h-4" /> Удалить
                        </button>
                    )}
                    <button
                        className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                        type="button"
                    >
                        <Save className="w-4 h-4" /> Сохранить
                    </button>
                </>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-2 space-y-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                        <Users className="w-4 h-4" /> Основное
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Название группы</label>
                        <input
                            className={field}
                            defaultValue={isNew ? '' : 'Питон-Кадеты-3'}
                            placeholder="Например, Робо-2024"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1A1D2D]">Эмодзи</label>
                            <input className={`${field} text-2xl`} defaultValue={isNew ? '📚' : '🐍'} />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1A1D2D]">Год обучения</label>
                            <input className={field} defaultValue="2025" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Описание</label>
                        <textarea
                            placeholder="Краткое описание группы..."
                            className="w-full border border-[#EEF0F4] rounded-[10px] px-3 py-2 min-h-[80px] text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] space-y-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                        <GraduationCap className="w-4 h-4" /> Назначения
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1A1D2D]">Преподаватель</label>
                        <select className={field} defaultValue={isNew ? '' : 't1'}>
                            <option value="" disabled>
                                Выберите...
                            </option>
                            {allTeachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-semibold text-[#1A1D2D]">
                            <BookOpen className="w-4 h-4" /> Курс
                        </label>
                        <select className={field} defaultValue={isNew ? '' : 'c1'}>
                            <option value="" disabled>
                                Выберите курс...
                            </option>
                            {allCourses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-[#6B7280]">К группе можно привязать один курс</p>
                    </div>
                </div>

                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-3 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                            <Users className="w-4 h-4" /> Ученики
                            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[rgba(115,77,230,0.12)] text-[#734DE6]">
                                {students.length}
                            </span>
                        </div>
                        <button
                            className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                            type="button"
                        >
                            <UserPlus className="w-4 h-4" /> Добавить ученика
                        </button>
                    </div>

                    {students.length === 0 ? (
                        <div className="text-center py-12 text-[#6B7280]">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-semibold text-[#1A1D2D]">В группе пока нет учеников</p>
                            <p className="text-sm mt-1">Добавьте учеников из списка зарегистрированных</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {students.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-3 p-3 rounded-[12px] bg-[#F8FAFB] hover:bg-[#EEF0F4]/80 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-[10px] bg-[rgba(115,77,230,0.15)] text-[#734DE6] font-bold flex items-center justify-center text-sm">
                                        {s.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-[#1A1D2D] truncate">{s.name}</p>
                                        <p className="text-xs text-[#6B7280]">@{s.login}</p>
                                    </div>
                                    <button
                                        className="p-2 rounded-[10px] text-[#6B7280] hover:text-red-600 hover:bg-red-50"
                                        onClick={() => setStudents((prev) => prev.filter((p) => p.id !== s.id))}
                                        aria-label="Удалить из группы"
                                        type="button"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminGroupEditor;
