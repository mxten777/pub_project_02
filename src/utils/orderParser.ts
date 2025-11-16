import type { ParsedOrder } from '../types';

// 한국어 숫자 매핑
const koreanNumbers: Record<string, number> = {
  '하나': 1, '한개': 1, '한 개': 1,
  '둘': 2, '두개': 2, '두 개': 2,
  '셋': 3, '세개': 3, '세 개': 3,
  '넷': 4, '네개': 4, '네 개': 4,
  '다섯': 5, '다섯개': 5,
  '여섯': 6, '여섯개': 6,
  '일곱': 7, '일곱개': 7,
  '여덟': 8, '여덟개': 8,
  '아홉': 9, '아홉개': 9,
  '열': 10, '열개': 10
};

// 일반적인 메뉴 키워드
const menuKeywords = [
  '된장찌개', '김치찌개', '부대찌개', '순두부찌개',
  '비빔밥', '돌솥비빔밥', '불고기',
  '제육볶음', '오징어볶음',
  '공기밥', '밥', '라면',
  '콜라', '사이다', '물'
];

export function parseVoiceOrder(transcript: string): ParsedOrder {
  const items: Array<{ name: string; quantity: number }> = [];
  let confidence = 0.7; // 기본 신뢰도

  // 텍스트 정규화
  const normalizedText = transcript
    .toLowerCase()
    .replace(/[.,!?]/g, '')
    .trim();

  // 메뉴 항목별로 파싱
  menuKeywords.forEach(menu => {
    if (normalizedText.includes(menu)) {
      let quantity = 1;
      
      // 수량 찾기 - 숫자 또는 한국어 숫자
      const beforeMenu = normalizedText.substring(0, normalizedText.indexOf(menu));
      const afterMenu = normalizedText.substring(normalizedText.indexOf(menu) + menu.length);
      
      // 숫자 찾기
      const numberMatch = [...beforeMenu.matchAll(/\d+/g), ...afterMenu.matchAll(/\d+/g)];
      if (numberMatch.length > 0) {
        quantity = parseInt(numberMatch[0][0]);
      } else {
        // 한국어 숫자 찾기
        Object.keys(koreanNumbers).forEach(korNum => {
          if (beforeMenu.includes(korNum) || afterMenu.includes(korNum)) {
            quantity = koreanNumbers[korNum];
          }
        });
      }
      
      items.push({ name: menu, quantity });
      confidence = Math.min(confidence + 0.1, 0.95);
    }
  });

  // 일반적인 패턴 매칭 개선
  if (items.length === 0) {
    // 간단한 fallback 파싱
    const words = normalizedText.split(' ');
    let currentItem = '';
    let currentQuantity = 1;
    
    words.forEach(word => {
      if (/\d+/.test(word)) {
        currentQuantity = parseInt(word);
      } else if (koreanNumbers[word]) {
        currentQuantity = koreanNumbers[word];
      } else if (word.length > 1) {
        currentItem = word;
      }
    });
    
    if (currentItem) {
      items.push({ name: currentItem, quantity: currentQuantity });
      confidence = 0.5;
    }
  }

  return {
    items,
    confidence
  };
}