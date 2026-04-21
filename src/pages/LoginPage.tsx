import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import closeTagIcon from '/closeTagIcon.svg';
import starIcon from '/starIcon.svg';
import gameIcon from '/gameIcon.svg';

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login: doLogin, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const success = await doLogin({ username: login, password });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Gradient with branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#734DE6] via-[#6366F1] to-[#14B8A6] flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-8 left-12 w-24 h-24 bg-white/10 rounded-2xl rotate-12" />
                <div className="absolute bottom-24 left-24 w-16 h-16 bg-white/10 rounded-xl -rotate-6" />
                <div className="absolute top-1/3 right-8 w-12 h-12 bg-white/10 rounded-lg rotate-12" />
                <div className="absolute bottom-1/3 right-16 w-20 h-20 bg-white/10 rounded-2xl -rotate-12" />

                {/* Logo */}
                <div className="bg-white/20 backdrop-blur-sm rounded-[16px] p-4 mb-6">
                    <img src={closeTagIcon} alt="Logo" className="w-8 h-8 invert" />
                </div>

                {/* Title */}
                <h1 className="text-white text-3xl font-bold mb-3">Learn2Code Studio</h1>

                {/* Description */}
                <p className="text-white/80 text-center max-w-sm mb-12 text-sm leading-relaxed">
                    Научись программировать играя! Создавай игры,<br />анимации и истории с помощью визуальных блоков.
                </p>

                {/* Feature icons */}
                <div className="flex justify-center items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[14px] w-14 h-14 flex items-center justify-center">
                            <img src={starIcon} alt="Творчество" className="w-6 h-6 invert" />
                        </div>
                        <span className="text-white/80 text-sm text-center w-20">Творчество</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[14px] w-14 h-14 flex items-center justify-center">
                            <img src={gameIcon} alt="Игры" className="w-6 h-6 invert" />
                        </div>
                        <span className="text-white/80 text-sm text-center w-20">Игры</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[14px] w-14 h-14 flex items-center justify-center">
                            <img src={closeTagIcon} alt="Код" className="w-6 h-6 invert" />
                        </div>
                        <span className="text-white/80 text-sm text-center w-20">Код</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8FAFB] p-4">
                <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EEF0F4] w-full max-w-md p-8">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#1A1D2D] mb-2">Добро пожаловать!</h2>
                        <p className="text-[#6B7280] text-sm">Войди, чтобы продолжить обучение</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-[12px] px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Логин
                            </label>
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]"
                                placeholder="твой логин"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all pr-12 placeholder:text-[#9CA3AF]"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#734DE6] text-white rounded-[12px] py-3.5 font-medium text-sm hover:bg-[#5a3eb8] transition-colors disabled:opacity-50 shadow-lg shadow-purple-200/50"
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-3">
                        <Link to="/forgot-password" className="text-sm text-[#734DE6] font-medium hover:underline block">
                            Забыл пароль?
                        </Link>
                        <div className="text-sm text-[#6B7280]">
                            Нет аккаунта?{' '}
                            <Link to="/register" className="text-[#734DE6] font-medium hover:underline">
                                Оставить заявку
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
