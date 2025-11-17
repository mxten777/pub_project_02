import React from 'react';
import { useMenu } from '../../contexts/MenuContext';
import MenuCard from './MenuCard';
import LoadingSpinner from '../UI/LoadingSpinner';

interface MenuListProps {
  className?: string;
}

const MenuList: React.FC<MenuListProps> = ({ className = '' }) => {
  const { getFilteredItems, isLoading } = useMenu();

  const filteredItems = getFilteredItems();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          조건에 맞는 메뉴가 없습니다
        </h3>
        <p className="text-gray-500">
          다른 카테고리를 선택하거나 검색어를 바꿔보세요
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-3 sm:p-6">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            className="animate-in slide-in-from-bottom-4 duration-500"
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList;