import React, { useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import { useSpeech } from '../hooks/useSpeech';
import { CheckCircle, Home, RotateCcw } from 'lucide-react';

interface OrderCompletePageProps {
  onNewOrder: () => void;
}

const OrderCompletePage: React.FC<OrderCompletePageProps> = ({ onNewOrder }) => {
  const { speak } = useSpeech();

  useEffect(() => {
    // 완료 메시지
    speak('주문이 완료되었습니다. 주방에서 음식을 준비 중이니 잠시만 기다려주세요. 감사합니다.');
  }, [speak]);

  const handleNewOrder = async () => {
    await speak('새 주문을 시작합니다.');
    onNewOrder();
  };

  return (
    <MainLayout title="주문 완료">
      <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12">
        {/* 성공 아이콘 */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-green-500 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <CheckCircle size={60} className="text-white sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-senior-3xl font-bold text-green-600 mb-2 sm:mb-4">
            주문 완료!
          </h1>
          <p className="text-base sm:text-lg lg:text-senior-xl text-gray-600">
            주문이 성공적으로 접수되었습니다
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className="card-senior max-w-2xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-senior p-4 sm:p-6">
              <h2 className="text-lg sm:text-senior-subtitle text-green-700 mb-2 sm:mb-4">
                주문 접수 완료
              </h2>
              <p className="text-sm sm:text-senior-base text-gray-700">
                주방에서 음식을 준비 중입니다.<br/>
                잠시만 기다려주세요.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-senior p-4 sm:p-6">
              <h3 className="text-base sm:text-senior-lg font-semibold text-blue-700 mb-2 sm:mb-3">
                바이브 오더를 이용해주셔서 감사합니다!
              </h3>
              <p className="text-sm sm:text-senior-base text-gray-700">
                음성 주문으로 더욱 편리하게<br/>
                주문하셨던 경험이 어떠셨나요?
              </p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center px-4">
          <SeniorButton 
            variant="primary"
            size="large"
            onClick={handleNewOrder}
            icon={RotateCcw}
            className="shadow-senior-lg hover:scale-105 transform transition-transform w-full sm:w-auto max-w-xs"
          >
            새 주문 하기
          </SeniorButton>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <div className="card-senior text-center">
            <Home size={40} className="text-blue-500 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
            <h3 className="text-base sm:text-senior-lg font-semibold mb-2">
              대기 시간
            </h3>
            <p className="text-sm sm:text-senior-base text-gray-600">
              약 10-15분 예상
            </p>
          </div>
          
          <div className="card-senior text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
            <h3 className="text-base sm:text-senior-lg font-semibold mb-2">
              주문 번호
            </h3>
            <p className="text-sm sm:text-senior-base text-blue-600 font-bold">
              #{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderCompletePage;