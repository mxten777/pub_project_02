import React, { useState, useEffect } from 'react';
import AccessibilityPanel from '../UI/AccessibilityPanel';

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
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    soundEnabled: true,
    voiceSpeed: 0.8
  });
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

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
      : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }
    ${isKeyboardUser ? 'keyboard-user' : ''}
    ${settings.fontSize === 'large' ? 'text-lg' : ''}
    ${settings.fontSize === 'extra-large' ? 'text-xl' : ''}
  `.trim();

  return (
    <div className={rootClasses}>
      {/* 헤더 */}
      <header className={`shadow-senior border-b-4 border-blue-500 ${
        settings.highContrast ? 'bg-gray-900' : 'bg-white'
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
              <h1 className="text-senior-lg sm:text-senior-2xl lg:text-senior-3xl text-center flex-1 fade-in truncate">
                {title}
              </h1>
            ) : (
              <h1 className="text-senior-lg sm:text-senior-2xl lg:text-senior-3xl text-center flex-1 fade-in">
                바이브 오더
              </h1>
            )}
            
            {/* 접근성 버튼 */}
            <button
              onClick={() => setShowAccessibilityPanel(true)}
              className="btn-secondary min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex-shrink-0 flex items-center justify-center"
              title="접근성 설정"
              aria-label="접근성 설정"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-[calc(100vh-200px)]">
        {children}
      </main>

      {/* 푸터 */}
      <footer className={`mt-8 sm:mt-16 py-6 sm:py-8 ${
        settings.highContrast ? 'bg-gray-900 border-t-2 border-white' : 'bg-gray-800'
      } text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-senior-sm sm:text-senior-base">
            음성 주문 키오스크 - 시니어 친화형
          </p>
          <p className="text-senior-xs sm:text-senior-sm mt-2 text-gray-400">
            접근성 버튼으로 화면을 더 편리하게 사용하세요
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