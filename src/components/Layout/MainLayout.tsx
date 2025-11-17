import React, { useState, useEffect } from 'react';
import AccessibilityPanel from '../UI/AccessibilityPanel';
import LanguageSelector from '../UI/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  soundEnabled: boolean;
  voiceSpeed: number;
}

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBackClick 
}) => {
  const { language, t } = useLanguage();
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    soundEnabled: true,
    voiceSpeed: 0.8
  });
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // 언어 변경 감지 디버깅
  useEffect(() => {
    console.log('🏠 MainLayout - 언어 변경 감지됨:', language);
  }, [language]);

  useEffect(() => {
    // 키보드 사용자 감지
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const rootClasses = `
    min-h-screen transition-all duration-300
    ${settings.highContrast 
      ? 'bg-black text-white high-contrast' 
      : 'bg-premium-gradient'
    }
    ${isKeyboardUser ? 'keyboard-user' : ''}
    ${settings.fontSize === 'large' ? 'text-lg' : ''}
    ${settings.fontSize === 'extra-large' ? 'text-xl' : ''}
  `.trim();

  return (
    <div className={rootClasses}>
      {/* 프리미엄 글래스모피즘 헤더 */}
      <header className={`${
        settings.highContrast ? 'bg-gray-900' : 'header-glass'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="btn-secondary text-senior-sm sm:text-senior-base flex-shrink-0 min-h-[44px] min-w-[44px] px-3 py-2"
                aria-label="뒤로 가기"
              >
                <span className="sm:hidden">←</span>
                <span className="hidden sm:inline">← 뒤로</span>
              </button>
            )}
            
            {title ? (
              <h1 className="text-senior-xl sm:text-senior-3xl lg:text-display-sm font-black text-center flex-1 fade-in truncate bg-gradient-to-r from-lime-600 via-lime-500 to-grape-600 bg-clip-text text-transparent drop-shadow-lg">
                {title} ({language})
              </h1>
            ) : (
              <h1 className="text-senior-xl sm:text-senior-3xl lg:text-display-sm font-black text-center flex-1 fade-in bg-gradient-to-r from-lime-600 via-lime-500 to-grape-600 bg-clip-text text-transparent drop-shadow-lg">
                {t('app.title')} ({language})
              </h1>
            )}
            
            {/* 우측 버튼 그룹 */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* 언어 선택기 */}
              <LanguageSelector className="flex-shrink-0" />
              
              {/* 접근성 버튼 */}
              <button
                onClick={() => setShowAccessibilityPanel(true)}
                className="w-[4rem] h-[4rem] rounded-2xl flex items-center justify-center text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                  backdropFilter: 'blur(12px)'
                }}
                title="접근성 설정"
                aria-label="접근성 설정"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-200px)]">
        {children}
      </main>

      {/* 푸터 */}
      <footer className={`mt-8 sm:mt-16 py-6 sm:py-8 ${
        settings.highContrast ? 'bg-gray-900 border-t-2 border-white' : 'bg-gray-800'
      } text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-senior-sm sm:text-senior-base">
            {t('app.title')} - {t('app.subtitle')}
          </p>
          <p className="text-senior-xs sm:text-senior-sm mt-2 text-gray-400">
            {t('accessibility.title')}
          </p>
        </div>
      </footer>

      {/* 접근성 패널 */}
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default MainLayout;