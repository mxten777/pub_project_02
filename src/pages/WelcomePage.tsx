import React, { useEffect, useState, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import LanguageSelector from '../components/UI/LanguageSelector';
import { useSpeech } from '../hooks/useSpeech';
import { useLanguage } from '../contexts/LanguageContext';
import { Mic, ShoppingCart, Volume2 } from 'lucide-react';

interface WelcomePageProps {
  onStartOrder: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartOrder }) => {
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
      {/* 언어 선택기를 헤더에 Portal로 렌더링 */}
      <LanguageSelector usePortal={true} />
      
      <div className="text-center space-y-8 sm:space-y-12">
        {/* 메인 로고/아이콘 */}
        <div className="mb-8 sm:mb-12 fade-in">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 voice-wave">
            <ShoppingCart size={56} className="text-white sm:hidden" />
            <ShoppingCart size={72} className="text-white hidden sm:block" />
          </div>
          <h1 
            className="text-senior-2xl sm:text-senior-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 cursor-pointer hover:scale-105 transition-transform px-4"
            onClick={handleTitleClick}
            title="관리자 접근: 5번 클릭"
          >
            {t('app.title')}
          </h1>
          <p className="text-senior-lg sm:text-senior-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            {t('app.description')}<br/>
            <span className="text-senior-sm sm:text-senior-base text-blue-600 font-semibold">{t('app.subtitle')}</span>
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
          {/* 음성 안내 버튼 */}
          <SeniorButton 
            variant="secondary"
            size="medium"
            onClick={handleVoiceGuide}
            className="shadow-senior-lg hover:scale-105 transform transition-all duration-300 w-full sm:w-auto"
          >
            <Volume2 size={24} className="mr-2 sm:mr-3" />
            {t('accessibility.voice')}
          </SeniorButton>
          
          {/* 주문 시작 버튼 */}
          <SeniorButton 
            variant="primary"
            size="large"
            onClick={handleStartClick}
            icon={Mic}
            className="shadow-senior-lg hover:scale-105 transform transition-all duration-300 pulse-ring w-full sm:w-auto"
          >
            {t('order.start')}
          </SeniorButton>
        </div>
        
        <div className="text-center">
          <p className="text-senior-base text-gray-500 mb-2">
            {t('voice.speakClearly')}
          </p>
          <p className="text-senior-sm text-blue-600">
            {t('voice.examples')}
          </p>
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