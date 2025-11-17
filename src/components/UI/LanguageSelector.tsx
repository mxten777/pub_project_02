import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
    setFocusedIndex(-1);
    // 언어 변경 후 버튼으로 포커스 복귀
    setTimeout(() => buttonRef.current?.focus(), 100);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(languages.findIndex(lang => lang.code === language));
    }
  };



  // 키보드 네비게이션 핸들러
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          e.preventDefault();
          break;
          
        case 'ArrowDown':
          setFocusedIndex(prev => 
            prev < languages.length - 1 ? prev + 1 : 0
          );
          e.preventDefault();
          break;
          
        case 'ArrowUp':
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : languages.length - 1
          );
          e.preventDefault();
          break;
          
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            handleLanguageSelect(languages[focusedIndex].code);
          }
          e.preventDefault();
          break;
          
        case 'Home':
          setFocusedIndex(0);
          e.preventDefault();
          break;
          
        case 'End':
          setFocusedIndex(languages.length - 1);
          e.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, languages]);

  // 외부 클릭으로 드롭다운 닫기
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 프리미엄 언어 선택 버튼 */}
      <button 
        ref={buttonRef}
        onClick={handleToggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleDropdown();
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}
        className="
          relative w-16 h-16 
          bg-gradient-to-br from-white/95 via-white/90 to-white/85
          backdrop-blur-xl 
          rounded-2xl border border-white/40
          flex flex-col items-center justify-center 
          shadow-lg
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-lime-400/50 focus:ring-offset-2
          active:scale-95 active:shadow-md
          group
        "
        style={{
          background: `linear-gradient(135deg, 
            rgba(255,255,255,0.95) 0%, 
            rgba(255,255,255,0.9) 50%, 
            rgba(255,255,255,0.85) 100%)`,
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
        aria-label={`${t('common.languageSelect')} - ${currentLanguage.name} 선택됨`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="button"
        tabIndex={0}
      >
        {/* 미세한 반짝임 효과 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <span className="relative text-2xl mb-1 transform group-hover:scale-110 transition-transform duration-200">
          {currentLanguage.flag}
        </span>
        <span className="relative text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          {currentLanguage.code.toUpperCase()}
        </span>
        
        {/* 선택된 상태 표시 */}
        {isOpen && (
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-lime-400 to-purple-500 opacity-75 blur-sm animate-pulse" />
        )}
      </button>

      {/* 프리미엄 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 투명 배경 (클릭시 닫기) */}
          <div 
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setIsOpen(false);
              setFocusedIndex(-1);
            }}
            aria-hidden="true"
          />
          
          {/* 드롭다운 컨테이너 - 버튼 아래쪽에 위치 */}
          <div className="absolute top-full left-0 mt-3 w-80 z-[9999]">
            <div 
              className="
                bg-white/95 backdrop-blur-xl 
                rounded-2xl border border-white/40 
                shadow-2xl overflow-hidden
                transform origin-top-left
              "
              role="listbox"
              aria-label={t('common.languageSelect')}
              style={{
                background: `linear-gradient(145deg, 
                  rgba(255,255,255,0.95) 0%, 
                  rgba(255,255,255,0.9) 100%)`,
                backdropFilter: 'blur(20px) saturate(180%)',
                animation: 'dropdownSlideIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `
              }}
            >
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-lime-500 to-purple-600 p-3 text-center">
                <h3 className="text-white font-bold drop-shadow-sm" id="language-dropdown-title">
                  {t('common.languageSelect')}
                </h3>
              </div>
              
              {/* 언어 목록 */}
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto" role="none">
                {languages.map((lang, index) => (
                  <button
                    key={lang.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(lang.code);
                    }}
                    onMouseEnter={(e) => {
                      setFocusedIndex(index);
                      if (language !== lang.code) {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249,250,251,0.8), rgba(243,244,246,0.9))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.transform = 'translateX(0px)';
                        e.currentTarget.style.background = '';
                      }
                    }}
                    className={`
                      relative w-full p-4 rounded-xl 
                      flex items-center justify-between 
                      transition-all duration-300 ease-out min-h-[4rem]
                      focus:outline-none focus:ring-2 focus:ring-lime-400/70 focus:ring-offset-2
                      group
                      ${language === lang.code 
                        ? 'bg-gradient-to-r from-lime-50 via-lime-100 to-purple-50 border-2 border-lime-400/60 shadow-lg transform scale-[1.02]' 
                        : focusedIndex === index
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300/70 shadow-md transform translateX(4px)'
                        : 'hover:shadow-md border border-gray-200/50 hover:border-gray-300/70'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideInFromRight 400ms ease-out forwards'
                    }}
                    role="option"
                    aria-selected={language === lang.code}
                    aria-describedby="language-dropdown-title"
                    tabIndex={focusedIndex === index ? 0 : -1}
                  >
                    {/* 선택된 언어 백그라운드 글로우 */}
                    {language === lang.code && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-lime-400/20 to-purple-400/20 animate-pulse" />
                    )}
                    
                    <div className="relative flex items-center space-x-4">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200 group-hover:rotate-12">
                        {lang.flag}
                      </span>
                      <div className="text-left">
                        <div className={`font-bold text-sm transition-colors duration-200 ${
                          language === lang.code ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                        }`}>
                          {lang.name}
                        </div>
                        <div className={`text-xs transition-colors duration-200 ${
                          language === lang.code ? 'text-gray-700' : 'text-gray-600 group-hover:text-gray-700'
                        }`}>
                          {lang.code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    {language === lang.code && (
                      <div className="relative w-6 h-6 bg-gradient-to-r from-lime-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-sm font-bold animate-bounce">✓</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lime-400 to-purple-500 animate-ping opacity-75" />
                      </div>
                    )}
                    
                    {/* 호버시 우측 화살표 */}
                    {language !== lang.code && (
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                        <span className="text-gray-400 text-sm">→</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;