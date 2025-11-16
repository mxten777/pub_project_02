import React, { useState } from 'react';
import type { MenuItem } from '../../types';
import { Plus, Minus, Star, Clock, Zap } from 'lucide-react';
import SeniorButton from '../UI/SeniorButton';

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  showControls?: boolean;
  recommended?: boolean;
  popular?: boolean;
  onSelect?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  quantity = 0,
  onQuantityChange,
  showControls = false,
  recommended = false,
  popular = false,
  onSelect
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleIncrease = () => {
    onQuantityChange?.(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange?.(quantity - 1);
    }
  };

  const handleCardClick = () => {
    if (item.available && onSelect) {
      onSelect();
    }
  };

  const getBadgeStyle = () => {
    if (recommended) return 'bg-gradient-to-r from-accent-500 to-accent-600 text-white';
    if (popular) return 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white';
    return '';
  };

  const getBadgeIcon = () => {
    if (recommended) return Star;
    if (popular) return Zap;
    return null;
  };

  const getBadgeText = () => {
    if (recommended) return '추천';
    if (popular) return '인기';
    return '';
  };

  const BadgeIcon = getBadgeIcon();

  return (
    <div 
      className={`
        group relative card-premium transition-all duration-500 hover-lift cursor-pointer overflow-hidden
        ${quantity > 0 ? 'ring-4 ring-primary-300 shadow-glow scale-105' : ''}
        ${!item.available ? 'opacity-60 cursor-not-allowed' : ''}
        animate-fade-in
      `}
      onClick={handleCardClick}
    >
      {/* 배지 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-25/50 to-secondary-25/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* 배지 & 인기/추천 마크 */}
      {(recommended || popular) && (
        <div className="absolute top-4 left-4 z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-premium text-sm font-semibold shadow-premium ${getBadgeStyle()}`}>
            {BadgeIcon && <BadgeIcon size={16} />}
            <span>{getBadgeText()}</span>
          </div>
        </div>
      )}
      
      {/* 수량 배지 */}
      {quantity > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-primary-600 text-white text-sm font-bold px-3 py-2 rounded-premium shadow-premium animate-pulse-gentle">
            {quantity}개
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* 프리미엄 메뉴 이미지 */}
        <div className="relative w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-premium-lg mb-4 sm:mb-6 overflow-hidden">
          {item.imageUrl && !imageError ? (
            <>
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-neutral-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
              <div className="text-center text-neutral-500">
                <div className="w-16 h-16 bg-neutral-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🍴</span>
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </div>
          )}
          
          {/* 이미지 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* 프리미엄 메뉴 정보 */}
        <div className="text-center mb-6">
          <h3 className="text-senior-xl font-display font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">
            {item.name}
          </h3>
          
          {item.description && (
            <p className="text-senior-base text-neutral-600 mb-4 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-3">
            <p className="text-senior-xl font-display font-bold text-primary-600">
              {item.price.toLocaleString()}원
            </p>

          </div>
        </div>

        {/* 프리미엄 수량 컨트롤 */}
        {showControls && item.available && (
          <div className="flex items-center justify-center gap-6">
            <SeniorButton 
              variant="secondary"
              size="medium"
              onClick={() => handleDecrease()}
              disabled={quantity === 0}
              icon={Minus}
              className="!min-w-[4.5rem] !min-h-[4.5rem] hover-scale"
            >
              -
            </SeniorButton>
            
            <div className="bg-neutral-50 border-2 border-neutral-200 rounded-premium px-6 py-4 min-w-[5rem]">
              <span className="text-senior-2xl font-display font-bold text-neutral-900 block text-center">
                {quantity}
              </span>
            </div>
            
            <SeniorButton 
              variant="primary"
              size="medium"
              onClick={() => handleIncrease()}
              icon={Plus}
              className="!min-w-[4.5rem] !min-h-[4.5rem] hover-scale glow"
              glow
            >
              +
            </SeniorButton>
          </div>
        )}

        {/* 선택된 수량 표시 */}
        {quantity > 0 && !showControls && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-premium font-semibold shadow-glow">
              <span className="text-senior-base">{quantity}개 선택</span>
            </div>
          </div>
        )}

        {/* 프리미엄 품절 상태 */}
        {!item.available && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-neutral-500 text-white px-6 py-3 rounded-premium font-semibold">
              <Clock size={18} />
              <span className="text-senior-base">품절</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 호버 리플 효과 */}
      <div className="absolute inset-0 -top-full bg-gradient-to-b from-white/30 to-transparent transform skew-x-12 group-hover:top-full transition-all duration-700 ease-out"></div>
    </div>
  );
};

export default MenuItemCard;

// 프리미엄 MenuItemCard 변형들
export const RecommendedMenuItemCard = (props: Omit<MenuItemCardProps, 'recommended'>) => (
  <MenuItemCard {...props} recommended={true} />
);

export const PopularMenuItemCard = (props: Omit<MenuItemCardProps, 'popular'>) => (
  <MenuItemCard {...props} popular={true} />
);