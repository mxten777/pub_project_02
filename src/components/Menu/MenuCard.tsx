import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMenu } from '../../contexts/MenuContext';
import type { MenuItem } from '../../types/menu';

interface MenuCardProps {
  item: MenuItem;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, className = '' }) => {
  const { language, t } = useLanguage();
  const { addToCart, cart } = useMenu();

  // 장바구니에 있는 수량 확인
  const cartItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (item.isAvailable) {
      addToCart(item);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className={`
      relative group 
      bg-white/90 backdrop-blur-xl 
      rounded-2xl border border-white/30 
      shadow-lg hover:shadow-2xl 
      transition-all duration-300 ease-out
      overflow-hidden
      ${!item.isAvailable ? 'opacity-60 grayscale' : 'hover:scale-[1.02]'}
      ${className}
    `}>
      {/* 상품 이미지 영역 */}
      <div className="relative h-48 bg-gradient-to-br from-lime-100 to-purple-100 overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name[language]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          // 이미지가 없을 때 아이콘 표시
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">🍽️</span>
          </div>
        )}
        
        {/* 인기 상품 배지 */}
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🔥 {t('menu.popular')}
          </div>
        )}

        {/* 품절 오버레이 */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
              {t('menu.soldOut')}
            </div>
          </div>
        )}

        {/* 준비 시간 */}
        {item.preparationTime && item.preparationTime > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
            ⏱️ {item.preparationTime}분
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-5">
        {/* 상품명 */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-lime-600 transition-colors">
          {item.name[language]}
        </h3>

        {/* 설명 */}
        {item.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description[language]}
          </p>
        )}

        {/* 영양 정보 (간단히) */}
        {item.nutritionInfo && (
          <div className="flex items-center space-x-3 mb-4 text-xs text-gray-500 flex-wrap">
            {item.nutritionInfo.calories && (
              <span className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-md">
                <span>🔥</span>
                <span>{item.nutritionInfo.calories}kcal</span>
              </span>
            )}
            {item.nutritionInfo.protein && (
              <span className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-md">
                <span>💪</span>
                <span>{item.nutritionInfo.protein}g</span>
              </span>
            )}
          </div>
        )}

        {/* 가격 */}
        <div className="mb-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-purple-600 bg-clip-text text-transparent">
            ₩{formatPrice(item.price)}
          </div>
        </div>

        {/* 주문 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          className={`
            relative w-full py-3 sm:py-3 rounded-xl font-bold
            transition-all duration-200 flex items-center justify-center space-x-2
            text-sm sm:text-base min-h-[48px] touch-manipulation
            ${item.isAvailable
              ? 'bg-gradient-to-r from-lime-500 to-purple-500 text-white shadow-lg hover:shadow-xl active:scale-95 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <span>🛒</span>
          <span>{item.isAvailable ? t('menu.addToCart') : t('menu.soldOut')}</span>
          
          {/* 장바구니 수량 표시 */}
          {cartQuantity > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
              {cartQuantity}
            </div>
          )}
        </button>
      </div>

      {/* 호버/터치 시 상세 정보 툴팁 - 모바일에서는 숨김 */}
      <div className="
        absolute inset-x-4 -bottom-2 
        bg-white/95 backdrop-blur-xl border border-white/30 
        rounded-xl p-4 shadow-2xl
        opacity-0 group-hover:opacity-100 
        transform translate-y-4 group-hover:translate-y-0
        transition-all duration-300 ease-out
        pointer-events-none
        z-10
        hidden sm:block
      ">
        <div className="space-y-2 text-sm">
          {item.allergens && item.allergens.length > 0 && (
            <div>
              <span className="font-semibold text-red-600">⚠️ 알레르기:</span>
              <span className="ml-2 text-gray-700">{item.allergens.join(', ')}</span>
            </div>
          )}
          
          {item.nutritionInfo && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span>칼로리: {item.nutritionInfo.calories}kcal</span>
              <span>단백질: {item.nutritionInfo.protein}g</span>
              <span>탄수화물: {item.nutritionInfo.carbs}g</span>
              <span>지방: {item.nutritionInfo.fat}g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;