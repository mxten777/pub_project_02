import React from 'react';
import { Mic, MicOff, Wifi, ShoppingCart } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useVoiceOrder } from '../../hooks/useVoiceOrder';
import { useLanguage } from '../../contexts/LanguageContext';

const VoiceStatus: React.FC = () => {
  const { language } = useLanguage();
  const { 
    isListening, 
    result, 
    error, 
    transcript,
    startListening, 
    stopListening, 
    resetResult,
    isSupported 
  } = useVoiceRecognition();
  
  const { 
    currentOrder, 
    orderTotal, 
    addToOrder, 
    clearOrder,
    confirmOrder 
  } = useVoiceOrder();

  // 음성 인식 결과 처리
  React.useEffect(() => {
    if (result && result.isFinal && result.transcript.trim()) {
      const recognizedItems = addToOrder(result.transcript);
      if (recognizedItems.length > 0) {
        console.log('인식된 메뉴:', recognizedItems);
      }
    }
  }, [result, addToOrder]);

  const handleStartListening = () => {
    resetResult();
    startListening();
  };

  const handleConfirmOrder = () => {
    const orderSummary = confirmOrder();
    if (orderSummary) {
      alert(`주문이 확정되었습니다! 총 금액: ${orderSummary.total.toLocaleString()}원`);
      clearOrder();
    }
  };

  // 언어별 메시지
  const getMessages = () => {
    const messages = {
      ko: {
        listening: '음성을 듣고 있습니다. 메뉴를 말씀해주세요.',
        example: '예: "된장찌개 하나, 공기밥 둘"',
        startOrder: '주문을 시작하려면 아래 버튼을 눌러주세요',
        speakClearly: '큰 소리로 명확하게 말씀해주세요',
        recognized: '인식된 내용:',
        processing: '음성 인식이 완료되면 자동으로 주문이 처리됩니다',
        currentOrder: '현재 주문',
        total: '총 금액',
        confirmOrder: '주문 확정',
        clearOrder: '주문 초기화',
        startVoice: '음성 주문 시작',
        stopVoice: '음성 인식 중지',
        noSupport: '음성 인식이 지원되지 않습니다'
      },
      en: {
        listening: 'Listening for your voice. Please say your menu.',
        example: 'e.g., "One bulgogi, two rice"',
        startOrder: 'Press the button below to start ordering',
        speakClearly: 'Please speak clearly and loudly',
        recognized: 'Recognized:',
        processing: 'Order will be processed automatically when voice recognition is complete',
        currentOrder: 'Current Order',
        total: 'Total',
        confirmOrder: 'Confirm Order',
        clearOrder: 'Clear Order',
        startVoice: 'Start Voice Order',
        stopVoice: 'Stop Voice Recognition',
        noSupport: 'Voice recognition is not supported'
      },
      zh: {
        listening: '正在听取您的声音。请说出菜单。',
        example: '例如："一份烤牛肉，两份米饭"',
        startOrder: '请按下面的按钮开始点餐',
        speakClearly: '请大声清楚地说话',
        recognized: '识别内容：',
        processing: '语音识别完成后将自动处理订单',
        currentOrder: '当前订单',
        total: '总计',
        confirmOrder: '确认订单',
        clearOrder: '清空订单',
        startVoice: '开始语音点餐',
        stopVoice: '停止语音识别',
        noSupport: '不支持语音识别'
      },
      ja: {
        listening: 'あなたの声を聞いています。メニューをお話しください。',
        example: '例：「プルコギ一つ、ご飯二つ」',
        startOrder: '注文を始めるには下のボタンを押してください',
        speakClearly: '大きな声ではっきりとお話しください',
        recognized: '認識内容：',
        processing: '音声認識が完了すると自動的に注文が処理されます',
        currentOrder: '現在の注文',
        total: '合計',
        confirmOrder: '注文確定',
        clearOrder: '注文クリア',
        startVoice: '音声注文開始',
        stopVoice: '音声認識停止',
        noSupport: '音声認識はサポートされていません'
      }
    };
    return messages[language];
  };

  const messages = getMessages();
  return (
    <div className="card-senior mb-4 sm:mb-8 fade-in">
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 mb-4 sm:mb-6">
        {/* 마이크 상태 */}
        <div className="text-center">
          <button
            onClick={isListening ? stopListening : handleStartListening}
            disabled={!isSupported}
            className={`
              flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full transition-all duration-300
              ${isListening 
                ? 'bg-red-500 voice-wave shadow-lg shadow-red-500/50 hover:bg-red-600' 
                : isSupported
                  ? 'bg-lime-500 hover:bg-lime-600 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }
              ${!isSupported ? 'opacity-50' : 'hover:scale-105'}
            `}
          >
            {isListening ? (
              <Mic size={32} className="text-white sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            ) : (
              <MicOff size={32} className="text-white sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            )}
          </button>
          <p className="text-xs sm:text-senior-sm mt-1 sm:mt-2 font-semibold">
            {isListening ? '듣고 있음' : '대기 중'}
          </p>
        </div>

        {/* 주문 상태 */}
        <div className="text-center">
          <div className={`
            flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full transition-all duration-300
            ${currentOrder.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}
          `}>
            <ShoppingCart size={20} className={`${currentOrder.length > 0 ? 'text-white' : 'text-gray-600'} sm:w-6 sm:h-6 lg:w-8 lg:h-8`} />
            {currentOrder.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            )}
          </div>
          <p className="text-xs sm:text-senior-xs mt-1 sm:mt-2 font-semibold">
            {currentOrder.length > 0 ? '주문 있음' : '주문 없음'}
          </p>
        </div>

        {/* 연결 상태 */}
        <div className="text-center">
          <div className={`
            flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full
            ${isSupported ? 'bg-green-500' : 'bg-red-500'}
          `}>
            <Wifi size={20} className="text-white sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </div>
          <p className="text-xs sm:text-senior-xs mt-1 sm:mt-2 font-semibold">
            {isSupported ? '지원됨' : '미지원'}
          </p>
        </div>
      </div>

      {/* 상태 메시지 */}
      <div className="text-center">        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-senior p-3 sm:p-4 slide-up mb-4">
            <p className="text-base sm:text-senior-lg text-red-600 font-semibold">
              {error}
            </p>
          </div>
        )}

        {isListening && (
          <div className="bg-red-50 border border-red-200 rounded-senior p-3 sm:p-4 slide-up">
            <p className="text-base sm:text-senior-lg text-red-600 font-semibold mb-2">
              {messages.listening}
            </p>
            <p className="text-sm sm:text-senior-base text-red-500">
              {messages.example}
            </p>
          </div>
        )}
        
        {!isListening && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-senior p-3 sm:p-4">
            <p className="text-base sm:text-senior-lg text-gray-600 font-semibold">
              {isSupported ? messages.startOrder : messages.noSupport}
            </p>
            <p className="text-sm sm:text-senior-base text-gray-500 mt-2">
              {messages.speakClearly}
            </p>
          </div>
        )}
      </div>

      {/* 인식된 텍스트 */}
      {(result?.transcript || transcript) && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-senior slide-up">
          <div className="flex items-center mb-3">
            <Mic size={20} className="text-blue-600 mr-2 sm:w-6 sm:h-6" />
            <p className="text-sm sm:text-senior-base text-blue-700 font-bold">
              {messages.recognized}
            </p>
          </div>
          <div className="bg-white rounded-senior p-3 sm:p-4 border border-blue-100">
            <p className="text-base sm:text-senior-lg text-gray-900 font-medium leading-relaxed break-words">
              "{result?.transcript || transcript}"
            </p>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs sm:text-senior-sm text-blue-600">
              {messages.processing}
            </p>
          </div>
        </div>
      )}

      {/* 현재 주문 */}
      {currentOrder.length > 0 && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-lime-50 to-green-50 border-2 border-lime-200 rounded-senior slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingCart size={20} className="text-lime-600 mr-2" />
              <h3 className="text-lg font-bold text-lime-700">{messages.currentOrder}</h3>
            </div>
            <button 
              onClick={clearOrder}
              className="text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              {messages.clearOrder}
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {currentOrder.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                <div>
                  <span className="font-semibold">{item.menuItem.name[language]}</span>
                  <span className="text-gray-500 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-bold text-lime-600">
                  {(item.menuItem.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">{messages.total}</span>
            <span className="text-xl font-bold text-lime-600">
              {orderTotal.toLocaleString()}원
            </span>
          </div>
          
          <button 
            onClick={handleConfirmOrder}
            className="btn-primary w-full mt-4"
          >
            {messages.confirmOrder}
          </button>
        </div>
      )}

      {/* 음성 주문 제어 버튼 */}
      <div className="mt-6 flex gap-4 justify-center">
        {!isListening ? (
          <button 
            onClick={handleStartListening}
            disabled={!isSupported}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic size={20} className="mr-2" />
            {messages.startVoice}
          </button>
        ) : (
          <button 
            onClick={stopListening}
            className="btn-secondary"
          >
            <MicOff size={20} className="mr-2" />
            {messages.stopVoice}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceStatus;