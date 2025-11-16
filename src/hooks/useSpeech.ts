import { useCallback, useState, useEffect } from 'react';
import { speechService } from '../services/speechService';
import { useLanguage } from '../contexts/LanguageContext';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // 주기적으로 speaking 상태 확인
    const checkSpeaking = () => {
      const currentlySpeaking = speechService.isSpeaking();
      if (isSpeaking !== currentlySpeaking) {
        setIsSpeaking(currentlySpeaking);
      }
    };

    const interval = setInterval(checkSpeaking, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const speak = useCallback(async (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    if (!speechService.isSupported()) {
      console.warn('Speech synthesis not supported');
      return Promise.resolve();
    }

    try {
      setIsSpeaking(true);
      await speechService.speak(text, language, options);
    } catch (error) {
      console.error('Speech failed:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  const isSupported = useCallback(() => {
    return speechService.isSupported();
  }, []);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    isSupported,
    language
  };
};