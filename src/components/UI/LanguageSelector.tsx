import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';
import SeniorButton from './SeniorButton';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className={`relative ${className}`}>
      {/* 현재 언어 표시 버튼 */}
      <div className="relative group">
        <SeniorButton
          variant="secondary"
          className="!min-w-[5rem] !min-h-[4rem] flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <Globe size={24} />
            <span className="text-senior-base">
              {currentLanguage?.flag}
            </span>
          </div>
        </SeniorButton>
        
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
};

export default LanguageSelector;