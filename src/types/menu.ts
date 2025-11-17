// 메뉴 시스템 타입 정의

export interface MenuItem {
  id: string;
  name: Record<string, string>; // 다국어 지원 { ko: '김치찌개', en: 'Kimchi Stew' }
  description?: Record<string, string>;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isPopular?: boolean;
  allergens?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  preparationTime?: number; // 분 단위
}

export interface MenuCategory {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  icon?: string;
  color?: string;
  order: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialRequests?: string;
}

export interface MenuFilter {
  category?: string;
  priceRange?: [number, number];
  isPopular?: boolean;
  isAvailable?: boolean;
  searchTerm?: string;
}

export interface MenuContextType {
  // 데이터
  menuItems: MenuItem[];
  categories: MenuCategory[];
  cart: CartItem[];
  
  // 상태
  currentFilter: MenuFilter;
  isLoading: boolean;
  
  // 액션
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // 필터링
  setFilter: (filter: MenuFilter) => void;
  getFilteredItems: () => MenuItem[];
  
  // 유틸리티
  getTotalPrice: () => number;
  getCartItemCount: () => number;
}