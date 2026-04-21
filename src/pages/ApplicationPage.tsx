import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import closeTagIcon from '/closeTagIcon.svg';

const ApplicationPage: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    // Phone number formatting
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('7')) {
            value = value.slice(1);
        }
        if (value.startsWith('8')) {
            value = value.slice(1);
        }

        let formattedValue = '+7';
        if (value.length > 0) {
            formattedValue += ' (' + value.slice(0, 3);
        }
        if (value.length >= 3) {
            formattedValue += ')';
        }
        if (value.length > 3) {
            formattedValue += ' ' + value.slice(3, 6);
        }
        if (value.length > 6) {
            formattedValue += '-' + value.slice(6, 8);
        }
        if (value.length > 8) {
            formattedValue += '-' + value.slice(8, 10);
        }

        setPhone(formattedValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#F8FAFB] to-[rgba(115,77,230,0.15)] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[rgba(115,77,230,0.2)] rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />

                <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EEF0F4] w-full max-w-md p-8 relative z-10">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-[rgba(20,184,166,0.1)] rounded-full p-4">
                            <svg className="w-10 h-10 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-[#1A1D2D] mb-2">Заявка отправлена!</h1>
                        <p className="text-[#6B7280] text-sm">
                            Спасибо за интерес к Learn2Code Studio.<br />
                            Мы свяжемся с вами в ближайшее время.
                        </p>
                    </div>

                    {/* Back to home button */}
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-[#734DE6] text-white rounded-[12px] py-3.5 font-medium text-sm hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200/50"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#F8FAFB] to-[rgba(115,77,230,0.15)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[rgba(115,77,230,0.2)] rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />

            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EEF0F4] w-full max-w-md p-8 relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="bg-[rgba(115,77,230,0.1)] rounded-[16px] p-3">
                        <img src={closeTagIcon} alt="Logo" className="w-6 h-6" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1D2D] mb-2">Оставить заявку</h1>
                    <p className="text-[#6B7280] text-sm">Присоединяйся к Learn2Code Studio!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Имя</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]"
                            placeholder="Как тебя зовут?"
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Номер телефона</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]"
                            placeholder="+7 (___) ___-__-__"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#734DE6] text-white rounded-[12px] py-3.5 font-medium text-sm hover:bg-[#5a3eb8] transition-colors disabled:opacity-50 shadow-lg shadow-purple-200/50"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
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

export default ApplicationPage;
