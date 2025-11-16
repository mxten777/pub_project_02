# 🧩 컴포넌트 문서

바이브 오더 프로젝트의 React 컴포넌트 사용법과 예제를 설명합니다.

## 📋 목차

- [UI 컴포넌트](#ui-컴포넌트)
- [레이아웃 컴포넌트](#레이아웃-컴포넌트)
- [음성 컴포넌트](#음성-컴포넌트)
- [메뉴 컴포넌트](#메뉴-컴포넌트)
- [주문 컴포넌트](#주문-컴포넌트)
- [관리자 컴포넌트](#관리자-컴포넌트)

---

## 🎨 UI 컴포넌트

### `SeniorButton`

**위치**: `src/components/UI/SeniorButton.tsx`

**설명**: 시니어 사용자를 위해 최적화된 버튼 컴포넌트

#### Props

```typescript
interface SeniorButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<any>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```

#### 사용 예제

```tsx
import SeniorButton from '../components/UI/SeniorButton';
import { Mic } from 'lucide-react';

// 기본 사용
<SeniorButton variant="primary" size="lg" onClick={handleClick}>
  음성 주문 시작
</SeniorButton>

// 아이콘과 함께
<SeniorButton 
  variant="secondary" 
  icon={Mic}
  disabled={isProcessing}
>
  마이크 테스트
</SeniorButton>

// 로딩 상태
<SeniorButton loading={isLoading}>
  처리중...
</SeniorButton>
```

#### 스타일 변형

- **primary**: 주요 액션용 파란색 버튼
- **secondary**: 보조 액션용 회색 버튼  
- **success**: 성공 액션용 초록색 버튼
- **warning**: 경고 액션용 노란색 버튼
- **danger**: 위험 액션용 빨간색 버튼
- **outline**: 테두리만 있는 버튼

#### 크기 옵션

- **xs**: 28px 높이 (모바일 보조 버튼)
- **sm**: 36px 높이 (모바일 기본)
- **md**: 44px 높이 (데스크탑 기본)
- **lg**: 52px 높이 (시니어 권장)
- **xl**: 60px 높이 (터치 최적화)

---

### `AccessibilityPanel`

**위치**: `src/components/UI/AccessibilityPanel.tsx`

**설명**: 접근성 설정을 관리하는 패널 컴포넌트

#### Props

```typescript
interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
```

#### 기능

- **텍스트 크기 조절**: 5단계 글씨 크기 (매우 작음 ~ 매우 큼)
- **다크 모드 토글**: 어두운 테마 전환
- **음성 속도 조절**: 0.5x ~ 2.0x 속도 조절
- **설정 저장**: localStorage에 설정 영속화

#### 사용 예제

```tsx
import AccessibilityPanel from '../components/UI/AccessibilityPanel';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button onClick={() => setShowSettings(true)}>
        접근성 설정
      </button>
      
      <AccessibilityPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
```

---

### `LoadingSpinner`

**위치**: `src/components/UI/LoadingSpinner.tsx`

**설명**: 로딩 상태를 표시하는 스피너 컴포넌트

#### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}
```

#### 사용 예제

```tsx
import LoadingSpinner from '../components/UI/LoadingSpinner';

// 기본 스피너
<LoadingSpinner />

// 메시지와 함께
<LoadingSpinner 
  size="lg" 
  message="메뉴를 불러오는 중..." 
/>

// 커스텀 스타일
<LoadingSpinner 
  className="text-blue-500" 
  size="md"
/>
```

---

### `Toast`

**위치**: `src/components/UI/Toast.tsx`

**설명**: 알림 메시지를 표시하는 토스트 컴포넌트

#### Props

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}
```

#### 사용 예제

```tsx
import { useToast } from '../contexts/ToastContext';

function OrderComponent() {
  const { showToast } = useToast();

  const handleOrderSuccess = () => {
    showToast({
      type: 'success',
      title: '주문 완료',
      message: '주문이 성공적으로 접수되었습니다.',
      duration: 3000
    });
  };

  return (
    <button onClick={handleOrderSuccess}>
      주문하기
    </button>
  );
}
```

---

## 🏗️ 레이아웃 컴포넌트

### `MainLayout`

**위치**: `src/components/Layout/MainLayout.tsx`

**설명**: 애플리케이션의 기본 레이아웃 컴포넌트

#### Props

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}
```

#### 기능

- **반응형 헤더**: 로고, 제목, 설정 버튼
- **메인 콘텐츠 영역**: 스크롤 가능한 콘텐츠 영역
- **푸터**: 앱 정보 및 추가 링크
- **접근성 지원**: 키보드 네비게이션 및 스크린 리더 지원

#### 사용 예제

```tsx
import MainLayout from '../components/Layout/MainLayout';

function OrderPage() {
  return (
    <MainLayout 
      title="음성 주문"
      showSettings={true}
      onSettingsClick={() => setShowSettings(true)}
    >
      <div className="space-y-6">
        {/* 페이지 콘텐츠 */}
      </div>
    </MainLayout>
  );
}
```

---

## 🎤 음성 컴포넌트

### `VoiceStatus`

**위치**: `src/components/Voice/VoiceStatus.tsx`

**설명**: 음성 인식 상태를 시각적으로 표시하는 컴포넌트

#### Props

```typescript
interface VoiceStatusProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript?: string;
}
```

#### 기능

- **마이크 상태 표시**: 음성 인식 중일 때 시각적 효과
- **스피커 상태 표시**: 음성 합성 중일 때 애니메이션
- **연결 상태**: 음성 API 연결 상태 표시
- **인식된 텍스트**: 실시간 음성 인식 결과 표시

#### 사용 예제

```tsx
import VoiceStatus from '../components/Voice/VoiceStatus';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeech } from '../hooks/useSpeech';

function VoiceOrderPage() {
  const { isListening, result } = useVoiceRecognition();
  const { isSpeaking } = useSpeech();

  return (
    <VoiceStatus
      isListening={isListening}
      isSpeaking={isSpeaking}
      transcript={result?.transcript}
    />
  );
}
```

---

## 🍽️ 메뉴 컴포넌트

### `MenuItemCard`

**위치**: `src/components/Menu/MenuItemCard.tsx`

**설명**: 개별 메뉴 아이템을 표시하는 카드 컴포넌트

#### Props

```typescript
interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
  isSelected?: boolean;
  disabled?: boolean;
  showPrice?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

#### 기능

- **메뉴 정보 표시**: 이름, 설명, 가격, 이미지
- **주문 추가**: 클릭으로 주문에 추가
- **상태 표시**: 선택됨, 비활성화 상태
- **반응형 디자인**: 화면 크기별 최적화

#### 사용 예제

```tsx
import MenuItemCard from '../components/Menu/MenuItemCard';

function MenuList() {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddToOrder = (item) => {
    setSelectedItems(prev => [...prev, item]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuItems.map(item => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAddToOrder={handleAddToOrder}
          isSelected={selectedItems.some(selected => selected.id === item.id)}
          size="md"
        />
      ))}
    </div>
  );
}
```

---

### `MenuRecommendations`

**위치**: `src/components/Menu/MenuRecommendations.tsx`

**설명**: 개인화된 메뉴 추천을 표시하는 컴포넌트

#### Props

```typescript
interface MenuRecommendationsProps {
  onSelectMenu: (menu: MenuItem) => void;
  className?: string;
}
```

#### 기능

- **추천 카테고리**: 인기, 개인화, 시간대별, 날씨 기반
- **추천 이유**: 각 추천의 근거 표시
- **필터링**: 카테고리별 필터링
- **무한 스크롤**: 더 많은 추천 로드

#### 사용 예제

```tsx
import MenuRecommendations from '../components/Menu/MenuRecommendations';

function WelcomePage() {
  const handleSelectMenu = (menu) => {
    // 선택된 메뉴로 주문 페이지 이동
    navigate('/order', { state: { selectedMenu: menu } });
  };

  return (
    <div className="space-y-8">
      <h2>오늘의 추천 메뉴</h2>
      <MenuRecommendations 
        onSelectMenu={handleSelectMenu}
        className="mb-8"
      />
    </div>
  );
}
```

---

## 🛒 주문 컴포넌트

### `OrderSummary`

**위치**: `src/components/Order/OrderSummary.tsx`

**설명**: 현재 주문 내역을 요약해서 보여주는 컴포넌트

#### Props

```typescript
interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  showActions?: boolean;
  editable?: boolean;
}
```

#### 기능

- **주문 아이템 목록**: 각 아이템의 이름, 수량, 가격
- **수량 조절**: +/- 버튼으로 수량 변경
- **아이템 제거**: 개별 아이템 삭제
- **총액 계산**: 자동 총액 계산 및 표시
- **할인 적용**: 쿠폰 및 할인 적용

#### 사용 예제

```tsx
import OrderSummary from '../components/Order/OrderSummary';

function OrderConfirmPage() {
  const [orderItems, setOrderItems] = useState([]);

  const handleUpdateQuantity = (itemId, quantity) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2>주문 확인</h2>
      <OrderSummary
        items={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        editable={true}
        showActions={true}
      />
    </div>
  );
}
```

---

## 👨‍💼 관리자 컴포넌트

### `StatCard`

**위치**: `src/components/Admin/StatCard.tsx`

**설명**: 통계 정보를 카드 형태로 표시하는 컴포넌트

#### Props

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
}
```

#### 사용 예제

```tsx
import StatCard from '../components/Admin/StatCard';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="총 주문 수"
        value="1,234"
        change={12.5}
        icon={ShoppingCart}
        color="blue"
      />
      
      <StatCard
        title="총 매출"
        value="₩2,456,000"
        change={-3.2}
        icon={DollarSign}
        color="green"
      />
      
      <StatCard
        title="전환율"
        value="67.8%"
        change={5.1}
        icon={TrendingUp}
        color="purple"
      />
    </div>
  );
}
```

---

### `MetricsChart`

**위치**: `src/components/Admin/MetricsChart.tsx`

**설명**: 시간별/일별 통계를 차트로 표시하는 컴포넌트

#### Props

```typescript
interface MetricsChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area';
  title?: string;
  height?: number;
  showLegend?: boolean;
}

interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}
```

#### 사용 예제

```tsx
import MetricsChart from '../components/Admin/MetricsChart';

function SalesAnalytics() {
  const salesData = [
    { label: '09:00', value: 45, date: '2024-11-16' },
    { label: '10:00', value: 67, date: '2024-11-16' },
    { label: '11:00', value: 89, date: '2024-11-16' },
    // ... more data
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <MetricsChart
        data={salesData}
        type="line"
        title="시간별 주문 현황"
        height={300}
        showLegend={true}
      />
    </div>
  );
}
```

---

## 🎯 사용 패턴 및 베스트 프랙티스

### 1. 컴포넌트 합성 (Composition)

```tsx
// 좋은 예: 합성을 통한 유연한 구조
<MainLayout title="주문 페이지">
  <VoiceStatus {...voiceProps} />
  <MenuRecommendations {...menuProps} />
  <OrderSummary {...orderProps} />
</MainLayout>

// 피할 것: 너무 많은 props를 가진 거대한 컴포넌트
<GiantOrderPage 
  voiceProps={...} 
  menuProps={...} 
  orderProps={...} 
  // ... 20개 이상의 props
/>
```

### 2. 접근성 최우선

```tsx
// 모든 상호작용 요소에 적절한 ARIA 레이블
<SeniorButton 
  ariaLabel="음성 주문을 시작합니다"
  onClick={startVoiceOrder}
>
  음성 주문
</SeniorButton>

// 키보드 네비게이션 지원
<MenuItemCard 
  item={item}
  tabIndex={0}
  onKeyDown={handleKeyDown}  // Enter, Space 키 지원
/>
```

### 3. 시니어 친화적 UX

```tsx
// 큰 터치 영역과 명확한 피드백
<SeniorButton 
  size="lg"              // 최소 44px 이상
  loading={isProcessing} // 로딩 상태 명시
  disabled={!canProceed} // 비활성화 상태 명시
>
  {isProcessing ? '처리 중...' : '주문 완료'}
</SeniorButton>

// 오류 상황 친화적 처리
{error && (
  <div className="bg-red-50 border border-red-200 rounded-senior p-4">
    <p className="text-senior-lg text-red-700">
      잠시 문제가 발생했습니다. 다시 시도해주세요.
    </p>
  </div>
)}
```

### 4. 성능 최적화

```tsx
// React.memo로 불필요한 리렌더링 방지
const MenuItemCard = React.memo(({ item, onAddToOrder }) => {
  // 컴포넌트 로직
});

// useCallback으로 함수 참조 안정화
const handleAddToOrder = useCallback((item) => {
  setOrderItems(prev => [...prev, item]);
}, []);

// Lazy loading으로 초기 로딩 속도 개선
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
```

---

## 🔧 커스터마이징 가이드

### 테마 커스터마이징

Tailwind CSS 설정에서 시니어 친화적 테마를 수정할 수 있습니다:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'senior-xs': ['16px', '24px'],   // 최소 크기도 16px
        'senior-sm': ['18px', '28px'],
        'senior-base': ['20px', '30px'],  // 기본 크기
        'senior-lg': ['24px', '36px'],
        // ... 더 큰 크기들
      },
      
      colors: {
        // 시니어 친화적 고대비 색상
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',  // 충분한 대비율 확보
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### 컴포넌트 확장

기존 컴포넌트를 확장해서 새로운 기능을 추가할 수 있습니다:

```tsx
// SeniorButton을 확장한 VoiceButton
interface VoiceButtonProps extends SeniorButtonProps {
  isListening?: boolean;
  transcript?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  isListening, 
  transcript,
  children,
  ...buttonProps 
}) => {
  return (
    <div className="relative">
      <SeniorButton 
        {...buttonProps}
        className={`${buttonProps.className} ${isListening ? 'animate-pulse' : ''}`}
      >
        {children}
      </SeniorButton>
      
      {transcript && (
        <div className="absolute top-full mt-2 p-2 bg-white border rounded">
          {transcript}
        </div>
      )}
    </div>
  );
};
```

---

**컴포넌트 문서에 대한 질문이나 개선 제안이 있으시면 언제든 이슈를 올려주세요!** 🧩✨