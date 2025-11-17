import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const languages = React.useMemo(() => [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' }
  ], []);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // 외부 클릭 감지
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키로 닫기
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 언어 선택 버튼 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[3.5rem] h-[3.5rem] rounded-xl flex flex-col items-center justify-center font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 shrink-0 border border-white/40"
        style={{ 
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          backdropFilter: 'blur(16px)'
        }}
        aria-label="언어 선택"
        aria-expanded={isOpen}
      >
        <span className="text-base mb-0.5">{currentLanguage.flag}</span>
        <span className="text-xs font-black text-gray-700 leading-none">{currentLanguage.code.toUpperCase()}</span>
      </button>

      {/* 드롭다운 메뉴 - Portal로 body에 렌더링 */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-start justify-end pt-20 pr-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-64 bg-white rounded-xl border-2 border-gray-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              animation: 'fadeInDown 0.15s ease-out',
              backgroundColor: 'rgb(255, 255, 255)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-lime-500 to-purple-500 px-3 py-2.5 text-center" style={{ backgroundColor: 'rgb(132, 204, 22)' }}>
              <h3 className="text-sm font-bold text-white drop-shadow-sm">언어 선택</h3>
            </div>
            
            {/* 언어 목록 */}
            <div className="p-2 bg-white">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center justify-between text-left
                    ${index < languages.length - 1 ? 'mb-1' : ''}
                    ${language === lang.code 
                      ? 'bg-lime-50 border border-lime-300 shadow-sm' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{lang.name}</div>
                      <div className="text-xs text-gray-600 font-semibold">{lang.code.toUpperCase()}</div>
                    </div>
                  </div>
                  {language === lang.code && (
                    <div className="w-5 h-5 bg-gradient-to-r from-lime-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default LanguageSelector;