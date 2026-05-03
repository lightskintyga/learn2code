import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Save, Upload, FileSpreadsheet, UserPlus, Eye, EyeOff, RefreshCw, Download } from 'lucide-react';

const field =
    'w-full border border-[#EEF0F4] rounded-[10px] h-11 px-3 text-[#1A1D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25';

const AdminStudentNew: React.FC = () => {
    const [tab, setTab] = useState<'single' | 'bulk'>('single');
    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState('kid-fox-9241');

    const generatePwd = () => {
        const animals = ['fox', 'cat', 'owl', 'bee', 'dog'];
        const a = animals[Math.floor(Math.random() * animals.length)];
        setPwd(`kid-${a}-${Math.floor(1000 + Math.random() * 9000)}`);
    };

    return (
        <AdminLayout title="Регистрация учеников" description="Создайте одного ученика или загрузите список" backTo="/admin/students">
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

            {tab === 'single' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#EEF0F4] lg:col-span-2 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1A1D2D]">Имя</label>
                                    <input className={field} placeholder="Артём" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#1A1D2D]">Фамилия</label>
                                    <input className={field} placeholder="Кузнецов" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">
                                    Email родителя (необязательно)
                                </label>
                                <input className={field} type="email" placeholder="parent@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">Группа</label>
                                <select className={field} defaultValue="">
                                    <option value="" disabled>
                                        Выберите группу...
                                    </option>
                                    <option value="g1">Питон-Кадеты-3</option>
                                    <option value="g2">Робо-1</option>
                                    <option value="g3">Геймеры-7А</option>
                                    <option value="none">Без группы</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-[rgba(115,77,230,0.06)] rounded-[16px] p-6 border border-[#EEF0F4] space-y-5">
                            <div className="space-y-1">
                                <h3 className="font-bold text-[#1A1D2D]">Учётные данные</h3>
                                <p className="text-sm text-[#6B7280]">Сгенерированы автоматически</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Логин</label>
                                <input className={`${field} font-mono bg-white`} value="a.kuznetsov" readOnly />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Пароль</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={pwd}
                                            readOnly
                                            className={`${field} font-mono pr-10`}
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
                                ⚠️ Сохраните данные перед созданием
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
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                            type="button"
                        >
                            <Save className="w-4 h-4" /> Создать ученика
                        </button>
                    </div>
                </>
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
                                <p className="font-bold text-[#1A1D2D]">Перетащите CSV-файл сюда</p>
                                <p className="text-sm text-[#6B7280] mt-1">или нажмите, чтобы выбрать</p>
                            </button>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">
                                    Или вставьте список (по строкам: Имя Фамилия)
                                </label>
                                <textarea
                                    placeholder={'Артём Кузнецов\nМария Демидова\nДмитрий Лебедев'}
                                    className="w-full border border-[#EEF0F4] rounded-[12px] px-3 py-2 min-h-[180px] font-mono text-sm text-[#1A1D2D] focus:outline-none focus:ring-2 focus:ring-[#734DE6]/25"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#1A1D2D]">Назначить в группу</label>
                                <select className={field} defaultValue="">
                                    <option value="" disabled>
                                        Выберите группу...
                                    </option>
                                    <option value="g1">Питон-Кадеты-3</option>
                                    <option value="g2">Робо-1</option>
                                    <option value="none">Без группы</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-[16px] p-6 border border-[#EEF0F4] space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-[#1A1D2D]">
                                <FileSpreadsheet className="w-5 h-5 text-blue-600" /> Шаблон CSV
                            </h3>
                            <p className="text-sm text-[#6B7280]">
                                Скачайте шаблон, заполните и загрузите. Логины и пароли сгенерируются автоматически.
                            </p>
                            <div className="bg-white rounded-[12px] p-3 text-xs font-mono text-[#6B7280] border border-[#EEF0F4]">
                                first_name,last_name,parent_email
                                <br />
                                Артём,Кузнецов,parent@mail.ru
                                <br />
                                Мария,Демидова,
                            </div>
                            <button
                                className="flex items-center justify-center gap-2 border border-[#E0E4EB] w-full px-3 py-2 rounded-[8px] text-sm text-[#1A1D2D] hover:bg-white transition-colors"
                                type="button"
                            >
                                <Download className="w-4 h-4" /> Скачать шаблон
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
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2.5 rounded-[10px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                            type="button"
                        >
                            <Upload className="w-4 h-4" /> Импортировать
                        </button>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminStudentNew;
