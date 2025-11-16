import type { Language } from '../contexts/LanguageContext';

interface VoiceConfig {
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
}

class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    const updateVoices = () => {
      this.voices = this.synthesis!.getVoices();
    };
    
    updateVoices();
    
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  private getVoiceConfig(language: Language): VoiceConfig {
    const configs: Record<Language, VoiceConfig> = {
      ko: { lang: 'ko-KR', rate: 0.8, pitch: 1.0, volume: 1.0 },
      en: { lang: 'en-US', rate: 0.9, pitch: 1.0, volume: 1.0 },
      zh: { lang: 'zh-CN', rate: 0.8, pitch: 1.1, volume: 1.0 },
      ja: { lang: 'ja-JP', rate: 0.9, pitch: 1.0, volume: 1.0 }
    };
    
    return configs[language];
  }

  private findBestVoice(language: Language): SpeechSynthesisVoice | null {
    const config = this.getVoiceConfig(language);
    
    // 정확한 언어 매칭 시도
    let voice = this.voices.find(v => v.lang === config.lang);
    
    if (!voice) {
      // 언어 코드로 부분 매칭
      const langCode = config.lang.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(langCode));
    }
    
    if (!voice) {
      // 기본 로컬 음성 사용
      voice = this.voices.find(v => v.localService);
    }
    
    return voice || null;
  }

  async speak(
    text: string, 
    language: Language,
    options?: Partial<VoiceConfig>
  ): Promise<void> {
    if (!this.synthesis || !text.trim()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      try {
        // 기존 음성 중지
        this.synthesis!.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const config = this.getVoiceConfig(language);
        const bestVoice = this.findBestVoice(language);
        
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        
        utterance.lang = config.lang;
        utterance.rate = options?.rate ?? config.rate;
        utterance.pitch = options?.pitch ?? config.pitch;
        utterance.volume = options?.volume ?? config.volume;
        
        utterance.onend = () => resolve();
        utterance.onerror = (error) => {
          console.warn('Speech synthesis error:', error);
          resolve(); // 에러가 있어도 계속 진행
        };
        
        this.synthesis!.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis failed:', error);
        resolve();
      }
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  isSupported(): boolean {
    return !!this.synthesis;
  }

  getAvailableVoices(language?: Language): SpeechSynthesisVoice[] {
    if (!language) return this.voices;
    
    const config = this.getVoiceConfig(language);
    const langCode = config.lang.split('-')[0];
    
    return this.voices.filter(voice => 
      voice.lang.startsWith(langCode) || voice.lang === config.lang
    );
  }
}

export const speechService = new SpeechService();
export default speechService;