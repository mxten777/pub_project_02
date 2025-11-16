# 👨‍💻 개발자 가이드

바이브 오더 프로젝트의 개발 환경 설정, 코딩 컨벤션, 그리고 기여 방법을 안내합니다.

## 📋 목차

- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [코딩 컨벤션](#코딩-컨벤션)
- [Git 워크플로우](#git-워크플로우)
- [테스팅 가이드](#테스팅-가이드)
- [배포 가이드](#배포-가이드)
- [문제 해결](#문제-해결)
- [성능 최적화](#성능-최적화)

---

## 🛠️ 개발 환경 설정

### 필수 도구

#### 1. Node.js 및 패키지 매니저

```bash
# Node.js LTS 버전 설치 (18.0 이상)
# https://nodejs.org/ 에서 다운로드

# 설치 확인
node --version  # v18.0.0 이상
npm --version   # v9.0.0 이상
```

#### 2. IDE 및 확장 프로그램 (VS Code 권장)

**필수 확장 프로그램:**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

**VS Code 설정 (`settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### 3. Git 설정

```bash
# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 기본 브랜치명 설정
git config --global init.defaultBranch main

# 줄 끝 문자 설정 (Windows)
git config --global core.autocrlf true

# 줄 끝 문자 설정 (macOS/Linux)
git config --global core.autocrlf input
```

### 프로젝트 클론 및 설정

```bash
# 저장소 클론
git clone <repository-url>
cd vibe-order

# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

### 개발 도구

#### Hot Reload 확인

개발 서버 실행 후 파일을 수정하면 자동으로 브라우저가 새로고침됩니다.

#### TypeScript 컴파일 체크

```bash
# 타입 체크만 실행 (빌드 없이)
npx tsc --noEmit

# 지속적 타입 체크
npx tsc --noEmit --watch
```

#### 린트 및 포맷팅

```bash
# ESLint 실행
npm run lint

# Prettier로 코드 포맷팅
npx prettier --write "src/**/*.{ts,tsx,js,jsx,css,md}"
```

---

## 🏗️ 프로젝트 구조

### 디렉토리 구조

```
vibe-order/
├── public/                 # 정적 파일
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── UI/            # 재사용 가능한 UI 컴포넌트
│   │   │   ├── SeniorButton.tsx
│   │   │   ├── AccessibilityPanel.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── Layout/        # 레이아웃 컴포넌트
│   │   │   └── MainLayout.tsx
│   │   ├── Menu/          # 메뉴 관련 컴포넌트
│   │   │   ├── MenuItemCard.tsx
│   │   │   └── MenuRecommendations.tsx
│   │   ├── Voice/         # 음성 기능 컴포넌트
│   │   │   └── VoiceStatus.tsx
│   │   ├── Order/         # 주문 관련 컴포넌트
│   │   │   └── OrderSummary.tsx
│   │   └── Admin/         # 관리자 컴포넌트
│   │       ├── StatCard.tsx
│   │       └── MetricsChart.tsx
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── WelcomePage.tsx
│   │   ├── VoiceOrderPage.tsx
│   │   ├── OrderConfirmPage.tsx
│   │   ├── OrderCompletePage.tsx
│   │   └── EnhancedAdminPage.tsx
│   ├── hooks/             # 커스텀 React Hooks
│   │   ├── useVoiceRecognition.ts
│   │   └── useSpeech.ts
│   ├── contexts/          # React Context
│   │   ├── LanguageContext.tsx
│   │   └── ToastContext.tsx
│   ├── services/          # 비즈니스 로직 및 API
│   │   ├── menuService.ts
│   │   ├── orderService.ts
│   │   ├── analyticsService.ts
│   │   └── recommendationService.ts
│   ├── utils/             # 유틸리티 함수
│   │   ├── orderParser.ts
│   │   ├── formatters.ts
│   │   └── config.ts
│   ├── types/             # TypeScript 타입 정의
│   │   └── index.ts
│   ├── assets/            # 이미지, 폰트 등
│   ├── App.tsx            # 메인 App 컴포넌트
│   ├── main.tsx           # 진입점
│   └── index.css          # 글로벌 스타일
├── docs/                  # 프로젝트 문서
│   ├── API.md
│   ├── COMPONENTS.md
│   └── DEVELOPMENT.md
├── .gitignore             # Git 무시 파일
├── eslint.config.js       # ESLint 설정
├── tailwind.config.js     # Tailwind CSS 설정
├── tsconfig.json          # TypeScript 설정
├── vite.config.ts         # Vite 설정
├── package.json           # 프로젝트 설정 및 의존성
└── README.md              # 프로젝트 개요
```

### 파일 명명 규칙

#### 컴포넌트 파일

- **PascalCase** 사용: `SeniorButton.tsx`, `VoiceStatus.tsx`
- 폴더와 함께 구조화: `components/UI/SeniorButton.tsx`

#### 서비스 및 유틸리티 파일

- **camelCase** 사용: `menuService.ts`, `orderParser.ts`
- 목적에 따른 폴더 구분: `services/`, `utils/`

#### 페이지 컴포넌트

- **PascalCase** + **Page** 접미사: `WelcomePage.tsx`, `VoiceOrderPage.tsx`

#### Hook 파일

- **use** 접두사 + **camelCase**: `useVoiceRecognition.ts`, `useSpeech.ts`

---

## 📝 코딩 컨벤션

### TypeScript 컨벤션

#### 1. 인터페이스 정의

```typescript
// 좋은 예: 명확하고 구체적인 인터페이스
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

// 피할 것: 모호한 타입
interface Item {
  id: string;
  data: any; // any 사용 지양
}
```

#### 2. Props 인터페이스

```typescript
// 컴포넌트 Props는 컴포넌트명 + Props
interface SeniorButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string; // 접근성 props 포함
}

// 기본값은 함수 매개변수에서 설정
const SeniorButton: React.FC<SeniorButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  'aria-label': ariaLabel
}) => {
  // 컴포넌트 로직
};
```

#### 3. Hook 반환 타입

```typescript
// Hook의 반환 타입을 명시
interface UseVoiceRecognitionReturn {
  isListening: boolean;
  result: SpeechResult | null;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

function useVoiceRecognition(): UseVoiceRecognitionReturn {
  // Hook 로직
}
```

### React 컨벤션

#### 1. 컴포넌트 구조

```typescript
// 1. Imports (외부 라이브러리 먼저, 내부 모듈 나중)
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

import SeniorButton from '../UI/SeniorButton';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import type { MenuItem, OrderItem } from '../../types';

// 2. Interface 정의
interface VoiceOrderPageProps {
  onOrderComplete: (items: OrderItem[]) => void;
  onBack: () => void;
}

// 3. 컴포넌트 정의
const VoiceOrderPage: React.FC<VoiceOrderPageProps> = ({
  onOrderComplete,
  onBack
}) => {
  // 4. State 정의
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 5. Hooks 사용
  const { isListening, startListening } = useVoiceRecognition();
  
  // 6. Event handlers (useCallback 사용)
  const handleStartOrder = useCallback(() => {
    startListening();
  }, [startListening]);
  
  // 7. Effects
  useEffect(() => {
    // Effect 로직
  }, []);
  
  // 8. Render
  return (
    <div className="space-y-6">
      {/* JSX */}
    </div>
  );
};

// 9. Export
export default VoiceOrderPage;
```

#### 2. 조건부 렌더링

```typescript
// 좋은 예: 명확한 조건부 렌더링
{isLoading ? (
  <LoadingSpinner message="메뉴를 불러오는 중..." />
) : error ? (
  <ErrorMessage message={error} onRetry={handleRetry} />
) : (
  <MenuList items={menuItems} onSelectItem={handleSelectItem} />
)}

// 피할 것: 복잡한 중첩 조건
{isLoading && !error && data && (
  <div>
    {data.map(item => 
      item.isVisible && item.category === 'main' && (
        <ItemCard key={item.id} item={item} />
      )
    )}
  </div>
)}
```

#### 3. 이벤트 핸들러

```typescript
// 좋은 예: useCallback 사용으로 성능 최적화
const handleAddToOrder = useCallback((item: MenuItem) => {
  setOrderItems(prev => {
    const existingItem = prev.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      return prev.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      );
    }
    
    return [...prev, { ...item, quantity: 1 }];
  });
}, []);

// 피할 것: 인라인 함수 (리렌더링 유발)
<button onClick={() => addToOrder(item)}>
  주문 추가
</button>
```

### CSS/Tailwind 컨벤션

#### 1. 클래스명 순서

```typescript
// 1. 레이아웃 (display, position, flexbox 등)
// 2. 크기 (width, height, padding, margin)
// 3. 타이포그래피 (font, text)
// 4. 색상 (bg, text, border)
// 5. 기타 (shadow, rounded, transform 등)

<button className="
  flex items-center justify-center
  px-6 py-3 w-full
  text-senior-lg font-semibold
  bg-blue-500 text-white border border-blue-600
  rounded-senior shadow-senior hover:bg-blue-600 transition-colors
">
  버튼 텍스트
</button>
```

#### 2. 반응형 클래스

```typescript
// Mobile-first 접근법 사용
<div className="
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-3 sm:gap-4 lg:gap-6
  p-4 sm:p-6 lg:p-8
">
  {/* 콘텐츠 */}
</div>
```

#### 3. 시니어 친화적 스타일링

```typescript
// 시니어 친화적 스타일 적용
<button className="
  min-w-[44px] min-h-[44px]        // 터치 영역 최소 크기
  text-senior-lg                    // 큰 글씨
  px-6 py-4                        // 충분한 패딩
  bg-blue-500 hover:bg-blue-600    // 명확한 상태 변화
  focus:ring-4 focus:ring-blue-300 // 키보드 포커스 표시
  transition-all duration-200       // 부드러운 전환
">
  {children}
</button>
```

---

## 🔄 Git 워크플로우

### 브랜치 전략

```bash
main          # 프로덕션 브랜치
├── develop   # 개발 브랜치
├── feature/* # 새 기능 개발
├── bugfix/*  # 버그 수정
└── hotfix/*  # 긴급 수정
```

### 브랜치 명명 규칙

```bash
# 기능 개발
feature/voice-recognition-improvement
feature/mobile-responsive-design

# 버그 수정
bugfix/order-total-calculation
bugfix/accessibility-panel-layout

# 긴급 수정
hotfix/security-vulnerability
hotfix/critical-order-bug
```

### 커밋 메시지 컨벤션

```bash
# 형식: type(scope): description

feat(voice): 음성 인식 정확도 개선
fix(order): 주문 총액 계산 오류 수정
style(ui): 시니어 버튼 스타일 개선
docs(api): API 문서 업데이트
refactor(service): 메뉴 서비스 코드 리팩토링
test(components): 컴포넌트 테스트 케이스 추가
chore(deps): 의존성 버전 업데이트
```

### 개발 워크플로우

```bash
# 1. 최신 develop 브랜치로 전환
git checkout develop
git pull origin develop

# 2. 새 기능 브랜치 생성
git checkout -b feature/new-awesome-feature

# 3. 개발 진행
# ... 코드 작성 ...

# 4. 변경사항 커밋
git add .
git commit -m "feat(component): 새로운 멋진 기능 추가"

# 5. 원격 브랜치에 푸시
git push origin feature/new-awesome-feature

# 6. Pull Request 생성
# GitHub/GitLab에서 PR 생성

# 7. 코드 리뷰 및 병합
# 리뷰 완료 후 develop 브랜치에 병합
```

### Pull Request 템플릿

```markdown
## 변경사항 요약
- 새로운 기능 또는 수정사항에 대한 간단한 설명

## 변경 타입
- [ ] 새 기능 (feature)
- [ ] 버그 수정 (bugfix)
- [ ] 문서 업데이트 (docs)
- [ ] 스타일 변경 (style)
- [ ] 리팩토링 (refactor)
- [ ] 테스트 추가 (test)

## 테스트
- [ ] 새로운 코드에 대한 테스트 작성 완료
- [ ] 기존 테스트 모두 통과
- [ ] 접근성 테스트 완료
- [ ] 모바일 반응형 테스트 완료

## 체크리스트
- [ ] ESLint 오류 없음
- [ ] TypeScript 컴파일 오류 없음
- [ ] 코드 리뷰 요청 완료
- [ ] 관련 문서 업데이트 완료
```

---

## 🧪 테스팅 가이드

### 수동 테스트

#### 1. 기능 테스트

```bash
# 개발 서버 실행
npm run dev

# 테스트 체크리스트:
# ✅ 음성 인식 시작/중지 동작
# ✅ 메뉴 선택 및 주문 추가
# ✅ 주문 수량 증감
# ✅ 접근성 설정 변경
# ✅ 다크 모드 전환
# ✅ 언어 변경
# ✅ 모바일 반응형 레이아웃
```

#### 2. 브라우저 호환성 테스트

```bash
# 테스트 대상 브라우저:
# ✅ Chrome 60+
# ✅ Firefox 55+
# ✅ Safari 14+
# ✅ Edge 79+

# 각 브라우저에서:
# ✅ 음성 인식 기능 동작
# ✅ 음성 합성 기능 동작
# ✅ 레이아웃 정상 표시
# ✅ 터치 인터랙션 (모바일)
```

#### 3. 접근성 테스트

```bash
# 키보드 네비게이션 테스트:
# ✅ Tab 키로 모든 요소 접근 가능
# ✅ Enter/Space 키로 버튼 활성화
# ✅ Escape 키로 모달 닫기

# 스크린 리더 테스트:
# ✅ NVDA/JAWS/VoiceOver로 테스트
# ✅ 모든 요소에 적절한 레이블
# ✅ 상태 변화 음성 안내
```

### 자동화된 테스트

#### 1. 타입 체크

```bash
# TypeScript 컴파일 체크
npx tsc --noEmit

# 지속적 타입 체크
npx tsc --noEmit --watch
```

#### 2. 린팅

```bash
# ESLint 실행
npm run lint

# 자동 수정 가능한 오류 수정
npm run lint --fix
```

#### 3. 빌드 테스트

```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 테스트 자동화 스크립트

```json
// package.json에 추가할 스크립트
{
  "scripts": {
    "test:types": "tsc --noEmit",
    "test:lint": "eslint . --ext .ts,.tsx",
    "test:build": "npm run build",
    "test:all": "npm run test:types && npm run test:lint && npm run test:build",
    "test:watch": "tsc --noEmit --watch"
  }
}
```

---

## 🚀 배포 가이드

### Vercel 배포 (권장)

#### 1. Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 로그인
vercel login
```

#### 2. 프로젝트 배포

```bash
# 첫 배포 (프로젝트 설정)
vercel

# 후속 배포
vercel --prod
```

#### 3. 환경 변수 설정

```bash
# Vercel 대시보드에서 또는 CLI로 설정
vercel env add VITE_API_URL production
```

### Netlify 배포

#### 1. 빌드 설정

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 배포

```bash
# 수동 배포
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭

# CLI 배포
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### GitHub Pages 배포

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## 🐛 문제 해결

### 자주 발생하는 문제들

#### 1. 음성 인식이 작동하지 않는 경우

```typescript
// 브라우저 지원 확인
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  console.error('음성 인식이 지원되지 않는 브라우저입니다.');
  // 대안 UI 표시
}

// HTTPS 환경 확인
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('음성 인식은 HTTPS 환경에서만 작동합니다.');
}
```

#### 2. TypeScript 컴파일 오류

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 캐시 클리어
npx tsc --build --clean

# tsconfig.json 확인
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true
  }
}
```

#### 3. Tailwind CSS 스타일이 적용되지 않는 경우

```javascript
// tailwind.config.js 확인
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 올바른 경로 설정
  ],
  // ...
}
```

```css
/* index.css 확인 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. 빌드 오류

```bash
# 의존성 충돌 해결
npm ls  # 의존성 트리 확인
npm audit fix  # 보안 취약점 수정

# Vite 캐시 클리어
rm -rf node_modules/.vite
npm run dev
```

### 디버깅 도구

#### 1. 브라우저 개발자 도구

```javascript
// 음성 인식 디버깅
window.speechRecognitionDebug = true;

// 주문 데이터 디버깅
console.log('Current order:', JSON.stringify(orderItems, null, 2));

// 성능 모니터링
console.time('menu-loading');
// ... 메뉴 로딩 코드 ...
console.timeEnd('menu-loading');
```

#### 2. React Developer Tools

```bash
# React DevTools 브라우저 확장 설치
# Components 탭에서 컴포넌트 상태 확인
# Profiler 탭에서 성능 분석
```

---

## ⚡ 성능 최적화

### 1. 번들 크기 최적화

```bash
# 번들 분석
npm run build
npx vite-bundle-analyzer dist

# 큰 의존성 찾기
npx webpack-bundle-analyzer dist/assets
```

#### Tree Shaking 최적화

```javascript
// 좋은 예: 필요한 것만 import
import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

// 피할 것: 전체 라이브러리 import
import * as React from 'react';
import * as LucideIcons from 'lucide-react';
```

### 2. 컴포넌트 최적화

#### React.memo 사용

```typescript
// 자주 리렌더링되는 컴포넌트 메모이제이션
const MenuItemCard = React.memo(({ item, onAddToOrder }) => {
  return (
    <div className="menu-card">
      {/* 컴포넌트 내용 */}
    </div>
  );
});

// 복잡한 props 비교가 필요한 경우
const OrderSummary = React.memo(({ items, onUpdateQuantity }) => {
  // 컴포넌트 로직
}, (prevProps, nextProps) => {
  return prevProps.items.length === nextProps.items.length &&
         prevProps.items.every((item, index) => 
           item.id === nextProps.items[index]?.id &&
           item.quantity === nextProps.items[index]?.quantity
         );
});
```

#### useMemo와 useCallback 활용

```typescript
// 비용이 큰 계산 메모이제이션
const totalAmount = useMemo(() => {
  return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}, [orderItems]);

// 함수 참조 안정화
const handleAddToOrder = useCallback((item: MenuItem) => {
  setOrderItems(prev => [...prev, { ...item, quantity: 1 }]);
}, []);

// 필터링된 데이터 메모이제이션
const filteredMenus = useMemo(() => {
  return menuItems.filter(item => 
    item.category === selectedCategory &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [menuItems, selectedCategory, searchQuery]);
```

### 3. 코드 분할 (Code Splitting)

```typescript
// 페이지별 lazy loading
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/history" element={<OrderHistory />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. 이미지 최적화

```typescript
// 이미지 lazy loading
<img 
  src={item.image}
  alt={item.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>

// WebP 형식 지원
<picture>
  <source srcSet={`${item.image}.webp`} type="image/webp" />
  <img src={`${item.image}.jpg`} alt={item.name} />
</picture>
```

### 5. 접근성 성능

```typescript
// 키보드 네비게이션 최적화
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
}, [onClick]);

// 포커스 관리
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isVisible) {
    buttonRef.current?.focus();
  }
}, [isVisible]);
```

---

## 📚 추가 자료

### 학습 리소스

- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [웹 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

### 유용한 도구

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - 성능 및 접근성 분석
- [axe DevTools](https://www.deque.com/axe/devtools/) - 접근성 테스트
- [Can I Use](https://caniuse.com/) - 브라우저 호환성 확인

---

**개발 과정에서 질문이나 도움이 필요하면 언제든 이슈를 등록해주세요!** 👨‍💻✨