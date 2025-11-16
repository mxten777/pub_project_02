import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import MenuItemCard from '../components/Menu/MenuItemCard';
import { menuService } from '../services/menuService';
import type { MenuItem } from '../types';
import { Plus, Save } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    available: true
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert('메뉴명과 가격을 입력해주세요.');
      return;
    }

    try {
      await menuService.addMenuItem(newItem);
      setNewItem({ name: '', price: 0, category: '', description: '', available: true });
      setShowAddForm(false);
      loadMenuItems();
    } catch (error) {
      console.error('메뉴 추가 실패:', error);
      alert('멤뉴 추가에 실패했습니다.');
    }
  };

  const handleToggleAvailable = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      await menuService.updateMenuItem(itemId, { available: !item.available });
      loadMenuItems();
    } catch (error) {
      console.error('메뉴 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="관리자 페이지" showBackButton onBackClick={onBack}>
        <div className="text-center">
          <p className="text-senior-lg">로딩 중...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="관리자 페이지" showBackButton onBackClick={onBack}>
      <div className="space-y-8">
        {/* 헤더 액션 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-senior-lg sm:text-senior-subtitle font-semibold">메뉴 관리</h2>
          <SeniorButton 
            variant="primary"
            size="medium"
            onClick={() => setShowAddForm(!showAddForm)}
            icon={Plus}
            className="w-full sm:w-auto"
          >
            메뉴 추가
          </SeniorButton>
        </div>

        {/* 메뉴 추가 폼 */}
        {showAddForm && (
          <div className="card-senior">
            <h3 className="text-senior-lg font-semibold mb-6">새 메뉴 추가</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-senior-sm sm:text-senior-base font-semibold mb-2">
                  메뉴명
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full p-3 sm:p-4 text-senior-sm sm:text-senior-base border-2 border-gray-300 rounded-senior focus:border-primary-500"
                  placeholder="메뉴명 입력"
                />
              </div>
              
              <div>
                <label className="block text-senior-sm sm:text-senior-base font-semibold mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
                  className="w-full p-3 sm:p-4 text-senior-sm sm:text-senior-base border-2 border-gray-300 rounded-senior focus:border-primary-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-senior-sm sm:text-senior-base font-semibold mb-2">
                  카테고리
                </label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full p-3 sm:p-4 text-senior-sm sm:text-senior-base border-2 border-gray-300 rounded-senior focus:border-primary-500"
                  placeholder="예: 찌개, 밥, 고기"
                />
              </div>
              
              <div>
                <label className="block text-senior-sm sm:text-senior-base font-semibold mb-2">
                  설명
                </label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full p-3 sm:p-4 text-senior-sm sm:text-senior-base border-2 border-gray-300 rounded-senior focus:border-primary-500"
                  placeholder="메뉴 설명"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <SeniorButton 
                variant="secondary"
                size="medium"
                onClick={() => setShowAddForm(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                취소
              </SeniorButton>
              
              <SeniorButton 
                variant="success"
                size="medium"
                onClick={handleAddItem}
                icon={Save}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                추가
              </SeniorButton>
            </div>
          </div>
        )}

        {/* 메뉴 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="relative">
              <MenuItemCard item={item} />
              
              <div className="mt-3 sm:mt-4 flex justify-center">
                <SeniorButton
                  variant={item.available ? 'danger' : 'success'}
                  size="medium"
                  onClick={() => handleToggleAvailable(item.id)}
                  className="w-full sm:w-auto"
                >
                  {item.available ? '품절 처리' : '판매 재개'}
                </SeniorButton>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="card-senior text-center">
            <p className="text-senior-lg text-gray-500">
              등록된 메뉴가 없습니다.
            </p>
          </div>
        )}

        {/* 도움말 */}
        <div className="card-senior bg-gray-50">
          <h3 className="text-senior-lg font-semibold mb-4">관리자 도움말</h3>
          <ul className="space-y-2 text-senior-base text-gray-700">
            <li>• 메뉴 추가: 위의 '메뉴 추가' 버튼 사용</li>
            <li>• 품절 처리: 각 메뉴 카드 하단 버튼 사용</li>
            <li>• 음성 인식에서 사용될 메뉴명을 정확히 입력하세요</li>
            <li>• 고객 화면으로 돌아가려면 '뒤로' 버튼을 눌러주세요</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;