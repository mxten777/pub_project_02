import React, { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import VoiceStatus from '../components/Voice/VoiceStatus';
import MenuRecommendations from '../components/Menu/MenuRecommendations';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeech } from '../hooks/useSpeech';
import { useLanguage } from '../contexts/LanguageContext';
import { parseVoiceOrder } from '../utils/orderParser';
import { menuService } from '../services/menuService';
import { recommendationService } from '../services/recommendationService';
import type { MenuItem, OrderItem, MenuRecommendation } from '../types';
import { Mic, MicOff, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface VoiceOrderPageProps {
  onOrderComplete: (items: OrderItem[]) => void;
  onBack: () => void;
}

const VoiceOrderPage: React.FC<VoiceOrderPageProps> = ({ 
  onOrderComplete, 
  onBack 
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  const { 
    isListening, 
    result, 
    error, 
    startListening, 
    stopListening, 
    resetResult,
    isSupported 
  } = useVoiceRecognition();
  
  const { speak, isSpeaking } = useSpeech();
  const { t } = useLanguage();

  useEffect(() => {
    loadMenuItems();
    // 페이지 진입 안내
    const welcomeMessage = `${t('order.listening')} ${t('voice.examples')}`;
    speak(welcomeMessage);
  }, [speak, t]);

  useEffect(() => {
    if (result?.isFinal && result.transcript) {
      processVoiceOrder(result.transcript);
    }
  }, [result]);

  const loadMenuItems = async () => {
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
    }
  };

  const processVoiceOrder = async (transcript: string) => {
    setIsProcessing(true);
    
    try {
      await speak('주문을 처리 중입니다.');
      
      const parsedOrder = parseVoiceOrder(transcript);
      
      if (parsedOrder.items.length === 0) {
        await speak('죄송합니다. 메뉴를 다시 말씨해주세요.');
        resetResult();
        setIsProcessing(false);
        return;
      }

      // 메뉴 매칭 시도
      const orderItems: OrderItem[] = [];
      
      parsedOrder.items.forEach(parsedItem => {
        const menuItem = menuItems.find(item => 
          item.name.includes(parsedItem.name) || 
          parsedItem.name.includes(item.name)
        );
        
        if (menuItem && menuItem.available) {
          orderItems.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: parsedItem.quantity,
            category: menuItem.category
          });
        }
      });

      if (orderItems.length === 0) {
        await speak('죄송합니다. 올바른 메뉴명을 말씨해주세요.');
        resetResult();
        setIsProcessing(false);
        return;
      }

      setCurrentOrder(orderItems);
      
      // 주문 내역 음성 안내
      const orderSummary = orderItems
        .map(item => `${item.name} ${item.quantity}개`)
        .join(', ');
      
      await speak(`주문하신 내역입니다. ${orderSummary}. 맞다면 주문 확정 버튼을 눌러주세요.`);
      
    } catch (error) {
      console.error('주문 처리 오류:', error);
      await speak('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartListening = async () => {
    resetResult();
    await speak('지금 말씨해주세요.');
    setTimeout(() => {
      startListening();
    }, 1000);
  };

  const handleStopListening = () => {
    stopListening();
  };

  const handleConfirmOrder = async () => {
    if (currentOrder.length > 0) {
      await speak('주문이 확정되었습니다.');
      onOrderComplete(currentOrder);
    }
  };

  const handleRetry = async () => {
    setCurrentOrder([]);
    resetResult();
    await speak(t('voice.speakClearly'));
  };

  const handleRecommendationSelect = async (recommendation: MenuRecommendation) => {
    try {
      setIsProcessing(true);
      
      // 추천 통계 업데이트
      recommendationService.updateRecommendationStats(recommendation.id, 'order');
      
      // 추천된 메뉴를 주문 목록에 추가
      const orderItems: OrderItem[] = recommendation.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category
      }));
      
      setCurrentOrder(orderItems);
      setShowRecommendations(false);
      
      // 음성 안내
      const itemNames = orderItems.map(item => item.name).join(', ');
      await speak(`${recommendation.title}을 선택하셨습니다. 포함 메뉴: ${itemNames}`);
      
    } catch (error) {
      console.error('추천 메뉴 선택 오류:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSupported) {
    return (
      <MainLayout title="음성 주문" showBackButton onBackClick={onBack}>
        <div className="text-center">
          <div className="card-senior max-w-2xl mx-auto">
            <h2 className="text-senior-subtitle text-danger-600 mb-4">
              음성 인식 지원 안됨
            </h2>
            <p className="text-senior-base text-gray-600 mb-6">
              현재 브라우저에서 음성 인식을 지원하지 않습니다.
              Chrome 브라우저를 사용해주세요.
            </p>
            <SeniorButton variant="primary" onClick={onBack}>
              뒤로 가기
            </SeniorButton>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="음성 주문" showBackButton onBackClick={onBack}>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 음성 상태 */}
        <VoiceStatus />

        {/* 에러 메시지 */}
        {error && (
          <div className="card-senior bg-danger-50 border-danger-200 mx-4 sm:mx-0">
            <p className="text-senior-sm sm:text-senior-base text-danger-600 text-center">
              {error}
            </p>
          </div>
        )}

        {/* 컴트롤 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 px-4 sm:px-0">
          {!isListening ? (
            <SeniorButton 
              variant="primary"
              size="large"
              onClick={handleStartListening}
              icon={Mic}
              disabled={isProcessing || isSpeaking}
              loading={isProcessing}
              className="flex-1 sm:flex-initial max-w-xs shadow-premium-lg hover:shadow-premium-xl font-bold"
            >
              <span className="hidden sm:inline">주문 말하기</span>
              <span className="sm:hidden">주문</span>
            </SeniorButton>
          ) : (
            <SeniorButton 
              variant="danger"
              size="large"
              onClick={handleStopListening}
              icon={MicOff}
              className="flex-1 sm:flex-initial max-w-xs shadow-premium-lg hover:shadow-premium-xl font-bold"
            >
              <span className="hidden sm:inline">음성 중지</span>
              <span className="sm:hidden">중지</span>
            </SeniorButton>
          )}
        </div>

        {/* 메뉴 추천 시스템 */}
        {showRecommendations && currentOrder.length === 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-yellow-500" size={20} />
                <h2 className="text-senior-lg sm:text-senior-subtitle font-bold text-gray-800">
                  {t('menu.recommendation')}
                </h2>
              </div>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-gray-500 hover:text-gray-700 text-senior-xs sm:text-senior-sm px-2 py-1 rounded hover:bg-gray-100"
              >
                숙기기
              </button>
            </div>
            
            <MenuRecommendations
              onSelectRecommendation={handleRecommendationSelect}
              orderHistory={[]} // 실제로는 사용자의 주문 기록을 전달
              userId="current-user"
              className="mb-6"
            />
          </div>
        )}

        {/* 주문 내역 */}
        {currentOrder.length > 0 && (
          <div className="card-senior">
            <h2 className="text-senior-subtitle text-center mb-6">
              {t('order.recognized')} 주문 내역
            </h2>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              {currentOrder.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 rounded-senior space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-senior-sm sm:text-senior-base font-semibold">{item.name}</h3>
                    <p className="text-senior-xs sm:text-senior-sm text-gray-600">
                      {item.price.toLocaleString()}원 × {item.quantity}개
                    </p>
                  </div>
                  <p className="text-senior-base sm:text-senior-lg font-bold text-blue-600 text-right">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-senior-base sm:text-senior-lg font-bold">{t('order.total')}</span>
                <span className="text-senior-xl sm:text-senior-2xl font-bold text-blue-600">
                  {currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}원
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
              <SeniorButton 
                variant="secondary"
                size="large"
                onClick={handleRetry}
                icon={RefreshCw}
                className="w-full sm:w-auto shadow-premium-lg hover:shadow-premium-xl font-bold"
              >
                다시 말하기
              </SeniorButton>
              
              <SeniorButton 
                variant="success"
                size="extra-large"
                onClick={handleConfirmOrder}
                icon={ArrowRight}
                className="w-full sm:w-auto shadow-premium-xl hover:shadow-premium-2xl font-black text-xl"
              >
                {t('order.confirm')}
              </SeniorButton>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VoiceOrderPage;