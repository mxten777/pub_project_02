import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  MenuItem, 
  MenuCategory, 
  CartItem, 
  MenuFilter, 
  MenuContextType 
} from '../types/menu';

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState<MenuFilter>({});
  const [isLoading, setIsLoading] = useState(true);

  // 장바구니 관리
  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { menuItem: item, quantity }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 필터링
  const setFilter = (filter: MenuFilter) => {
    setCurrentFilter(filter);
  };

  const getFilteredItems = (): MenuItem[] => {
    let filtered = [...menuItems];

    // 카테고리 필터
    if (currentFilter.category) {
      filtered = filtered.filter(item => item.category === currentFilter.category);
    }

    // 가격 범위 필터
    if (currentFilter.priceRange) {
      const [min, max] = currentFilter.priceRange;
      filtered = filtered.filter(item => item.price >= min && item.price <= max);
    }

    // 인기 상품 필터
    if (currentFilter.isPopular) {
      filtered = filtered.filter(item => item.isPopular);
    }

    // 주문 가능 상품 필터
    if (currentFilter.isAvailable !== undefined) {
      filtered = filtered.filter(item => item.isAvailable === currentFilter.isAvailable);
    }

    // 검색어 필터
    if (currentFilter.searchTerm) {
      const term = currentFilter.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        Object.values(item.name).some(name => 
          name.toLowerCase().includes(term)
        ) ||
        Object.values(item.description || {}).some(desc => 
          desc.toLowerCase().includes(term)
        )
      );
    }

    return filtered;
  };

  // 유틸리티
  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
  };

  const getCartItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // 초기 데이터 로드
  useEffect(() => {
    // 여기서 실제로는 API 호출
    // 지금은 샘플 데이터 로드
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    setIsLoading(true);
    
    // 동적 import로 샘플 데이터 로드
    try {
      const { sampleMenuItems, sampleCategories } = await import('../data/menuData');
      
      // 시뮬레이션된 로딩 시간
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMenuItems(sampleMenuItems);
      setCategories(sampleCategories.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: MenuContextType = {
    // 데이터
    menuItems,
    categories,
    cart,
    
    // 상태
    currentFilter,
    isLoading,
    
    // 액션
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // 필터링
    setFilter,
    getFilteredItems,
    
    // 유틸리티
    getTotalPrice,
    getCartItemCount,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;