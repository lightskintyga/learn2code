import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        role: 'student' as UserRole,
        classCode: '',
    });

    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const success = await register(form);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-scratch-purple to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-scratch-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-3xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Регистрация</h1>
                    <p className="text-gray-500 mt-1">Создайте новый аккаунт</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Роль */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, role: 'student' }))}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                                    form.role === 'student'
                                        ? 'border-scratch-purple bg-purple-50 text-scratch-purple'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                👨‍🎓 Ученик
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, role: 'teacher' }))}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                                    form.role === 'teacher'
                                        ? 'border-scratch-purple bg-purple-50 text-scratch-purple'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                👨‍🏫 Преподаватель
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Отображаемое имя</label>
                        <input
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Как вас зовут?"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Логин для входа"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Минимум 6 символов"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Подтверждение пароля</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Повторите пароль"
                            required
                        />
                    </div>

                    {form.role === 'student' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Код класса (необязательно)</label>
                            <input
                                type="text"
                                name="classCode"
                                value={form.classCode}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                                placeholder="Введите код от преподавателя"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-scratch-purple text-white rounded-lg py-2.5 font-bold text-sm hover:bg-scratch-purple-dark transition-colors disabled:opacity-50 mt-2"
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-500">Уже есть аккаунт? </span>
                    <Link to="/login" className="text-sm text-scratch-purple font-medium hover:underline">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;