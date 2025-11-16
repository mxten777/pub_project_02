# 🔌 API 문서

바이브 오더 프로젝트의 주요 서비스 및 유틸리티 API 문서입니다.

## 📋 목차

- [음성 인식 서비스](#음성-인식-서비스)
- [음성 합성 서비스](#음성-합성-서비스)
- [메뉴 서비스](#메뉴-서비스)
- [주문 서비스](#주문-서비스)
- [분석 서비스](#분석-서비스)
- [추천 서비스](#추천-서비스)
- [유틸리티 함수](#유틸리티-함수)

---

## 🎤 음성 인식 서비스

### `useVoiceRecognition` Hook

**위치**: `src/hooks/useVoiceRecognition.ts`

**설명**: Web Speech API를 활용한 실시간 음성 인식 기능을 제공합니다.

#### 반환값

```typescript
interface VoiceRecognitionReturn {
  isListening: boolean;        // 현재 음성 인식 중인지 여부
  result: SpeechResult | null; // 인식된 음성 결과
  error: string | null;        // 오류 메시지
  isSupported: boolean;        // 브라우저 지원 여부
  startListening: () => void;  // 음성 인식 시작
  stopListening: () => void;   // 음성 인식 중지
  resetResult: () => void;     // 결과 초기화
}
```

#### 사용 예제

```typescript
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

function VoiceOrderComponent() {
  const {
    isListening,
    result,
    error,
    startListening,
    stopListening
  } = useVoiceRecognition();

  const handleStartOrder = () => {
    startListening();
  };

  useEffect(() => {
    if (result?.isFinal) {
      console.log('인식된 주문:', result.transcript);
    }
  }, [result]);

  return (
    <button onClick={handleStartOrder} disabled={isListening}>
      {isListening ? '듣고 있습니다...' : '음성 주문 시작'}
    </button>
  );
}
```

---

## 🔊 음성 합성 서비스

### `useSpeech` Hook

**위치**: `src/hooks/useSpeech.ts`

**설명**: 텍스트를 음성으로 변환하는 기능을 제공합니다.

#### 반환값

```typescript
interface UseSpeechReturn {
  speak: (text: string, options?: SpeechOptions) => Promise<void>;
  isSpeaking: boolean;
  stop: () => void;
  isSupported: boolean;
}

interface SpeechOptions {
  rate?: number;    // 말하기 속도 (0.1 - 10)
  pitch?: number;   // 음성 높낮이 (0 - 2)
  volume?: number;  // 음성 크기 (0 - 1)
  voice?: string;   // 음성 종류
}
```

#### 사용 예제

```typescript
import { useSpeech } from '../hooks/useSpeech';

function OrderConfirmComponent() {
  const { speak, isSpeaking } = useSpeech();

  const confirmOrder = async () => {
    await speak('주문이 접수되었습니다. 결제를 진행해주세요.', {
      rate: 0.9,
      pitch: 1.0
    });
  };

  return (
    <button onClick={confirmOrder} disabled={isSpeaking}>
      주문 확인
    </button>
  );
}
```

---

## 🍽️ 메뉴 서비스

### `MenuService` 클래스

**위치**: `src/services/menuService.ts`

**설명**: 메뉴 데이터 관리 및 조작 기능을 제공합니다.

#### 주요 메서드

```typescript
class MenuService {
  // 모든 메뉴 조회
  getAllMenus(): Promise<MenuItem[]>
  
  // 카테고리별 메뉴 조회
  getMenusByCategory(category: string): Promise<MenuItem[]>
  
  // 메뉴 ID로 조회
  getMenuById(id: string): Promise<MenuItem | null>
  
  // 메뉴 검색
  searchMenus(query: string): Promise<MenuItem[]>
  
  // 인기 메뉴 조회
  getPopularMenus(limit?: number): Promise<MenuItem[]>
}
```

#### 사용 예제

```typescript
import { menuService } from '../services/menuService';

// 모든 메뉴 가져오기
const menus = await menuService.getAllMenus();

// 특정 카테고리 메뉴
const mainDishes = await menuService.getMenusByCategory('메인요리');

// 메뉴 검색
const searchResults = await menuService.searchMenus('김치');
```

---

## 🛒 주문 서비스

### `OrderService` 클래스

**위치**: `src/services/orderService.ts`

**설명**: 주문 생성, 수정, 관리 기능을 제공합니다.

#### 주요 메서드

```typescript
class OrderService {
  // 새 주문 생성
  createOrder(items: OrderItem[]): Promise<Order>
  
  // 주문에 아이템 추가
  addItemToOrder(orderId: string, item: OrderItem): Promise<Order>
  
  // 주문에서 아이템 제거
  removeItemFromOrder(orderId: string, itemId: string): Promise<Order>
  
  // 주문 수량 변경
  updateItemQuantity(orderId: string, itemId: string, quantity: number): Promise<Order>
  
  // 주문 총액 계산
  calculateTotal(items: OrderItem[]): number
  
  // 주문 완료
  completeOrder(orderId: string): Promise<Order>
}
```

#### 사용 예제

```typescript
import { orderService } from '../services/orderService';

// 새 주문 생성
const newOrder = await orderService.createOrder([
  { id: '1', name: '김치찌개', price: 8000, quantity: 1 },
  { id: '2', name: '공기밥', price: 1500, quantity: 2 }
]);

// 총액 계산
const total = orderService.calculateTotal(newOrder.items);
console.log(`총 금액: ${total.toLocaleString()}원`);
```

---

## 📊 분석 서비스

### `AnalyticsService` 클래스

**위치**: `src/services/analyticsService.ts`

**설명**: 주문 데이터 분석 및 통계 기능을 제공합니다.

#### 주요 메서드

```typescript
class AnalyticsService {
  // 대시보드 통계 조회
  getDashboardStats(dateRange: DateRange): Promise<DashboardStats>
  
  // 실시간 메트릭 조회
  getRealTimeMetrics(): Promise<RealTimeMetrics>
  
  // 메뉴별 성과 분석
  getMenuPerformance(menuId: string, dateRange: DateRange): Promise<MenuPerformance>
  
  // 고객 만족도 분석
  getCustomerSatisfactionStats(dateRange: DateRange): Promise<SatisfactionStats>
}
```

#### 사용 예제

```typescript
import { analyticsService } from '../services/analyticsService';

// 최근 30일 통계 조회
const stats = await analyticsService.getDashboardStats({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
});

console.log(`총 주문 수: ${stats.totalOrders}`);
console.log(`총 매출: ${stats.totalRevenue.toLocaleString()}원`);
```

---

## 🎯 추천 서비스

### `RecommendationService` 클래스

**위치**: `src/services/recommendationService.ts`

**설명**: 개인화된 메뉴 추천 기능을 제공합니다.

#### 주요 메서드

```typescript
class RecommendationService {
  // 개인화 추천
  getPersonalizedRecommendations(userId?: string): Promise<MenuRecommendation[]>
  
  // 인기 메뉴 추천
  getPopularRecommendations(): Promise<MenuRecommendation[]>
  
  // 시간대별 추천
  getTimeBasedRecommendations(): Promise<MenuRecommendation[]>
  
  // 날씨 기반 추천
  getWeatherBasedRecommendations(): Promise<MenuRecommendation[]>
}
```

#### 사용 예제

```typescript
import { recommendationService } from '../services/recommendationService';

// 개인화 추천 메뉴 가져오기
const recommendations = await recommendationService.getPersonalizedRecommendations();

recommendations.forEach(rec => {
  console.log(`${rec.menu.name} - ${rec.reason}`);
});
```

---

## 🛠️ 유틸리티 함수

### 주문 파서 (`orderParser.ts`)

**위치**: `src/utils/orderParser.ts`

**설명**: 음성으로 인식된 텍스트를 주문 아이템으로 변환합니다.

```typescript
// 음성 텍스트를 주문으로 파싱
function parseVoiceOrder(transcript: string, menuItems: MenuItem[]): OrderItem[]

// 수량 텍스트를 숫자로 변환
function parseQuantity(quantityText: string): number

// 메뉴 이름 매칭
function findMenuByName(name: string, menuItems: MenuItem[]): MenuItem | null
```

#### 사용 예제

```typescript
import { parseVoiceOrder } from '../utils/orderParser';
import { menuService } from '../services/menuService';

const transcript = "김치찌개 하나하고 공기밥 둘";
const menuItems = await menuService.getAllMenus();
const orderItems = parseVoiceOrder(transcript, menuItems);

console.log(orderItems);
// 출력: [
//   { id: '1', name: '김치찌개', price: 8000, quantity: 1 },
//   { id: '2', name: '공기밥', price: 1500, quantity: 2 }
// ]
```

### 포맷터 유틸리티 (`formatters.ts`)

**위치**: `src/utils/formatters.ts`

```typescript
// 가격 포맷팅
function formatPrice(price: number): string

// 날짜 포맷팅
function formatDate(date: Date): string

// 시간 포맷팅
function formatTime(seconds: number): string

// 퍼센트 포맷팅
function formatPercentage(value: number): string
```

#### 사용 예제

```typescript
import { formatPrice, formatDate } from '../utils/formatters';

const price = formatPrice(15000);        // "15,000원"
const date = formatDate(new Date());     // "2024년 11월 16일"
```

---

## 🔧 설정 및 상수

### 앱 설정 (`config.ts`)

**위치**: `src/utils/config.ts`

```typescript
export const APP_CONFIG = {
  // 음성 인식 설정
  SPEECH_RECOGNITION: {
    LANGUAGE: 'ko-KR',
    MAX_RESULTS: 1,
    INTERIM_RESULTS: true,
    CONTINUOUS: false
  },
  
  // 음성 합성 설정
  SPEECH_SYNTHESIS: {
    DEFAULT_RATE: 0.9,
    DEFAULT_PITCH: 1.0,
    DEFAULT_VOLUME: 1.0
  },
  
  // UI 설정
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    SENIOR_FONT_SCALE: 1.2
  }
};
```

---

## 📱 타입 정의

### 핵심 타입들 (`types/index.ts`)

```typescript
// 메뉴 아이템
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular: boolean;
  isAvailable: boolean;
}

// 주문 아이템
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: OrderOption[];
}

// 주문
interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

// 메뉴 추천
interface MenuRecommendation {
  menu: MenuItem;
  type: 'popular' | 'personal' | 'time' | 'weather';
  reason: string;
  confidence: number;
}
```

---

## 🤝 기여 가이드라인

새로운 API를 추가할 때는 다음 사항을 준수해주세요:

1. **TypeScript 타입 정의**: 모든 함수와 클래스에 적절한 타입 정의
2. **JSDoc 주석**: 공개 API에는 JSDoc 형식의 문서 주석 추가
3. **에러 처리**: 적절한 에러 핸들링 및 사용자 친화적 에러 메시지
4. **테스트**: 새로운 기능에는 테스트 케이스 포함
5. **접근성**: 시니어 사용자를 고려한 UX 설계

---

**API 문서에 대한 질문이나 개선 제안이 있으시면 언제든 이슈를 올려주세요!** 📝