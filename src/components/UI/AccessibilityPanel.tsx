import React, { useState, useEffect } from 'react';
import { Settings, Moon, Volume2, Type, Eye, X } from 'lucide-react';
import SeniorButton from './SeniorButton';

interface AccessibilitySettings {
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  soundEnabled: boolean;
  voiceSpeed: number;
}

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    darkMode: false,
    fontSize: 'normal',
    soundEnabled: true,
    voiceSpeed: 0.8
  });

  useEffect(() => {
    // 로컬 저장소에서 설정 불러오기
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      onSettingsChange(parsed);
      
      // 저장된 설정 적용
      document.body.classList.toggle('high-contrast', parsed.highContrast);
      document.body.classList.toggle('dark', parsed.darkMode);
      document.body.className = document.body.className.replace(/text-size-\w+/g, '');
      document.body.classList.add(`text-size-${parsed.fontSize}`);
    }
  }, [onSettingsChange]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
    
    // 실시간 적용
    if (key === 'highContrast') {
      document.body.classList.toggle('high-contrast', value as boolean);
    }
    if (key === 'darkMode') {
      document.body.classList.toggle('dark', value as boolean);
    }
    if (key === 'fontSize') {
      document.body.className = document.body.className.replace(/text-size-\w+/g, '');
      document.body.classList.add(`text-size-${value}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-2 sm:p-4">
      <div className="card-premium max-w-md w-full mx-2 sm:mx-4 animate-fade-in max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <h2 className="text-senior-xl font-display font-bold text-neutral-900 flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Settings size={24} className="text-primary-600" />
            </div>
            접근성 설정
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={24} className="text-neutral-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 고대비 모드 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-primary-600" />
                <span className="text-senior-base font-semibold text-neutral-800">고대비 모드</span>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-senior-sm text-neutral-600 ml-7">배경을 어둡게 하고 글자를 밝게 표시</p>
          </div>

          <div className="divider-premium" />

          {/* 다크모드 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-primary-600" />
                <span className="text-senior-base font-semibold text-neutral-800">어두운 테마</span>
              </div>
              <button
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="divider-premium" />

          {/* 글자 크기 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Type size={20} className="text-primary-600" />
              <span className="text-senior-base font-semibold text-neutral-800">글자 크기</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'normal', label: '보통' },
                { value: 'large', label: '큼' },
                { value: 'extra-large', label: '매우 큼' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateSetting('fontSize', value as any)}
                  className={`flex-1 py-3 px-4 rounded-premium font-semibold text-senior-sm transition-all ${
                    settings.fontSize === value
                      ? 'bg-primary-600 text-white shadow-premium'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-premium" />

          {/* 음성 안내 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-primary-600" />
                <span className="text-senior-base font-semibold text-neutral-800">음성 안내</span>
              </div>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-senior-sm text-neutral-600">음성 안내 켜기/끄기</p>
            
            {settings.soundEnabled && (
              <div className="space-y-3 mt-4 p-4 bg-primary-25 rounded-premium">
                <div className="flex items-center justify-between">
                  <span className="text-senior-sm font-semibold text-neutral-700">음성 속도</span>
                  <span className="text-senior-sm text-primary-600 font-bold">
                    {settings.voiceSpeed.toFixed(1)}배속
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={settings.voiceSpeed}
                    onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer slider"
                  />
                  <style>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #2563eb;
                      cursor: pointer;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .slider::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #2563eb;
                      cursor: pointer;
                      border: none;
                    }
                  `}</style>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>느림 (0.5배)</span>
                  <span>빠름 (1.5배)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <SeniorButton 
            variant="primary" 
            size="large" 
            onClick={onClose}
            fullWidth
            className="gradient-primary"
          >
            ✓ 설정 저장
          </SeniorButton>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;