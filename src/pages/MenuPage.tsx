import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuProvider } from '../contexts/MenuContext';
import MainLayout from '../components/Layout/MainLayout';
import MenuCategories from '../components/Menu/MenuCategories';
import MenuList from '../components/Menu/MenuList';

interface MenuPageProps {
  onBack: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <MenuProvider>
      <MainLayout 
        title={t('menu.title')}
        showBackButton={true}
        onBackClick={onBack}
      >
        <div className="min-h-screen">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border-b border-white/30">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {t('menu.title')}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('menu.subtitle')}
              </p>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="bg-white/50 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto">
              <MenuCategories />
            </div>
          </div>

          {/* 메뉴 목록 */}
          <div className="max-w-7xl mx-auto">
            <MenuList />
          </div>
        </div>
      </MainLayout>
    </MenuProvider>
  );
};

export default MenuPage;