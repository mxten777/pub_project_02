import React, { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import OrderSummary from '../components/Order/OrderSummary';
import { useSpeech } from '../hooks/useSpeech';
import { orderService } from '../services/orderService';
import type { OrderItem, Order } from '../types';
import { CheckCircle, CreditCard, Banknote, ArrowLeft } from 'lucide-react';

interface OrderConfirmPageProps {
  orderItems: OrderItem[];
  onComplete: () => void;
  onBack: () => void;
}

type PaymentMethod = 'card' | 'cash';

const OrderConfirmPage: React.FC<OrderConfirmPageProps> = ({ 
  orderItems, 
  onComplete, 
  onBack 
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { speak, isSpeaking } = useSpeech();

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    // 페이지 진입 안내
    const summary = orderItems
      .map(item => `${item.name} ${item.quantity}개`)
      .join(', ');
    
    speak(`주문 내역을 확인해주세요. ${summary}, 총 금액은 ${totalAmount.toLocaleString()}원입니다. 결제 방법을 선택해주세요.`);
  }, [orderItems, totalAmount, speak]);

  const handlePaymentSelect = async (method: PaymentMethod) => {
    setSelectedPayment(method);
    const methodText = method === 'card' ? '카드 결제' : '현금 결제';
    await speak(`${methodText}를 선택하셨습니다.`);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      await speak('결제 방법을 먼저 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    
    try {
      await speak('결제를 처리 중입니다.');

      // 주문 생성
      const order: Omit<Order, 'id' | 'timestamp'> = {
        items: orderItems,
        totalAmount,
        status: 'pending'
      };

      await orderService.createOrder(order);
      
      // 결제 시문레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await speak('결제가 완료되었습니다. 주문이 접수되었습니다. 감사합니다.');
      
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (error) {
      console.error('주문 처리 실패:', error);
      await speak('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout title="주문 확인" showBackButton onBackClick={onBack}>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 주문 요약 */}
        <OrderSummary items={orderItems} />

        {/* 결제 방법 선택 */}
        <div className="card-senior mobile-padding">
          <h2 className="text-senior-lg sm:text-senior-xl lg:text-senior-2xl text-center mb-4 sm:mb-6">
            결제 방법 선택
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <SeniorButton
              variant={selectedPayment === 'card' ? 'primary' : 'secondary'}
              size="normal"
              onClick={() => handlePaymentSelect('card')}
              icon={CreditCard}
              className={`w-full ${selectedPayment === 'card' ? 'ring-4 ring-blue-500' : ''}`}
            >
              카드 결제
            </SeniorButton>
            
            <SeniorButton
              variant={selectedPayment === 'cash' ? 'primary' : 'secondary'}
              size="normal"
              onClick={() => handlePaymentSelect('cash')}
              icon={Banknote}
              className={`w-full ${selectedPayment === 'cash' ? 'ring-4 ring-blue-500' : ''}`}
            >
              현금 결제
            </SeniorButton>
          </div>
        </div>

        {/* 결제 확정 */}
        <div className="flex justify-center space-x-6">
          <SeniorButton
            variant="secondary"
            size="large"
            onClick={onBack}
            icon={ArrowLeft}
            disabled={isProcessing || isSpeaking}
          >
            수정하기
          </SeniorButton>
          
          <SeniorButton
            variant="success"
            size="large"
            onClick={handleConfirmPayment}
            icon={CheckCircle}
            disabled={!selectedPayment || isProcessing || isSpeaking}
            loading={isProcessing}
          >
            결제 하기
          </SeniorButton>
        </div>

        {selectedPayment && (
          <div className="card-senior bg-blue-50 border-blue-200">
            <p className="text-senior-base text-center text-blue-700">
              {selectedPayment === 'card' ? '카드 결제' : '현금 결제'}가 선택되었습니다.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderConfirmPage;