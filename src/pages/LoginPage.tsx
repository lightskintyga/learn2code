import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const success = await login({ username, password });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-scratch-purple to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Логотип */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-scratch-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-3xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">ScratchEdu</h1>
                    <p className="text-gray-500 mt-1">Войдите в свой аккаунт</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-scratch-purple focus:border-transparent outline-none"
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-scratch-purple text-white rounded-lg py-2.5 font-bold text-sm hover:bg-scratch-purple-dark transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-500">Нет аккаунта? </span>
                    <Link to="/register" className="text-sm text-scratch-purple font-medium hover:underline">
                        Зарегистрироваться
                    </Link>
                </div>

                {/* Демо-аккаунты */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center mb-3">Демо-аккаунты для тестирования:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                setUsername('teacher');
                                setPassword('123456');
                            }}
                            className="text-xs bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors"
                        >
                            👨‍🏫 Преподаватель<br />
                            <span className="text-gray-400">teacher / 123456</span>
                        </button>
                        <button
                            onClick={() => {
                                setUsername('student');
                                setPassword('123456');
                            }}
                            className="text-xs bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors"
                        >
                            👨‍🎓 Ученик<br />
                            <span className="text-gray-400">student / 123456</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;