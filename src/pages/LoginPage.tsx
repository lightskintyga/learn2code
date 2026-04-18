import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import closeTagIcon from '../../public/closeTagIcon.svg';
import starIcon from '../../public/starIcon.svg';
import gameIcon from '../../public/gameIcon.svg';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        // Using email as username for login
        const success = await login({ username: email, password });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Gradient with branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#734DE6] via-[#6366F1] to-[#14B8A6] flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-2xl rotate-12" />
                <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute top-1/3 right-10 w-12 h-12 bg-white/10 rounded-lg -rotate-6" />

                {/* Logo */}
                <div className="bg-white/20 backdrop-blur-sm rounded-[16px] p-4 mb-6">
                    <img src={closeTagIcon} alt="Logo" className="w-8 h-8 invert" />
                </div>

                {/* Title */}
                <h1 className="text-white text-3xl font-bold mb-4">Learn2Code Studio</h1>

                {/* Description */}
                <p className="text-white/80 text-center max-w-sm mb-10">
                    Научись программировать играя! Создавай игры, анимации и истории с помощью визуальных блоков.
                </p>

                {/* Feature icons */}
                <div className="flex justify-center gap-8">
                    <div className="flex flex-col items-center gap-2 w-20">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <img src={starIcon} alt="Творчество" className="w-6 h-6 invert" />
                        </div>
                        <span className="text-white/80 text-sm">Творчество</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-20">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <svg className="text-white" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 14.6667H13.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.6667 12V17.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20 16H20.0133" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24 13.3333H24.0133" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M23.0934 6.66669H8.90675C7.58712 6.66699 6.31446 7.15652 5.33479 8.04064C4.35512 8.92476 3.73801 10.1407 3.60275 11.4534C3.59475 11.5227 3.58941 11.588 3.58008 11.656C3.47208 12.5547 2.66675 19.2747 2.66675 21.3334C2.66675 22.3942 3.08818 23.4116 3.83832 24.1618C4.58847 24.9119 5.60588 25.3334 6.66675 25.3334C8.00008 25.3334 8.66675 24.6667 9.33341 24L11.2187 22.1147C11.7187 21.6146 12.3969 21.3335 13.1041 21.3334H18.8961C19.6033 21.3335 20.2814 21.6146 20.7814 22.1147L22.6667 24C23.3334 24.6667 24.0001 25.3334 25.3334 25.3334C26.3943 25.3334 27.4117 24.9119 28.1618 24.1618C28.912 23.4116 29.3334 22.3942 29.3334 21.3334C29.3334 19.2734 28.5281 12.5547 28.4201 11.656C28.4107 11.5894 28.4054 11.5227 28.3974 11.4547C28.2625 10.1418 27.6455 8.92552 26.6658 8.04113C25.6861 7.15674 24.4132 6.66703 23.0934 6.66669Z" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-white/80 text-sm">Игры</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-20">
                        <div className="bg-white/20 backdrop-blur-sm rounded-[12px] w-12 h-12 flex items-center justify-center">
                            <img src={closeTagIcon} alt="Код" className="w-6 h-6 invert" />
                        </div>
                        <span className="text-white/80 text-sm">Код</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8FAFB] p-4">
                <div className="bg-white rounded-[20px] shadow-sm border border-[#EEF0F4] w-full max-w-md p-8">
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

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all"
                                placeholder="твой@email.ru"
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
                                    className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            className="w-full bg-[#734DE6] text-white rounded-[12px] py-3.5 font-medium text-sm hover:bg-[#5a3eb8] transition-colors disabled:opacity-50 shadow-lg shadow-purple-200"
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-3">
                        <Link to="/forgot-password" className="text-sm text-[#734DE6] font-medium hover:underline">
                            Забыл пароль?
                        </Link>
                        <div className="text-sm text-[#6B7280]">
                            Нет аккаунта?{' '}
                            <Link to="/register" className="text-[#734DE6] font-medium hover:underline">
                                Зарегистрируйся
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
