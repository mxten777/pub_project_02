import React, { useEffect, useState, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import { useSpeech } from '../hooks/useSpeech';
import { useLanguage } from '../contexts/LanguageContext';
import { Mic, ShoppingCart, Volume2 } from 'lucide-react';

interface WelcomePageProps {
  onStartOrder: () => void;
  onMenuOpen: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartOrder, onMenuOpen }) => {
  const { speak } = useSpeech();
  const { t } = useLanguage();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 페이지 로드시 환영 메시지
    const welcomeMessage = `${t('app.title')} - ${t('app.description')}. ${t('order.start')} 버튼을 눌러주세요.`;
    
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 1000);

    return () => clearTimeout(timer);
  }, [speak, t]);

  const handleStartClick = async () => {
    await speak(t('order.processing'));
    onStartOrder();
  };

  const handleMenuClick = async () => {
    await speak('메뉴를 확인하시겠습니다.');
    onMenuOpen();
  };

  const handleVoiceGuide = async () => {
    await speak(`${t('app.title')}에 오신 것을 환영합니다. ${t('app.description')}.`);
  };

  // 관리자 모드 접근 (타이틀 5번 클릭)
  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    if (clickCount >= 4) { // 5번째 클릭
      // 관리자 모드로 이동 (App.tsx에서 처리하도록 이벤트 발생)
      const event = new CustomEvent('adminAccess');
      window.dispatchEvent(event);
      setClickCount(0);
      return;
    }
    
    clickTimeoutRef.current = window.setTimeout(() => {
      setClickCount(0);
    }, 2000); // 2초 내에 5번 클릭해야 함
  };

  return (
    <MainLayout title={t('app.title')}>
      <div className="text-center space-y-8 sm:space-y-12">
        {/* 메인 로고/아이콘 */}
        <div className="mb-8 sm:mb-12 fade-in">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-lime-400 via-lime-500 to-grape-500 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 voice-wave relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            <ShoppingCart size={56} className="text-white sm:hidden relative z-10" />
            <ShoppingCart size={72} className="text-white hidden sm:block relative z-10" />
          </div>
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 cursor-pointer hover:scale-105 transition-all duration-500 px-4"
            onClick={handleTitleClick}
            title="관리자 접근: 5번 클릭"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 30%, #ECFDF5 70%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
              filter: 'contrast(1.2) brightness(1.1)'
            }}
          >
            {t('app.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-white max-w-2xl mx-auto leading-relaxed px-4 font-semibold" style={{
            textShadow: '0 3px 15px rgba(0,0,0,0.4), 0 1px 5px rgba(0,0,0,0.2)'
          }}>
            {t('app.description')}<br/>
            <span className="text-lg sm:text-xl text-lime-100 font-bold">{t('app.subtitle')}</span>
          </p>
        </div>

        {/* 버튼 그룹 - 완전 통일된 디자인 */}
        <div className="flex flex-col items-center justify-center gap-4 px-4 max-w-md mx-auto">
          {/* 음성 안내 버튼 */}
          <SeniorButton 
            variant="secondary"
            size="large"
            onClick={handleVoiceGuide}
            icon={Volume2}
            className="w-full shadow-premium-lg hover:scale-105 transform transition-all duration-300"
          >
            {t('accessibility.voice')}
          </SeniorButton>
          
          {/* 메뉴 보기 버튼 */}
          <SeniorButton 
            variant="secondary"
            size="large"
            onClick={handleMenuClick}
            icon={ShoppingCart}
            className="w-full shadow-premium-lg hover:scale-105 transform transition-all duration-300"
          >
            {t('menu.title')}
          </SeniorButton>

          {/* 주문 시작 버튼 - 메인 액션 */}
          <SeniorButton 
            variant="primary"
            size="large"
            onClick={handleStartClick}
            icon={Mic}
            className="w-full shadow-premium-xl hover:scale-105 transform transition-all duration-300"
          >
            {t('order.start')}
          </SeniorButton>
        </div>
        
        {/* 음성 안내 섹션 */}
        <div className="px-4 max-w-lg mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl mx-auto flex items-center justify-center">
                <Volume2 size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {t('voice.speakClearly')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('voice.examples')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="card-senior max-w-2xl mx-auto">
          <h2 className="text-senior-subtitle mb-4">
            간단한 3단계
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-4">
              <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-senior-base font-bold">
                1
              </span>
              <p className="text-senior-base text-gray-700">
                {t('order.start')} 버튼을 눌러주세요
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-senior-base font-bold">
                2
              </span>
              <p className="text-senior-base text-gray-700">
                {t('voice.examples')}
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-senior-base font-bold">
                3
              </span>
              <p className="text-senior-base text-gray-700">
                {t('order.confirm')} 및 결제하세요
              </p>
            </div>
          </div>

          {/* 숨겨진 관리자 접근 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const event = new CustomEvent('adminAccess');
                window.dispatchEvent(event);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              관리자 모드 (개발용)
            </button>
            <div className="text-xs text-gray-300 mt-1">
              또는 Ctrl+Shift+A 또는 타이틀 5번 클릭
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;