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
    small: 'h-[4rem] min-w-[10rem] max-w-[12rem] text-senior-base font-bold px-4 py-3',
    medium: 'h-[4rem] min-w-[12rem] max-w-[14rem] text-senior-base font-bold px-4 py-3',
    normal: 'h-[4rem] min-w-[14rem] max-w-[16rem] text-senior-base font-bold px-4 py-3',
    large: 'h-[4rem] min-w-[16rem] max-w-[20rem] text-senior-lg font-bold px-6 py-3',
    'extra-large': 'h-[4rem] min-w-[18rem] max-w-[24rem] text-senior-lg font-black px-6 py-3'
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 22;
      case 'medium': return 24;
      case 'normal': return 26;
      case 'large': return 28;
      case 'extra-large': return 32;
      default: return 26;
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
      
      {/* 버튼 컴텐츠 */}
      <div className="relative flex items-center justify-center font-semibold h-full w-full">
        {loading ? (
          <div className="flex items-center justify-center gap-2 h-full">
            <div className="loading-spinner" />
            <span className="flex items-center">{children}</span>
            <span className="sr-only">로딩 중</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 w-full h-full">
            {Icon && (
              <Icon 
                size={getIconSize()} 
                className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0" 
              />
            )}
            <span className="transition-all duration-200 whitespace-nowrap flex items-center">{children}</span>
          </div>
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