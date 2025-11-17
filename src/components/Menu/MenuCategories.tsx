import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMenu } from '../../contexts/MenuContext';
import type { MenuCategory } from '../../types/menu';

interface MenuCategoriesProps {
  className?: string;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { categories, currentFilter, setFilter } = useMenu();

  const handleCategorySelect = (categoryId: string | undefined) => {
    setFilter({ ...currentFilter, category: categoryId });
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-3 p-2 sm:p-4 justify-center">
        {/* 전체 카테고리 */}
        <button
          onClick={() => handleCategorySelect(undefined)}
          className={`
            px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200
            text-sm sm:text-base min-h-[44px] min-w-[80px] touch-manipulation
            ${!currentFilter.category
              ? 'bg-gradient-to-r from-lime-500 to-purple-500 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-lg border border-white/30 text-gray-700 hover:bg-white/90'
            }
          `}
        >
          전체
        </button>

        {/* 카테고리 버튼들 */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`
              px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 
              flex items-center space-x-1 sm:space-x-2
              text-sm sm:text-base min-h-[44px] min-w-[80px] touch-manipulation
              ${currentFilter.category === category.id
                ? 'bg-gradient-to-r from-lime-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/80 backdrop-blur-lg border border-white/30 text-gray-700 hover:bg-white/90'
              }
            `}
            style={{ backgroundColor: currentFilter.category === category.id ? undefined : category.color }}
          >
            {category.icon && <span>{category.icon}</span>}
            <span>{category.name[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;