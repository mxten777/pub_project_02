import React, { useState, useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import VoiceOrderPage from './pages/VoiceOrderPage';
import MenuPage from './pages/MenuPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import OrderCompletePage from './pages/OrderCompletePage';
import AdminPage from './pages/AdminPage';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoadingSpinner from './components/UI/LoadingSpinner';
import type { OrderItem } from './types';

type AppStep = 'welcome' | 'voice-order' | 'menu' | 'confirm' | 'complete' | 'admin';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 시스템 초기화
  useEffect(() => {
    const initializeApp = async () => {
      // 전역 설정 로드
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.highContrast) {
          document.body.classList.add('high-contrast');
        }
      }
      
      // 음성 API 준비 상태 확인
      if ('speechSynthesis' in window) {
        // TTS 준비
        window.speechSynthesis.getVoices();
      }
      
      // 로딩 완료
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    initializeApp();
  }, []);

  const transitionToStep = async (step: AppStep) => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // 페이드 애니메이션
    setCurrentStep(step);
    setIsTransitioning(false);
  };

  const handleStartOrder = () => {
    transitionToStep('voice-order');
  };

  const handleMenuOpen = () => {
    transitionToStep('menu');
  };

  const handleBackFromMenu = () => {
    transitionToStep('welcome');
  };

  const handleOrderComplete = (items: OrderItem[]) => {
    setOrderItems(items);
    transitionToStep('confirm');
  };

  const handlePaymentComplete = () => {
    transitionToStep('complete');
  };

  const handleNewOrder = () => {
    setOrderItems([]);
    transitionToStep('welcome');
  };

  const handleBackToWelcome = () => {
    transitionToStep('welcome');
  };

  const handleBackToVoiceOrder = () => {
    transitionToStep('voice-order');
  };

  // 관리자 모드 접근 (개발용 - 실제 운영시 인증 추가 필요)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey);
      
      // Ctrl+Shift+A로 관리자 접근
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        console.log('Admin mode activated via keyboard!');
        transitionToStep('admin');
        return;
      }
      
      // 또는 Ctrl+Alt+A (대안)
      if (e.ctrlKey && e.altKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        console.log('Admin mode activated via Alt+Ctrl+A!');
        transitionToStep('admin');
        return;
      }
    };

    // 커스텀 이벤트로 관리자 접근 (타이틀 5번 클릭)
    const handleAdminAccess = () => {
      console.log('Admin mode activated via title click!');
      transitionToStep('admin');
    };

    document.addEventListener('keydown', handleKeyPress, true);
    window.addEventListener('adminAccess', handleAdminAccess);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress, true);
      window.removeEventListener('adminAccess', handleAdminAccess);
    };
  }, []);

  // 로딩 스크린
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-8">
            <span className="text-white text-4xl font-bold">바</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">바이브 오더</h1>
          <p className="text-xl text-gray-600 mb-8">시니어 친화형 음성 주문 시스템</p>
          <LoadingSpinner size="large" message="시스템을 준비하고 있습니다..." />
        </div>
      </div>
    );
  }

  // 페이지 전환 로딩
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="다음 페이지로 이동 중..." />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomePage onStartOrder={handleStartOrder} onMenuOpen={handleMenuOpen} />;
      
      case 'voice-order':
        return (
          <VoiceOrderPage 
            onOrderComplete={handleOrderComplete}
            onBack={handleBackToWelcome}
          />
        );

      case 'menu':
        return <MenuPage onBack={handleBackFromMenu} />;
      
      case 'confirm':
        return (
          <OrderConfirmPage 
            orderItems={orderItems}
            onComplete={handlePaymentComplete}
            onBack={handleBackToVoiceOrder}
          />
        );
      
      case 'complete':
        return <OrderCompletePage onNewOrder={handleNewOrder} />;
      
      case 'admin':
        return <AdminPage onBack={handleBackToWelcome} />;
      
      default:
        return <WelcomePage onStartOrder={handleStartOrder} onMenuOpen={handleMenuOpen} />;
    }
  };

  return (
    <LanguageProvider>
      <ToastProvider>
        <div className="fade-in">
          {renderCurrentPage()}
        </div>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
