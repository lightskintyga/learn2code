import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { Save, UserPlus, X, Users, GraduationCap, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { UserDto } from '@/services/api';

const field =
    'w-full border border-[#EEF0F4] rounded-[10px] h-11 px-3 text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const getName = (user: UserDto) => user.displayName || user.email || 'Без имени';

const getInitials = (name: string) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

const AdminGroupEditor: React.FC = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const isNew = !groupId || groupId === 'new';
    const [form, setForm] = useState({
        name: '',
        description: '',
        courseId: '',
        teacherId: '',
    });
    const [draftStudents, setDraftStudents] = useState<UserDto[]>([]);
    const [studentToAdd, setStudentToAdd] = useState('');
    const { addToast } = useToastStore();
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
        clearError: clearUsersError,
    } = useAdminStore();
    const {
        courses,
        currentGroup,
        isLoading: isCourseLoading,
        error: courseError,
        fetchCourses,
        fetchGroup,
        fetchGroups,
        createGroup,
        updateGroup,
        deleteGroup,
        addStudentToGroup,
        removeStudentFromGroup,
        setCurrentGroup,
        clearError: clearCourseError,
    } = useCourseStore();

    useEffect(() => {
        fetchCourses();
        fetchUsers();

        if (!isNew && groupId) {
            fetchGroup(groupId);
        } else {
            setCurrentGroup(null);
            setForm({ name: '', description: '', courseId: '', teacherId: '' });
            setDraftStudents([]);
        }
    }, [fetchCourses, fetchUsers, fetchGroup, setCurrentGroup, groupId, isNew]);

    useEffect(() => {
        if (!isNew && currentGroup) {
            setForm({
                name: currentGroup.name || '',
                description: currentGroup.description || '',
                courseId: currentGroup.courseId,
                teacherId: currentGroup.teacherId,
            });
        }
    }, [currentGroup, isNew]);

    const teachers = useMemo(
        () => users.filter((user) => user.role?.toLowerCase() === 'teacher'),
        [users]
    );
    const allStudents = useMemo(
        () => users.filter((user) => user.role?.toLowerCase() === 'student'),
        [users]
    );
    const students = isNew ? draftStudents : currentGroup?.students || [];
    const availableStudents = allStudents.filter(
        (student) => !students.some((currentStudent) => currentStudent.id === student.id)
    );
    const isBusy = isCourseLoading || isUsersLoading;
    const error = usersError || courseError;

    const handleSave = async () => {
        const name = form.name.trim();
        if (!name || !form.teacherId || (!form.courseId && isNew)) {
            addToast('Заполните название, преподавателя и курс', 'error');
            return;
        }

        if (isNew) {
            const group = await createGroup({
                name,
                description: form.description.trim(),
                courseId: form.courseId,
                teacherId: form.teacherId,
            });

            if (group) {
                for (const student of draftStudents) {
                    await addStudentToGroup(group.id, student.id);
                }
                await fetchGroups();
                addToast('Группа создана', 'success');
                navigate(`/admin/groups/${group.id}`);
            }
            return;
        }

        if (!groupId) return;

        const group = await updateGroup(groupId, {
            name,
            description: form.description.trim(),
            teacherId: form.teacherId,
        });

        if (group) {
            await fetchGroups();
            addToast('Группа обновлена', 'success');
        }
    };

    const handleDelete = async () => {
        if (!groupId || !confirm('Удалить группу?')) return;

        const deleted = await deleteGroup(groupId);
        if (deleted) {
            addToast('Группа удалена', 'success');
            navigate('/admin/groups');
        }
    };

    const handleAddStudent = async () => {
        const student = allStudents.find((item) => item.id === studentToAdd);
        if (!student) return;

        if (isNew) {
            setDraftStudents((prev) => [...prev, student]);
            setStudentToAdd('');
            return;
        }

        if (!groupId) return;
        const added = await addStudentToGroup(groupId, student.id);
        if (added) {
            setStudentToAdd('');
            addToast('Ученик добавлен в группу', 'success');
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (isNew) {
            setDraftStudents((prev) => prev.filter((student) => student.id !== studentId));
            return;
        }

        if (!groupId) return;
        const removed = await removeStudentFromGroup(groupId, studentId);
        if (removed) {
            addToast('Ученик удалён из группы', 'success');
        }
    };

    return (
        <AdminLayout
            title={isNew ? 'Новая группа' : 'Редактирование группы'}
            description={isNew ? 'Создайте группу, назначьте преподавателя и учеников' : currentGroup?.name || 'Загрузка группы'}
            backTo="/admin/groups"
            actions={
                <>
                    {!isNew && (
                        <button
                            className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-[10px] font-medium hover:bg-red-50 disabled:opacity-50"
                            type="button"
                            onClick={handleDelete}
                            disabled={isBusy}
                        >
                            <Trash2 className="w-4 h-4" /> Удалить
                        </button>
                    )}
                    <button
                        className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
                        type="button"
                        onClick={handleSave}
                        disabled={isBusy}
                    >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Сохранить
                    </button>
                </>
            }
        >
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearUsersError();
                            clearCourseError();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            {!isNew && isCourseLoading && !currentGroup ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px] border border-[#EEF0F4]">
                    <Loader2 className="w-7 h-7 text-[#734DE6] animate-spin mb-3" />
                    <p className="text-sm text-[#6B7280]">Загрузка группы...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                            <Users className="w-4 h-4" /> Основное
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1A1D2D]">Название группы</label>
                            <input
                                className={field}
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder="Например, Робо-2024"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1A1D2D]">Описание</label>
                            <textarea
                                value={form.description}
                                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                placeholder="Краткое описание группы..."
                                className="w-full border border-[#EEF0F4] rounded-[10px] px-3 py-2 min-h-[118px] text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] space-y-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                            <GraduationCap className="w-4 h-4" /> Назначения
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1A1D2D]">Преподаватель</label>
                            <select
                                className={field}
                                value={form.teacherId}
                                onChange={(event) => setForm((prev) => ({ ...prev, teacherId: event.target.value }))}
                            >
                                <option value="">Выберите...</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {getName(teacher)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-1 text-sm font-semibold text-[#1A1D2D]">
                                <BookOpen className="w-4 h-4" /> Курс
                            </label>
                            <select
                                className={field}
                                value={form.courseId}
                                onChange={(event) => setForm((prev) => ({ ...prev, courseId: event.target.value }))}
                                disabled={!isNew}
                            >
                                <option value="">Выберите курс...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title || 'Без названия'}
                                    </option>
                                ))}
                            </select>
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
                            <div className="flex gap-2 w-full sm:w-auto">
                                <select
                                    className={`${field} sm:w-[260px]`}
                                    value={studentToAdd}
                                    onChange={(event) => setStudentToAdd(event.target.value)}
                                >
                                    <option value="">Выберите ученика...</option>
                                    {availableStudents.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {getName(student)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    type="button"
                                    onClick={handleAddStudent}
                                    disabled={!studentToAdd || isBusy}
                                >
                                    <UserPlus className="w-4 h-4" /> Добавить
                                </button>
                            </div>
                        </div>

                        {students.length === 0 ? (
                            <div className="text-center py-12 text-[#6B7280]">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-semibold text-[#1A1D2D]">В группе пока нет учеников</p>
                                <p className="text-sm mt-1">Добавьте учеников из списка зарегистрированных</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {students.map((student) => {
                                    const name = getName(student);
                                    return (
                                        <div
                                            key={student.id}
                                            className="flex items-center gap-3 p-3 rounded-[12px] bg-[#F8FAFB] hover:bg-[#EEF0F4]/80 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-[10px] bg-[rgba(115,77,230,0.15)] text-[#734DE6] font-bold flex items-center justify-center text-sm">
                                                {getInitials(name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-[#1A1D2D] truncate">{name}</p>
                                                <p className="text-xs text-[#6B7280]">{student.email || 'Нет email'}</p>
                                            </div>
                                            <button
                                                className="p-2 rounded-[10px] text-[#6B7280] hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                onClick={() => handleRemoveStudent(student.id)}
                                                aria-label="Удалить из группы"
                                                type="button"
                                                disabled={isBusy}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGroupEditor;
