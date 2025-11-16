import React from 'react';
import { Mic, MicOff, Volume2, Wifi } from 'lucide-react';

interface VoiceStatusProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript?: string;
}

const VoiceStatus: React.FC<VoiceStatusProps> = ({ 
  isListening, 
  isSpeaking, 
  transcript 
}) => {
  return (
    <div className="card-senior mb-4 sm:mb-8 fade-in">
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 mb-4 sm:mb-6">
        {/* 마이크 상태 */}
        <div className="text-center">
          <div className={`
            flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full transition-all duration-300
            ${isListening 
              ? 'bg-red-500 voice-wave shadow-lg shadow-red-500/50' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
          `}>
            {isListening ? (
              <Mic size={32} className="text-white sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            ) : (
              <MicOff size={32} className="text-gray-600 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            )}
          </div>
          <p className="text-xs sm:text-senior-sm mt-1 sm:mt-2 font-semibold">
            {isListening ? '듣고 있음' : '대기 중'}
          </p>
        </div>

        {/* 연결 상태 */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-green-500">
            <Wifi size={20} className="text-white sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </div>
          <p className="text-xs sm:text-senior-xs mt-1 sm:mt-2 text-green-600 font-semibold">
            연결됨
          </p>
        </div>

        {/* 스피커 상태 */}
        <div className="text-center">
          <div className={`
            flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full transition-all duration-300
            ${isSpeaking 
              ? 'bg-blue-500 voice-wave shadow-lg shadow-blue-500/50' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
          `}>
            <Volume2 size={32} className={`${isSpeaking ? 'text-white' : 'text-gray-600'} sm:w-10 sm:h-10 lg:w-12 lg:h-12`} />
          </div>
          <p className="text-xs sm:text-senior-sm mt-1 sm:mt-2 font-semibold">
            {isSpeaking ? '안내 중' : '대기 중'}
          </p>
        </div>
      </div>

      {/* 상태 메시지 */}
      <div className="text-center">
        {isSpeaking && (
          <div className="bg-blue-50 border border-blue-200 rounded-senior p-3 sm:p-4 slide-up">
            <p className="text-base sm:text-senior-lg text-blue-600 font-semibold mb-2">
              현재 안내 중입니다...
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {isListening && (
          <div className="bg-red-50 border border-red-200 rounded-senior p-3 sm:p-4 slide-up">
            <p className="text-base sm:text-senior-lg text-red-600 font-semibold mb-2">
              음성을 듣고 있습니다. 메뉴를 말씨해주세요.
            </p>
            <p className="text-sm sm:text-senior-base text-red-500">
              예: "된장찌개 하나, 공기밥 둘"
            </p>
          </div>
        )}
        
        {!isListening && !isSpeaking && (
          <div className="bg-gray-50 border border-gray-200 rounded-senior p-3 sm:p-4">
            <p className="text-base sm:text-senior-lg text-gray-600 font-semibold">
              주문을 시작하려면 아래 버튼을 눌러주세요
            </p>
            <p className="text-sm sm:text-senior-base text-gray-500 mt-2">
              큰 소리로 명확하게 말씨해주세요
            </p>
          </div>
        )}
      </div>

      {/* 인식된 텍스트 */}
      {transcript && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-senior slide-up">
          <div className="flex items-center mb-3">
            <Mic size={20} className="text-blue-600 mr-2 sm:w-6 sm:h-6" />
            <p className="text-sm sm:text-senior-base text-blue-700 font-bold">
              인식된 내용:
            </p>
          </div>
          <div className="bg-white rounded-senior p-3 sm:p-4 border border-blue-100">
            <p className="text-base sm:text-senior-lg text-gray-900 font-medium leading-relaxed break-words">
              "{transcript}"
            </p>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs sm:text-senior-sm text-blue-600">
              음성 인식이 완료되면 자동으로 주문이 처리됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceStatus;