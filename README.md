# 🎤 바이브 오더 (Vibe Order)

**시니어 친화형 음성 주문 키오스크 웹 애플리케이션**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)

## 📖 프로젝트 소개

바이브 오더는 시니어 사용자를 위해 특별히 설계된 **음성 주문 키오스크 시스템**입니다. 복잡한 터치 조작 대신 **자연스러운 음성 명령**으로 주문할 수 있으며, **대형 폰트**, **간단한 인터페이스**, **접근성 기능**을 통해 누구나 쉽게 사용할 수 있습니다.

### ✨ 핵심 특징

- 🎙️ **음성 인식 주문**: Web Speech API를 활용한 실시간 음성 주문
- 👥 **시니어 친화적 UI**: 큰 글씨, 명확한 버튼, 직관적인 네비게이션
- 📱 **완전 반응형**: 데스크탑, 태블릿, 모바일 모든 디바이스 지원
- ♿ **접근성 최우선**: 시각/청각 장애인을 위한 다양한 접근성 기능
- 🎨 **프리미엄 UI/UX**: 가독성을 우선한 세련된 디자인 시스템
- 🌐 **다국어 지원**: 한국어/영어 인터페이스 전환
- 📊 **관리자 대시보드**: 실시간 통계 및 분석 기능

## 🚀 빠른 시작

### 필수 조건

- Node.js 18.0 이상
- npm 또는 yarn
- 최신 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd vibe-order

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 `http://localhost:5173`에서 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── UI/             # 재사용 가능한 UI 컴포넌트
│   ├── Layout/         # 레이아웃 컴포넌트
│   ├── Menu/           # 메뉴 관련 컴포넌트
│   ├── Voice/          # 음성 기능 컴포넌트
│   ├── Order/          # 주문 관련 컴포넌트
│   └── Admin/          # 관리자 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 React Hooks
├── contexts/           # React Context 제공자
├── services/           # 비즈니스 로직 및 API 서비스
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
└── assets/             # 정적 자원
```

## 🎯 주요 기능

### 🎤 음성 주문 시스템
- **실시간 음성 인식**: "된장찌개 하나, 공기밥 둘" 형태의 자연어 주문
- **음성 피드백**: 주문 내용을 음성으로 확인
- **오류 처리**: 인식 실패 시 재시도 옵션

### 🖥️ 사용자 인터페이스
- **시니어 최적화**: 24px 이상 큰 글씨, 44px 이상 터치 영역
- **프리미엄 디자인**: 부드러운 그라데이션, 세련된 색상 팔레트
- **다크 모드**: 눈의 피로를 줄이는 다크 테마

### ♿ 접근성 기능
- **텍스트 크기 조절**: 5단계 글씨 크기 설정
- **음성 속도 조절**: 음성 안내 속도 커스터마이징
- **키보드 네비게이션**: 마우스 없이도 완전한 조작 가능
- **스크린 리더 지원**: ARIA 레이블 및 의미적 HTML

### 📱 모바일 최적화
- **터치 친화적**: 모든 인터랙션 요소 44px 이상
- **반응형 그리드**: 화면 크기별 최적화된 레이아웃
- **스와이프 제스처**: 모바일 네이티브 경험

### 📊 관리자 기능
- **실시간 대시보드**: 주문 현황, 매출 통계
- **메뉴 관리**: 메뉴 추가/수정/삭제
- **고객 만족도**: 음성 인식 정확도 및 주문 시간 분석

## 🛠️ 기술 스택

### 프론트엔드
- **React 19.2**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성 및 개발 생산성
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Vite**: 빠른 개발 환경 및 빌드 도구

### 음성 기술
- **Web Speech API**: 브라우저 네이티브 음성 인식/합성
- **SpeechRecognition**: 실시간 음성 텍스트 변환
- **SpeechSynthesis**: 텍스트 음성 변환

### 상태 관리
- **React Context**: 전역 상태 관리
- **Local Storage**: 사용자 설정 영속화
- **React Hooks**: 컴포넌트 상태 및 생명주기 관리

### 디자인 시스템
- **Lucide React**: 아이콘 라이브러리
- **Inter/Pretendard**: 웹 폰트
- **커스텀 Tailwind**: 확장된 색상 팔레트 및 유틸리티

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* Primary Colors */
--color-primary-50: #eff6ff
--color-primary-500: #3b82f6
--color-primary-900: #1e3a8a

/* Secondary Colors */
--color-secondary-50: #f0f9ff
--color-secondary-500: #06b6d4
--color-secondary-900: #164e63

/* Neutral Colors */
--color-gray-50: #f9fafb
--color-gray-500: #6b7280
--color-gray-900: #111827
```

### 타이포그래피
```css
/* Senior-friendly font sizes */
--text-senior-xs: 16px
--text-senior-sm: 18px
--text-senior-base: 20px
--text-senior-lg: 24px
--text-senior-xl: 28px
--text-senior-2xl: 32px
--text-senior-3xl: 40px
```

### 간격 시스템
```css
/* Touch-friendly spacing */
--spacing-touch-sm: 44px
--spacing-touch-md: 56px
--spacing-touch-lg: 72px
```

## 🔧 개발 가이드

### 개발 환경 설정

1. **Node.js 설치**: [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. **IDE 설정**: VS Code + React/TypeScript 확장 프로그램 권장
3. **브라우저**: Chrome 또는 Firefox 개발자 도구 활용

### 코드 스타일

프로젝트는 다음 코딩 컨벤션을 따릅니다:

- **ESLint**: 코드 품질 및 일관성 유지
- **TypeScript**: 엄격한 타입 체크 활성화
- **Prettier**: 코드 포맷팅 자동화 (권장)

### 컴포넌트 개발 가이드

```typescript
// 컴포넌트 예제
interface ComponentProps {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onClick, 
  variant = 'primary',
  size = 'medium' 
}) => {
  return (
    <button 
      className={`btn-senior btn-${variant} btn-${size}`}
      onClick={onClick}
      aria-label={title}
    >
      {title}
    </button>
  );
};
```

### 테스트 가이드

```bash
# 개발 서버에서 수동 테스트
npm run dev

# 프로덕션 빌드 테스트
npm run build && npm run preview

# 타입 체크
npx tsc --noEmit

# 린트 체크
npm run lint
```

## 📱 브라우저 지원

| 브라우저 | 버전 | 음성 인식 | 음성 합성 | 모바일 |
|---------|------|----------|----------|--------|
| Chrome | 60+ | ✅ | ✅ | ✅ |
| Firefox | 55+ | ✅ | ✅ | ✅ |
| Safari | 14+ | ✅ | ✅ | ✅ |
| Edge | 79+ | ✅ | ✅ | ✅ |

## 🚀 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify

```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 드래그 앤 드롭
```

### 기타 플랫폼

빌드된 `dist` 폴더를 정적 호스팅 서비스에 업로드하면 됩니다.

## 🤝 기여하기

1. 이 저장소를 Fork합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

### 기여 가이드라인

- 코드는 TypeScript로 작성해주세요
- ESLint 규칙을 준수해주세요
- 시니어 친화적 UX를 고려해주세요
- 접근성 가이드라인을 따라주세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 개발팀

- **기획 및 개발**: AI Assistant
- **UX/UI 디자인**: 시니어 친화적 디자인 전문
- **접근성 컨설팅**: 웹 접근성 전문가

## 📞 지원

- **이슈 리포트**: [GitHub Issues](../../issues)
- **기능 요청**: [GitHub Discussions](../../discussions)
- **문서 개선**: [Wiki](../../wiki)

## 🗺️ 로드맵

### v1.1 (계획 중)
- [ ] AI 기반 메뉴 추천
- [ ] 다국어 음성 인식 (영어, 중국어, 일본어)
- [ ] 오프라인 모드 지원

### v1.2 (계획 중)
- [ ] PWA (Progressive Web App) 변환
- [ ] 결제 시스템 연동
- [ ] 실시간 알림 시스템

---

**바이브 오더**로 더 나은 시니어 친화적 디지털 경험을 만들어보세요! 🎤✨
