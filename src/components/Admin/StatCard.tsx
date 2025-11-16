import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
  gradient?: string;
  pulse?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-500',
  format = 'number',
  className = '',
  gradient = 'from-primary-500 to-primary-600',
  pulse = false
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `${val.toLocaleString()}원`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getChangeStyles = (type: 'increase' | 'decrease') => {
    return type === 'increase' 
      ? 'text-secondary-600 bg-secondary-50 border-secondary-200'
      : 'text-danger-600 bg-danger-50 border-danger-200';
  };

  const getChangeIcon = (type: 'increase' | 'decrease') => {
    return type === 'increase' ? TrendingUp : TrendingDown;
  };

  const getIconBackground = () => {
    if (iconColor.includes('primary')) return 'bg-gradient-to-br from-primary-500 to-primary-600';
    if (iconColor.includes('secondary')) return 'bg-gradient-to-br from-secondary-500 to-secondary-600';
    if (iconColor.includes('accent')) return 'bg-gradient-to-br from-accent-500 to-accent-600';
    if (iconColor.includes('warning')) return 'bg-gradient-to-br from-warning-500 to-warning-600';
    return `bg-gradient-to-br ${gradient}`;
  };

  return (
    <div className={`
      card-premium group hover-lift transition-all duration-300 relative overflow-hidden mobile-padding
      ${pulse ? 'animate-pulse-gentle' : ''}
      ${className}
    `}>
      {/* 배경 그라데이션 오버레이 */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-senior-base font-medium text-neutral-600 mb-3">
              {title}
            </p>
            <p className="text-senior-3xl font-display font-bold text-neutral-900 leading-tight">
              {formatValue(value)}
            </p>
          </div>
          
          {/* 프리미엄 아이콘 */}
          <div className={`
            relative p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300
            ${getIconBackground()}
          `}>
            <Icon size={28} className="relative z-10" />
            {/* 아이콘 글로우 효과 */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        {/* 변화량 표시 */}
        {change && (
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-premium border font-semibold text-senior-sm
            ${getChangeStyles(change.type)}
          `}>
            {React.createElement(getChangeIcon(change.type), { size: 16 })}
            <span>{Math.abs(change.value).toFixed(1)}%</span>
            <span className="text-xs opacity-75">전일 대비</span>
          </div>
        )}
      </div>
      
      {/* 호버 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default StatCard;

// 프리미엄 StatCard 변형들
export const PrimaryStatCard = (props: Omit<StatCardProps, 'gradient' | 'iconColor'>) => (
  <StatCard {...props} gradient="from-primary-500 to-primary-600" iconColor="text-white" />
);

export const SecondaryStatCard = (props: Omit<StatCardProps, 'gradient' | 'iconColor'>) => (
  <StatCard {...props} gradient="from-secondary-500 to-secondary-600" iconColor="text-white" />
);

export const AccentStatCard = (props: Omit<StatCardProps, 'gradient' | 'iconColor'>) => (
  <StatCard {...props} gradient="from-accent-500 to-accent-600" iconColor="text-white" />
);

export const WarningStatCard = (props: Omit<StatCardProps, 'gradient' | 'iconColor'>) => (
  <StatCard {...props} gradient="from-warning-500 to-warning-600" iconColor="text-white" />
);