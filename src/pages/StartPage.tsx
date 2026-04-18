import { useNavigate } from 'react-router-dom';
import closeTagIcon from '../../public/closeTagIcon.svg';
import starIcon from '../../public/starIcon.svg';
import gameIcon from '../../public/gameIcon.svg';
import bookIcon from '../../public/bookIcon.svg';

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFB]">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
                {/* Logo Icon */}
                <div className="bg-[rgba(115,77,230,0.1)] rounded-[16px] p-4 mb-8">
                    <img src={closeTagIcon} alt="Закрывающий тег" className="w-6 h-6" />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
                    <span className="text-[#1A1D2D]">Научись </span>
                    <span className="text-[#734DE6]">программировать</span>
                    <span className="text-[#1A1D2D]"> играя!</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#6B7280] text-center max-w-lg mt-4 mb-8">
                    Создавай игры, анимации и истории с помощью визуальных блоков в Learn2Code Studio
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center gap-2 bg-[#734DE6] text-white px-6 py-3.5 rounded-[12px] font-medium hover:bg-[#5a3eb8] transition-colors shadow-lg shadow-purple-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        Начать обучение
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 bg-white border border-[#E0E4EB] text-[#1A1D2D] px-6 py-3.5 rounded-[12px] font-medium hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Я преподаватель
                    </button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(115,77,230,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={starIcon} alt="Звезда" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#1A1D2D] font-semibold text-lg mb-2">Визуальное программирование</h3>
                        <p className="text-[#6B7280] text-sm leading-relaxed">
                            Собирай программы из ярких блоков, как конструктор. Никакого сложного кода!
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(20,184,166,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={gameIcon} alt="Игры" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#1A1D2D] font-semibold text-lg mb-2">Создавай игры</h3>
                        <p className="text-[#6B7280] text-sm leading-relaxed">
                            Делай свои игры с персонажами, анимацией и звуками. Показывай друзьям!
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[20px] p-8 text-center shadow-sm border border-[#EEF0F4]">
                        <div className="bg-[rgba(245,158,11,0.1)] rounded-[12px] w-14 h-14 flex items-center justify-center mx-auto mb-4">
                            <img src={bookIcon} alt="Уроки" className="w-7 h-7" />
                        </div>
                        <h3 className="text-[#1A1D2D] font-semibold text-lg mb-2">Пошаговые уроки</h3>
                        <p className="text-[#6B7280] text-sm leading-relaxed">
                            Учись шаг за шагом — от простого к сложному. Автопроверка покажет результат!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
