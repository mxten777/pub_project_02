import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = '로딩 중...' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-senior-base text-gray-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;