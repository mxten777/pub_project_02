import { useCallback, useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { VoiceRecognitionResult } from '../types';
import type { Language } from '../contexts/LanguageContext';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

// 언어별 Speech Recognition 설정
const getLanguageCode = (language: Language): string => {
  const languageCodes = {
    ko: 'ko-KR',
    en: 'en-US', 
    zh: 'zh-CN',
    ja: 'ja-JP'
  };
  return languageCodes[language];
};

export const useVoiceRecognition = () => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<VoiceRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const startListening = useCallback(() => {
    if (!isSupported) {
      const errorMessages = {
        ko: '음성 인식이 지원되지 않는 브라우저입니다.',
        en: 'Speech recognition is not supported in this browser.',
        zh: '此浏览器不支持语音识别。',
        ja: 'このブラウザは音声認識をサポートしていません。'
      };
      setError(errorMessages[language]);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getLanguageCode(language);

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }
      
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setResult({
          transcript: (transcript + finalTranscript).trim(),
          confidence: event.results[event.results.length - 1][0].confidence || 0,
          isFinal: true
        });
      } else if (interimTranscript) {
        setResult({
          transcript: (transcript + interimTranscript).trim(),
          confidence: 0,
          isFinal: false
        });
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessages = {
        'no-speech': {
          ko: '음성이 감지되지 않았습니다. 다시 시도해주세요.',
          en: 'No speech detected. Please try again.',
          zh: '未检测到语音。请重试。',
          ja: '音声が検出されませんでした。もう一度お試しください。'
        },
        'network': {
          ko: '네트워크 오류가 발생했습니다.',
          en: 'Network error occurred.',
          zh: '发生网络错误。',
          ja: 'ネットワークエラーが発生しました。'
        },
        'not-allowed': {
          ko: '마이크 접근 권한이 필요합니다.',
          en: 'Microphone access permission required.',
          zh: '需要麦克风访问权限。',
          ja: 'マイクアクセス権限が必要です。'
        }
      };

      const errorType = event.error as keyof typeof errorMessages;
      const message = errorMessages[errorType]?.[language] || `음성 인식 오류: ${event.error}`;
      setError(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, language, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetResult = useCallback(() => {
    setResult(null);
    setError(null);
    setTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    result,
    error,
    transcript,
    startListening,
    stopListening,
    resetResult,
    isSupported
  };
};