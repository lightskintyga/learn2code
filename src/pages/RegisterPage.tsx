import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import closeTagIcon from '../../public/closeTagIcon.svg';

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({
        displayName: '',
        email: '',
        password: '',
        role: 'student' as UserRole,
    });
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        // Generate username from email
        const username = form.email.split('@')[0];
        const success = await register({
            ...form,
            username,
            confirmPassword: form.password,
        });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#F8FAFB] to-[rgba(115,77,230,0.15)] flex items-center justify-center p-4">
            <div className="bg-white rounded-[20px] shadow-sm border border-[#EEF0F4] w-full max-w-md p-8">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="bg-[rgba(115,77,230,0.1)] rounded-[16px] p-3">
                        <img src={closeTagIcon} alt="Logo" className="w-6 h-6" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1D2D] mb-2">Создай аккаунт</h1>
                    <p className="text-[#6B7280] text-sm">Присоединяйся к Learn2Code Studio!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-[12px] px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Toggle */}
                    <div className="bg-[#F8FAFB] rounded-[12px] p-1.5 flex">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, role: 'student' }))}
                            className={`flex-1 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                form.role === 'student'
                                    ? 'bg-white text-[#734DE6] shadow-sm'
                                    : 'text-[#6B7280] hover:text-[#1A1D2D]'
                            }`}
                        >
                            <span>🎓</span> Ученик
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, role: 'teacher' }))}
                            className={`flex-1 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                form.role === 'teacher'
                                    ? 'bg-white text-[#734DE6] shadow-sm'
                                    : 'text-[#6B7280] hover:text-[#1A1D2D]'
                            }`}
                        >
                            <span>👨‍🏫</span> Преподаватель
                        </button>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Имя</label>
                        <input
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={handleChange}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all"
                            placeholder="Как тебя зовут?"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all"
                            placeholder="твой@email.ru"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all pr-12"
                                placeholder="Минимум 6 символов"
                                required
                                minLength={6}
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
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <span className="text-sm text-[#6B7280]">Уже есть аккаунт? </span>
                    <Link to="/login" className="text-sm text-[#734DE6] font-medium hover:underline">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
