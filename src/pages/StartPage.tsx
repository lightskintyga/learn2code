import { useNavigate } from 'react-router-dom';
import closeTagIcon from '/closeTagIcon.svg';
import starIcon from '/starIcon.svg';
import gameIcon from '/gameIcon.svg';
import bookIcon from '/bookIcon.svg';

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFB] relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[rgba(115,77,230,0.15)] rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/4" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[rgba(245,158,11,0.12)] rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-4">
                {/* Logo Icon */}
                <div className="bg-[rgba(115,77,230,0.12)] rounded-[16px] p-4 mb-8">
                    <img src={closeTagIcon} alt="Logo" className="w-6 h-6 text-[#734DE6]" />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
                    <span className="text-[#1A1D2D]">Научись </span>
                    <span className="text-[#734DE6]">программировать</span>
                    <span className="text-[#1A1D2D]"> играя!</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#6B7280] text-center max-w-lg mt-3 mb-10 text-base">
                    Создавай игры, анимации и истории с помощью визуальных<br />блоков в Learn2Code Studio
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center gap-2 bg-[#734DE6] text-white px-6 py-3.5 rounded-[12px] font-bold hover:bg-[#5a3eb8] transition-all shadow-lg shadow-purple-200/50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10,17 15,12 10,7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Войти на платформу
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center justify-center gap-2 bg-white border border-[#E0E4EB] text-[#1A1D2D] px-6 py-3.5 rounded-[12px] font-bold hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Оставить заявку
                    </button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EEF0F4]">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={starIcon} alt="Визуальное программирование" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#222639] font-bold text-lg mb-2">Визуальное программирование</h3>
                        <p className="text-[#737B8C] text-sm leading-relaxed">
                            Собирай программы из ярких блоков, как конструктор. Никакого сложного кода!
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EEF0F4]">
                        <div className="bg-[rgba(20,184,166,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={gameIcon} alt="Создавай игры" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#222639] font-bold text-lg mb-2">Создавай игры</h3>
                        <p className="text-[#737B8C] text-sm leading-relaxed">
                            Делай свои игры с персонажами, анимацией и звуками. Показывай друзьям!
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EEF0F4]">
                        <div className="bg-[rgba(245,158,11,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={bookIcon} alt="Пошаговые уроки" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#222639] font-bold text-lg mb-2">Пошаговые уроки</h3>
                        <p className="text-[#737B8C] text-sm leading-relaxed">
                            Учись шаг за шагом — от простого к сложному. Автопроверка покажет результат!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
