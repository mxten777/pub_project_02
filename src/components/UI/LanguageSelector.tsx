import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  usePortal?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', usePortal = true }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const languageSelector = (
    <div className={`relative ${className}`}>
      {/* 현재 언어 표시 버튼 */}
      <div className="relative group">
        <button className="btn-secondary min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center px-2 text-senior-sm font-semibold">
          <span className="hidden sm:inline mr-2">{currentLanguage?.code.toUpperCase()}</span>
          <span className="text-lg">{currentLanguage?.flag}</span>
        </button>
        
        {/* 언어 선택 드롭다운 */}
        <div className="absolute top-full left-0 mt-2 bg-white rounded-senior shadow-senior-lg border border-gray-200 z-50 min-w-[12rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`
                  w-full p-4 text-left text-senior-base font-medium rounded-senior transition-all duration-200
                  ${language === lang.code 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-blue-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Portal을 사용하여 헤더에 렌더링
  useEffect(() => {
    if (usePortal) {
      const slot = document.getElementById('language-selector-slot');
      if (slot) {
        slot.innerHTML = '';
      }
    }
  }, [usePortal]);

  if (usePortal) {
    const portalTarget = document.getElementById('language-selector-slot');
    if (portalTarget) {
      return createPortal(languageSelector, portalTarget);
    }
  }

  return languageSelector;
};

export default LanguageSelector;