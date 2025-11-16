import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SeniorButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'accent' | 'ghost';
  size?: 'small' | 'medium' | 'normal' | 'large' | 'extra-large';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

const SeniorButton: React.FC<SeniorButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'normal',
  icon: Icon,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  pulse = false,
  glow = false
}) => {
  const baseClasses = 'btn-senior focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative overflow-hidden group';
  
  const variantClasses = {
    primary: 'btn-primary focus-visible:ring-primary-200 hover:shadow-glow',
    secondary: 'btn-secondary focus-visible:ring-neutral-200 hover:border-neutral-300', 
    success: 'btn-success focus-visible:ring-secondary-200',
    danger: 'btn-danger focus-visible:ring-danger-200',
    accent: 'btn-accent focus-visible:ring-accent-200',
    ghost: 'bg-transparent border-2 border-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-200 focus-visible:ring-neutral-200'
  };

  const sizeClasses = {
    small: 'min-h-[3rem] sm:min-h-[4rem] min-w-[8rem] sm:min-w-[10rem] text-senior-sm sm:text-senior-base px-4 sm:px-6 py-2 sm:py-3',
    medium: 'min-h-[3.5rem] sm:min-h-[4.5rem] min-w-[9rem] sm:min-w-[11rem] text-senior-base sm:text-senior-lg px-5 sm:px-7 py-3 sm:py-4',
    normal: 'min-h-[4rem] sm:min-h-[5.5rem] min-w-[10rem] sm:min-w-[14rem] text-senior-base sm:text-senior-lg px-6 sm:px-8 py-4 sm:py-5',
    large: 'min-h-[5rem] sm:min-h-[7rem] min-w-[12rem] sm:min-w-[18rem] text-senior-lg sm:text-senior-xl px-8 sm:px-12 py-5 sm:py-8',
    'extra-large': 'min-h-[6rem] sm:min-h-[9rem] min-w-[14rem] sm:min-w-[22rem] text-senior-xl sm:text-senior-2xl px-10 sm:px-16 py-6 sm:py-10'
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 22;
      case 'normal': return 24;
      case 'large': return 28;
      case 'extra-large': return 36;
      default: return 24;
    }
  };

  const finalClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? 'w-full' : ''}
    ${pulse ? 'animate-pulse-gentle' : ''}
    ${glow ? 'shadow-glow hover:shadow-glow-lg' : ''}
    ${className}
  `.trim();

  return (
    <button
      className={finalClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {/* 버튼 내부 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* 버튼 컨텐츠 */}
      <div className="relative flex items-center justify-center gap-3 font-semibold">
        {loading ? (
          <>
            <div className="loading-spinner" />
            <span>{children}</span>
            <span className="sr-only">로딩 중</span>
          </>
        ) : (
          <>
            {Icon && (
              <Icon 
                size={getIconSize()} 
                className="transition-transform duration-200 group-hover:scale-110" 
              />
            )}
            <span className="transition-all duration-200">{children}</span>
          </>
        )}
      </div>
      
      {/* 리플 효과 */}
      <div className="absolute inset-0 -top-full bg-gradient-to-b from-white/30 to-transparent transform skew-x-12 group-hover:top-full transition-all duration-700 ease-out"></div>
    </button>
  );
};

export default SeniorButton;

// 프리미엄 버튼 변형들
export const PrimaryButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="primary" glow />
);

export const SecondaryButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="secondary" />
);

export const SuccessButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="success" />
);

export const DangerButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="danger" />
);

export const AccentButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="accent" />
);

export const GhostButton = (props: Omit<SeniorButtonProps, 'variant'>) => (
  <SeniorButton {...props} variant="ghost" />
);