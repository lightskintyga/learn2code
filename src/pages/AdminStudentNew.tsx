import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminStore } from '@/store/useAdminStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { Save, Upload, FileSpreadsheet, UserPlus, Eye, EyeOff, RefreshCw, Download, Loader2 } from 'lucide-react';

const field =
    'w-full border border-[#EEF0F4] rounded-[10px] h-11 px-3 text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

interface CreatedCredential {
    name: string;
    email: string;
    password: string;
}

const slugify = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const generatePassword = () => `kid-${Math.floor(100000 + Math.random() * 900000)}`;

const buildEmail = (displayName: string, seed: number) => {
    const slug = slugify(displayName);
    const localPart = slug || `student-${seed}`;
    return `${localPart}-${seed}@learn2code.local`;
};

const parseBulkRows = (raw: string) =>
    raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const csvParts = line.split(',').map((part) => part.trim());
            if (csvParts.length >= 2) {
                const displayName = [csvParts[0], csvParts[1]].filter(Boolean).join(' ');
                const email = csvParts.find((part) => part.includes('@')) || '';
                return { displayName, email };
            }

            return { displayName: line, email: '' };
        })
        .filter((row) => row.displayName.trim());

const AdminStudentNew: React.FC = () => {
    const [tab, setTab] = useState<'single' | 'bulk'>('single');
    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState(generatePassword);
    const [loginSeed, setLoginSeed] = useState(() => Math.floor(1000 + Math.random() * 9000));
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [groupId, setGroupId] = useState('');
    const [bulkText, setBulkText] = useState('');
    const [bulkGroupId, setBulkGroupId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState<CreatedCredential[]>([]);
    const { addToast } = useToastStore();
    const { createUser, isLoading: isUsersLoading, error: usersError, clearError: clearUsersError } = useAdminStore();
    const {
        groups,
        isLoading: isGroupsLoading,
        error: groupsError,
        fetchGroups,
        addStudentToGroup,
        clearError: clearGroupsError,
    } = useCourseStore();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const displayName = useMemo(
        () => [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
        [firstName, lastName]
    );
    const generatedEmail = useMemo(
        () => buildEmail(displayName || 'student', loginSeed),
        [displayName, loginSeed]
    );
    const loginEmail = email.trim() || generatedEmail;
    const isBusy = isSubmitting || isUsersLoading || isGroupsLoading;
    const error = usersError || groupsError;

    const generatePwd = () => {
        setPwd(generatePassword());
        setLoginSeed(Math.floor(1000 + Math.random() * 9000));
    };

    const addCreatedStudentToGroup = async (studentId: string, selectedGroupId: string) => {
        if (!selectedGroupId || selectedGroupId === 'none') return true;
        return addStudentToGroup(selectedGroupId, studentId);
    };

    const handleSingleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!displayName) {
            addToast('Введите имя или фамилию ученика', 'error');
            return;
        }

        if (pwd.trim().length < 6) {
            addToast('Пароль должен быть не короче 6 символов', 'error');
            return;
        }

        setIsSubmitting(true);
        const user = await createUser({
            email: loginEmail,
            displayName,
            password: pwd.trim(),
            role: 'Student',
        });

        if (user) {
            const addedToGroup = await addCreatedStudentToGroup(user.id, groupId);
            if (addedToGroup) {
                await fetchGroups();
                setCreatedCredentials([{ name: displayName, email: loginEmail, password: pwd.trim() }]);
                setFirstName('');
                setLastName('');
                setEmail('');
                setGroupId('');
                setPwd(generatePassword());
                setLoginSeed(Math.floor(1000 + Math.random() * 9000));
                addToast('Ученик создан', 'success');
            }
        }

        setIsSubmitting(false);
    };

    const handleBulkSubmit = async () => {
        const rows = parseBulkRows(bulkText);
        if (rows.length === 0) {
            addToast('Добавьте хотя бы одну строку с именем ученика', 'error');
            return;
        }

        setIsSubmitting(true);
        const credentials: CreatedCredential[] = [];

        for (const [index, row] of rows.entries()) {
            const password = generatePassword();
            const createdEmail = row.email || buildEmail(row.displayName, loginSeed + index);
            const user = await createUser({
                email: createdEmail,
                displayName: row.displayName,
                password,
                role: 'Student',
            });

            if (user) {
                const addedToGroup = await addCreatedStudentToGroup(user.id, bulkGroupId);
                if (addedToGroup) {
                    credentials.push({ name: row.displayName, email: createdEmail, password });
                }
            }
        }

        if (credentials.length > 0) {
            await fetchGroups();
            setCreatedCredentials(credentials);
            setBulkText('');
            setBulkGroupId('');
            setLoginSeed(Math.floor(1000 + Math.random() * 9000));
            addToast(`Создано учеников: ${credentials.length}`, 'success');
        }

        setIsSubmitting(false);
    };

    return (
        <AdminLayout title="Регистрация учеников" description="Создайте одного ученика или загрузите список" backTo="/admin/students">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-center justify-between gap-3">
                    <span className="text-red-600 text-sm">{error}</span>
                    <button
                        onClick={() => {
                            clearUsersError();
                            clearGroupsError();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            <div className="inline-flex rounded-[12px] bg-[#EEF0F4] p-1 gap-1">
                <button
                    onClick={() => setTab('single')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
                        tab === 'single' ? 'bg-white text-[#1A1D2D] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1D2D]'
                    }`}
                    type="button"
                >
                    <UserPlus className="w-4 h-4" /> Одиночная регистрация
                </button>
                <button
                    onClick={() => setTab('bulk')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
                        tab === 'bulk' ? 'bg-white text-[#1A1D2D] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1D2D]'
                    }`}
                    type="button"
                >
                    <FileSpreadsheet className="w-4 h-4" /> Массовый импорт
                </button>
            </div>

            {createdCredentials.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[16px] p-5 space-y-3">
                    <h3 className="font-bold text-emerald-900">Созданные учётные данные</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {createdCredentials.map((credential) => (
                            <div key={`${credential.email}-${credential.password}`} className="bg-white rounded-[12px] border border-emerald-100 p-3 text-sm">
                                <p className="font-semibold text-[#1A1D2D]">{credential.name}</p>
                                <p className="font-mono text-xs text-[#6B7280] mt-1">{credential.email}</p>
                                <p className="font-mono text-xs text-[#6B7280]">{credential.password}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'single' && (
                <form onSubmit={handleSingleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-2 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1A1D2D]">Имя</label>
                                    <input className={field} value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Артём" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1A1D2D]">Фамилия</label>
                                    <input className={field} value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Кузнецов" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">
                                    Email для входа
                                </label>
                                <input
                                    className={field}
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder={generatedEmail}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">Группа</label>
                                <select className={field} value={groupId} onChange={(event) => setGroupId(event.target.value)}>
                                    <option value="">Выберите группу...</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name || 'Без названия'}
                                        </option>
                                    ))}
                                    <option value="none">Без группы</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-[rgba(115,77,230,0.06)] rounded-[16px] p-6 border border-[#EEF0F4] space-y-5">
                            <div className="space-y-1">
                                <h3 className="font-bold text-[#1A1D2D]">Учётные данные</h3>
                                <p className="text-sm text-[#6B7280]">Будут сохранены в профиле ученика</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Логин</label>
                                <input className={`${field} font-mono bg-white`} value={loginEmail} readOnly />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Пароль</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={pwd}
                                            onChange={(event) => setPwd(event.target.value)}
                                            className={`${field} font-mono pr-10`}
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(!showPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1D2D]"
                                            aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
                                        >
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generatePwd}
                                        className="inline-flex items-center justify-center border border-[#E0E4EB] rounded-[10px] h-11 w-11 hover:bg-white shrink-0"
                                        aria-label="Новый пароль"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center text-sm font-semibold px-3 py-2 rounded-[10px] bg-amber-50 text-amber-900 border border-amber-100">
                                Сохраните данные перед передачей ученику
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 flex-wrap">
                        <Link
                            to="/admin/students"
                            className="flex items-center justify-center border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                        >
                            Отмена
                        </Link>
                        <button
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
                            type="submit"
                            disabled={isBusy || !displayName}
                        >
                            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Создать ученика
                        </button>
                    </div>
                </form>
            )}

            {tab === 'bulk' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-2 space-y-5">
                            <button
                                type="button"
                                className="w-full border-2 border-dashed border-[#EEF0F4] rounded-[16px] p-10 text-center hover:border-[#734DE6]/40 hover:bg-[rgba(115,77,230,0.04)] transition-colors"
                            >
                                <div className="w-14 h-14 rounded-[12px] bg-[rgba(115,77,230,0.1)] text-[#734DE6] flex items-center justify-center mx-auto mb-3">
                                    <Upload className="w-7 h-7" />
                                </div>
                                <p className="font-bold text-[#1A1D2D]">Вставьте CSV-строки ниже</p>
                                <p className="text-sm text-[#6B7280] mt-1">first_name,last_name,email</p>
                            </button>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">
                                    Список учеников
                                </label>
                                <textarea
                                    value={bulkText}
                                    onChange={(event) => setBulkText(event.target.value)}
                                    placeholder={'Артём,Кузнецов,artem@example.com\nМария,Демидова,maria@example.com\nДмитрий Лебедев'}
                                    className="w-full border border-[#EEF0F4] rounded-[12px] px-3 py-2 min-h-[180px] font-mono text-sm text-[#1A1D2D] focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">Назначить в группу</label>
                                <select className={field} value={bulkGroupId} onChange={(event) => setBulkGroupId(event.target.value)}>
                                    <option value="">Выберите группу...</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name || 'Без названия'}
                                        </option>
                                    ))}
                                    <option value="none">Без группы</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-[16px] p-6 border border-[#EEF0F4] space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-[#1A1D2D]">
                                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> Шаблон CSV
                            </h3>
                            <p className="text-sm text-[#6B7280]">
                                Если email не указан, система сгенерирует технический email для входа.
                            </p>
                            <div className="bg-white rounded-[12px] p-3 text-xs font-mono text-[#6B7280] border border-[#EEF0F4]">
                                first_name,last_name,email
                                <br />
                                Артём,Кузнецов,artem@mail.ru
                                <br />
                                Мария,Демидова,
                            </div>
                            <button
                                className="flex items-center justify-center gap-2 border border-[#E0E4EB] w-full px-3 py-2 rounded-[8px] text-sm text-[#1A1D2D] hover:bg-white transition-colors"
                                type="button"
                                onClick={() => setBulkText('Артём,Кузнецов,artem@mail.ru\nМария,Демидова,\nДмитрий Лебедев')}
                            >
                                <Download className="w-4 h-4" /> Подставить шаблон
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 flex-wrap">
                        <Link
                            to="/admin/students"
                            className="flex items-center justify-center border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                        >
                            Отмена
                        </Link>
                        <button
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
                            type="button"
                            onClick={handleBulkSubmit}
                            disabled={isBusy || !bulkText.trim()}
                        >
                            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Импортировать
                        </button>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminStudentNew;
