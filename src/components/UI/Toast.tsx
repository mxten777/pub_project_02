import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 완료 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`
      fixed top-6 right-6 z-50 max-w-md w-full
      ${config.bgColor} ${config.textColor}
      rounded-senior shadow-senior-lg p-6
      transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon size={28} />
          <p className="text-senior-base font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default Toast;