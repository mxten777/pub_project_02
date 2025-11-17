import { useCallback, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../contexts/LanguageContext';

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  name: Record<Language, string>;
  price: number;
  category: string;
  keywords: Record<Language, string[]>; // 음성 인식을 위한 키워드
}

// 주문 아이템 타입
export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  options?: string[];
}

// 샘플 메뉴 데이터
const SAMPLE_MENU: MenuItem[] = [
  {
    id: 'bibimbap',
    name: {
      ko: '비빔밥',
      en: 'Bibimbap',
      zh: '韩式拌饭',
      ja: 'ビビンバ'
    },
    price: 12000,
    category: 'main',
    keywords: {
      ko: ['비빔밥', '비빔밥하나', '비빔밥 하나', '비빔밥한개'],
      en: ['bibimbap', 'mixed rice', 'korean bowl'],
      zh: ['拌饭', '韩式拌饭', '石锅拌饭'],
      ja: ['ビビンバ', 'ビビンパ', 'ミックスライス']
    }
  },
  {
    id: 'kimchi-jjigae',
    name: {
      ko: '김치찌개',
      en: 'Kimchi Stew',
      zh: '泡菜锅',
      ja: 'キムチチゲ'
    },
    price: 10000,
    category: 'stew',
    keywords: {
      ko: ['김치찌개', '김치찌개하나', '김치찌개 하나', '김치찌개한개'],
      en: ['kimchi stew', 'kimchi jjigae', 'fermented cabbage stew'],
      zh: ['泡菜锅', '辛奇汤', '泡菜汤'],
      ja: ['キムチチゲ', 'キムチ鍋', 'キムチスープ']
    }
  },
  {
    id: 'bulgogi',
    name: {
      ko: '불고기',
      en: 'Bulgogi',
      zh: '烤牛肉',
      ja: 'プルコギ'
    },
    price: 15000,
    category: 'main',
    keywords: {
      ko: ['불고기', '불고기하나', '불고기 하나', '불고기한개'],
      en: ['bulgogi', 'korean bbq', 'marinated beef'],
      zh: ['烤牛肉', '韩式烤肉', '牛肉烧烤'],
      ja: ['プルコギ', 'コリアンバーベキュー', '焼肉']
    }
  },
  {
    id: 'rice',
    name: {
      ko: '공기밥',
      en: 'Rice',
      zh: '米饭',
      ja: 'ご飯'
    },
    price: 2000,
    category: 'side',
    keywords: {
      ko: ['공기밥', '밥', '공기밥하나', '공기밥 하나', '밥하나', '밥 하나'],
      en: ['rice', 'steamed rice', 'bowl of rice'],
      zh: ['米饭', '白米饭', '蒸饭'],
      ja: ['ご飯', 'ライス', '白米']
    }
  }
];

// 수량 키워드
const QUANTITY_KEYWORDS = {
  ko: {
    '하나': 1, '한개': 1, '한 개': 1, '1개': 1, '일개': 1,
    '둘': 2, '두개': 2, '두 개': 2, '2개': 2, '이개': 2,
    '셋': 3, '세개': 3, '세 개': 3, '3개': 3, '삼개': 3,
    '넷': 4, '네개': 4, '네 개': 4, '4개': 4, '사개': 4,
    '다섯': 5, '5개': 5, '오개': 5
  },
  en: {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
  },
  zh: {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '一个': 1, '两个': 2, '三个': 3, '四个': 4, '五个': 5,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
  },
  ja: {
    '一つ': 1, '二つ': 2, '三つ': 3, '四つ': 4, '五つ': 5,
    'ひとつ': 1, 'ふたつ': 2, 'みっつ': 3, 'よっつ': 4, 'いつつ': 5,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
  }
};

export const useVoiceOrder = () => {
  const { language } = useLanguage();
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);


  // 음성 텍스트에서 메뉴와 수량 파싱
  const parseVoiceOrder = useCallback((transcript: string): OrderItem[] => {
    const normalizedText = transcript.toLowerCase().trim();
    const foundItems: OrderItem[] = [];

    // 메뉴 아이템 찾기
    SAMPLE_MENU.forEach(menuItem => {
      const keywords = menuItem.keywords[language];
      
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        if (normalizedText.includes(keywordLower)) {
          // 수량 찾기 (기본값 1)
          let quantity = 1;
          const quantityKeywords = QUANTITY_KEYWORDS[language];
          
          // 키워드 주변에서 수량 찾기
          const keywordIndex = normalizedText.indexOf(keywordLower);
          const beforeKeyword = normalizedText.substring(Math.max(0, keywordIndex - 10), keywordIndex);
          const afterKeyword = normalizedText.substring(keywordIndex + keywordLower.length, keywordIndex + keywordLower.length + 10);
          
          // 수량 키워드 검색
          Object.entries(quantityKeywords).forEach(([quantityWord, qty]) => {
            const quantityWordLower = quantityWord.toLowerCase();
            if (beforeKeyword.includes(quantityWordLower) || afterKeyword.includes(quantityWordLower)) {
              quantity = qty;
            }
          });

          // 이미 같은 메뉴가 있는지 확인
          const existingItemIndex = foundItems.findIndex(item => item.menuItem.id === menuItem.id);
          if (existingItemIndex >= 0) {
            foundItems[existingItemIndex].quantity += quantity;
          } else {
            foundItems.push({
              menuItem,
              quantity,
              options: []
            });
          }
        }
      });
    });

    return foundItems;
  }, [language]);

  // 주문 추가
  const addToOrder = useCallback((transcript: string) => {
    const newItems = parseVoiceOrder(transcript);
    
    setCurrentOrder(prevOrder => {
      const updatedOrder = [...prevOrder];
      
      newItems.forEach(newItem => {
        const existingItemIndex = updatedOrder.findIndex(
          item => item.menuItem.id === newItem.menuItem.id
        );
        
        if (existingItemIndex >= 0) {
          updatedOrder[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedOrder.push(newItem);
        }
      });
      
      return updatedOrder;
    });

    return newItems;
  }, [parseVoiceOrder]);

  // 주문 총액 계산
  const calculateTotal = useCallback((order: OrderItem[]) => {
    return order.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  }, []);



  // 주문 아이템 제거
  const removeFromOrder = useCallback((itemId: string) => {
    setCurrentOrder(prevOrder => 
      prevOrder.filter(item => item.menuItem.id !== itemId)
    );
  }, []);

  // 주문 수량 변경
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
      return;
    }

    setCurrentOrder(prevOrder => 
      prevOrder.map(item => 
        item.menuItem.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromOrder]);

  // 주문 초기화
  const clearOrder = useCallback(() => {
    setCurrentOrder([]);
  }, []);

  // 주문 확정
  const confirmOrder = useCallback(() => {
    if (currentOrder.length === 0) {
      return null;
    }

    const orderSummary = {
      items: currentOrder,
      total: calculateTotal(currentOrder),
      timestamp: new Date().toISOString()
    };

    // 여기서 실제 주문 처리 로직 구현
    console.log('주문 확정:', orderSummary);
    
    return orderSummary;
  }, [currentOrder, calculateTotal]);

  return {
    currentOrder,
    orderTotal: calculateTotal(currentOrder),
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder,
    confirmOrder,
    parseVoiceOrder,
    menu: SAMPLE_MENU
  };
};