import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'zh' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && ['ko', 'en', 'zh', 'ja'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // 기본값 한국어 설정
      localStorage.setItem('app-language', 'ko');
      setLanguageState('ko');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('app-language', lang);
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const translations = getTranslations(language);
    let translation = getNestedValue(translations, key) || key;
    
    // 매개변수 치환
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, String(params[param]));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 중첩된 객체에서 key로 값 가져오기
function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((curr, k) => curr?.[k], obj) || key;
}

// 번역 데이터 가져오기
function getTranslations(lang: Language) {
  const translations = {
    ko: {
      common: {
        back: '뒤로',
        next: '다음',
        cancel: '취소',
        confirm: '확인',
        save: '저장',
        close: '닫기',
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        success: '성공적으로 완료되었습니다',
        languageSelect: '언어 선택'
      },
      app: {
        title: '바이브 오더',
        subtitle: '시니어 친화형 음성 주문 시스템',
        description: '음성으로 간편하게 주문하세요'
      },
      order: {
        start: '주문 시작',
        speak: '주문 말하기',
        listening: '음성을 듣고 있습니다. 메뉴를 말씀해주세요.',
        processing: '주문을 처리 중입니다...',
        recognized: '인식된 내용:',
        confirm: '주문 확정',
        complete: '주문 완료!',
        total: '총 금액:',
        payment: {
          card: '카드 결제',
          cash: '현금 결제',
          select: '결제 방식을 선택해주세요'
        }
      },
      menu: {
        title: '메뉴',
        subtitle: '맛있는 음식을 골라보세요',
        category: '카테고리',
        price: '가격',
        soldOut: '품절',
        available: '판매중',
        quantity: '수량',
        recommendation: '추천 메뉴',
        popular: '인기',
        addToCart: '담기'
      },
      accessibility: {
        title: '접근성 설정',
        highContrast: '고대비 모드',
        fontSize: '글자 크기',
        voice: '음성 안내',
        voiceSpeed: '음성 속도',
        on: '켜짐',
        off: '꺼짐'
      },
      voice: {
        examples: '예: "된장찌개 하나, 공기밥 둘"',
        speakClearly: '큰 소리로 명확하게 말씀해주세요',
        noRecognition: '음성을 인식할 수 없습니다. 다시 시도해주세요.',
        processing: '음성을 처리하고 있습니다...'
      }
    },
    en: {
      common: {
        back: 'Back',
        next: 'Next',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        close: 'Close',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Successfully completed',
        languageSelect: 'Language Selection'
      },
      app: {
        title: 'Vibe Order',
        subtitle: 'Senior-Friendly Voice Ordering System',
        description: 'Order easily with your voice'
      },
      order: {
        start: 'Start Order',
        speak: 'Speak Order',
        listening: 'Listening to your voice. Please tell us your menu.',
        processing: 'Processing your order...',
        recognized: 'Recognized:',
        confirm: 'Confirm Order',
        complete: 'Order Complete!',
        total: 'Total:',
        payment: {
          card: 'Card Payment',
          cash: 'Cash Payment',
          select: 'Please select payment method'
        }
      },
      menu: {
        title: 'Menu',
        subtitle: 'Choose delicious food',
        category: 'Category',
        price: 'Price',
        soldOut: 'Sold Out',
        available: 'Available',
        quantity: 'Quantity',
        recommendation: 'Recommended Menu',
        popular: 'Popular',
        addToCart: 'Add to Cart'
      },
      accessibility: {
        title: 'Accessibility Settings',
        highContrast: 'High Contrast Mode',
        fontSize: 'Font Size',
        voice: 'Voice Guide',
        voiceSpeed: 'Voice Speed',
        on: 'On',
        off: 'Off'
      },
      voice: {
        examples: 'Example: "One soup, two rice"',
        speakClearly: 'Please speak clearly and loudly',
        noRecognition: 'Could not recognize speech. Please try again.',
        processing: 'Processing voice...'
      }
    },
    zh: {
      common: {
        back: '返回',
        next: '下一步',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        close: '关闭',
        loading: '加载中...',
        error: '发生错误',
        success: '成功完成',
        languageSelect: '语言选择'
      },
      app: {
        title: 'Vibe Order',
        subtitle: '老年人友好语音点餐系统',
        description: '用语音轻松点餐'
      },
      order: {
        start: '开始点餐',
        speak: '语音点餐',
        listening: '正在听取您的语音。请说出您要的菜单。',
        processing: '正在处理您的订单...',
        recognized: '识别内容:',
        confirm: '确认订单',
        complete: '订单完成！',
        total: '总金额:',
        payment: {
          card: '刷卡支付',
          cash: '现金支付',
          select: '请选择支付方式'
        }
      },
      menu: {
        title: '菜单',
        subtitle: '选择美味食物',
        category: '分类',
        price: '价格',
        soldOut: '售完',
        available: '有货',
        quantity: '数量',
        recommendation: '推荐菜单',
        popular: '热门',
        addToCart: '添加到购物车'
      },
      accessibility: {
        title: '辅助功能设置',
        highContrast: '高对比度模式',
        fontSize: '字体大小',
        voice: '语音引导',
        voiceSpeed: '语音速度',
        on: '开',
        off: '关'
      },
      voice: {
        examples: '例如: "一份汤，两份米饭"',
        speakClearly: '请大声清楚地说话',
        noRecognition: '无法识别语音。请重试。',
        processing: '正在处理语音...'
      }
    },
    ja: {
      common: {
        back: '戻る',
        next: '次へ',
        cancel: 'キャンセル',
        confirm: '確認',
        save: '保存',
        close: '閉じる',
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        success: '正常に完了しました',
        languageSelect: '言語選択'
      },
      app: {
        title: 'Vibe Order',
        subtitle: 'シニア向け音声注文システム',
        description: '音声で簡単に注文できます'
      },
      order: {
        start: '注文開始',
        speak: '音声注文',
        listening: '音声を聞いています。メニューを話してください。',
        processing: 'ご注文を処理しています...',
        recognized: '認識内容:',
        confirm: '注文確定',
        complete: '注文完了！',
        total: '合計金額:',
        payment: {
          card: 'カード決済',
          cash: '現金決済',
          select: '支払い方法を選択してください'
        }
      },
      menu: {
        title: 'メニュー',
        subtitle: '美味しい料理を選んでください',
        category: 'カテゴリ',
        price: '価格',
        soldOut: '売り切れ',
        available: '販売中',
        quantity: '数量',
        recommendation: 'おすすめメニュー',
        popular: '人気',
        addToCart: 'カートに追加'
      },
      accessibility: {
        title: 'アクセシビリティ設定',
        highContrast: 'ハイコントラストモード',
        fontSize: '文字サイズ',
        voice: '音声ガイド',
        voiceSpeed: '音声速度',
        on: 'オン',
        off: 'オフ'
      },
      voice: {
        examples: '例: "スープ一つ、ご飯二つ"',
        speakClearly: '大きな声ではっきりと話してください',
        noRecognition: '音声を認識できません。もう一度お試しください。',
        processing: '音声を処理しています...'
      }
    }
  };
  
  return translations[lang];
}