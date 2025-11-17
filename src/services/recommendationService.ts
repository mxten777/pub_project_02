import { menuService } from './menuService';
import type { MenuItem, OrderItem } from '../types';
import type { Language } from '../contexts/LanguageContext';

interface MenuRecommendation {
  id: string;
  type: 'popular' | 'set' | 'personalized';
  title: string;
  description: string;
  items: MenuItem[];
  discount?: number;
  totalPrice: number;
  originalPrice?: number;
  popularity: number;
  category: string;
}

interface UserPreference {
  favoriteCategories: string[];
  frequentItems: string[];
  averageOrderValue: number;
  lastOrderTime: Date;
  dietaryRestrictions: string[];
}

class RecommendationService {
  private userPreferences: Map<string, UserPreference> = new Map();
  private popularityData: Map<string, number> = new Map();
  private setMenus: MenuRecommendation[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // 인기도 데이터 초기화 (실제로는 Analytics에서 가져올 데이터)
    this.popularityData.set('김치찌개', 95);
    this.popularityData.set('된장찌개', 88);
    this.popularityData.set('불고기', 92);
    this.popularityData.set('비빔밥', 85);
    this.popularityData.set('냉면', 78);
    this.popularityData.set('갈비탕', 82);
    this.popularityData.set('삼겹살', 89);
    this.popularityData.set('치킨', 94);
    
    // 세트 메뉴 초기화
    this.initializeSetMenus();
  }

  private initializeSetMenus() {
    this.setMenus = [
      {
        id: 'set-1',
        type: 'set',
        title: '든든한 한식 세트',
        description: '김치찌개 + 공기밥 + 김치 + 미소된장국',
        items: [],
        discount: 15,
        totalPrice: 12000,
        originalPrice: 14000,
        popularity: 92,
        category: 'korean'
      },
      {
        id: 'set-2', 
        type: 'set',
        title: '고기 사랑 세트',
        description: '불고기 + 공기밥 + 갈비탕 + 반찬 3종',
        items: [],
        discount: 20,
        totalPrice: 18000,
        originalPrice: 22500,
        popularity: 88,
        category: 'meat'
      },
      {
        id: 'set-3',
        type: 'set', 
        title: '가벼운 점심 세트',
        description: '비빔밥 + 미소된장국 + 계란찜',
        items: [],
        discount: 10,
        totalPrice: 9000,
        originalPrice: 10000,
        popularity: 76,
        category: 'light'
      },
      {
        id: 'set-4',
        type: 'set',
        title: '시원한 여름 세트', 
        description: '냉면 + 만두 + 오이냉국',
        items: [],
        discount: 12,
        totalPrice: 13200,
        originalPrice: 15000,
        popularity: 81,
        category: 'cold'
      }
    ];
  }

  // 인기 메뉴 추천
  async getPopularMenus(limit = 6): Promise<MenuRecommendation[]> {
    try {
      const allMenus = await menuService.getAllMenuItems();
      
      // 인기도 순으로 정렬
      const popularMenus = allMenus
        .map((menu: MenuItem) => {
          const menuName = typeof menu.name === 'string' ? menu.name : menu.name.ko;
          return {
            ...menu,
            popularity: this.popularityData.get(menuName) || 50
          };
        })
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, limit);

      return popularMenus.map((menu: any) => {
        const menuName = typeof menu.name === 'string' ? menu.name : menu.name.ko;
        return {
          id: `popular-${menu.id}`,
          type: 'popular' as const,
          title: `인기 메뉴: ${menuName}`,
          description: `${menu.popularity}% 고객 만족도`,
          items: [menu],
          totalPrice: menu.price,
          popularity: menu.popularity,
          category: menu.category
        };
      });
    } catch (error) {
      console.error('인기 메뉴 조회 실패:', error);
      return [];
    }
  }

  // 세트 메뉴 추천
  getSetMenus(category?: string): MenuRecommendation[] {
    let sets = [...this.setMenus];
    
    if (category) {
      sets = sets.filter(set => set.category === category);
    }
    
    return sets.sort((a, b) => b.popularity - a.popularity);
  }

  // 개인화된 추천 (사용자 주문 기록 기반)
  async getPersonalizedRecommendations(
    userId: string, 
    orderHistory: OrderItem[],
    limit = 4
  ): Promise<MenuRecommendation[]> {
    try {
      // 사용자 선호도 분석
      const preferences = this.analyzeUserPreferences(orderHistory);
      this.userPreferences.set(userId, preferences);
      
      const allMenus = await menuService.getAllMenuItems();
      const recommendations: MenuRecommendation[] = [];
      
      // 1. 자주 주문한 카테고리 기반 추천
      for (const category of preferences.favoriteCategories.slice(0, 2)) {
        const categoryMenus = allMenus
          .filter((menu: MenuItem) => menu.category === category)
          .filter((menu: MenuItem) => !preferences.frequentItems.includes(menu.id))
          .sort((a: MenuItem, b: MenuItem) => {
            const aName = typeof a.name === 'string' ? a.name : a.name.ko;
            const bName = typeof b.name === 'string' ? b.name : b.name.ko;
            return (this.popularityData.get(bName) || 50) - (this.popularityData.get(aName) || 50);
          })
          .slice(0, 2);
          
        categoryMenus.forEach((menu: MenuItem) => {
          const menuName = typeof menu.name === 'string' ? menu.name : menu.name.ko;
          recommendations.push({
            id: `personalized-${menu.id}`,
            type: 'personalized',
            title: `${category} 추천: ${menuName}`,
            description: '자주 주문하시는 카테고리입니다',
            items: [menu],
            totalPrice: menu.price,
            popularity: this.popularityData.get(menuName) || 50,
            category: menu.category
          });
        });
      }
      
      // 2. 가격대 기반 추천
      const priceRangeMenus = allMenus
        .filter((menu: MenuItem) => {
          const price = menu.price;
          const avgPrice = preferences.averageOrderValue;
          return price >= avgPrice * 0.8 && price <= avgPrice * 1.2;
        })
        .sort((a: MenuItem, b: MenuItem) => {
          const aName = typeof a.name === 'string' ? a.name : a.name.ko;
          const bName = typeof b.name === 'string' ? b.name : b.name.ko;
          return (this.popularityData.get(bName) || 50) - (this.popularityData.get(aName) || 50);
        })
        .slice(0, 1);
        
      priceRangeMenus.forEach((menu: MenuItem) => {
        const menuName = typeof menu.name === 'string' ? menu.name : menu.name.ko;
        recommendations.push({
          id: `price-match-${menu.id}`,
          type: 'personalized',
          title: `가격대 추천: ${menuName}`,
          description: '평소 주문 가격대와 비슷합니다',
          items: [menu],
          totalPrice: menu.price,
          popularity: this.popularityData.get(menuName) || 50,
          category: menu.category
        });
      });
      
      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('개인화 추천 실패:', error);
      return [];
    }
  }

  // 사용자 선호도 분석
  private analyzeUserPreferences(orderHistory: OrderItem[]): UserPreference {
    const categoryCount: Map<string, number> = new Map();
    const itemCount: Map<string, number> = new Map();
    let totalValue = 0;
    let orderCount = 0;
    
    orderHistory.forEach(item => {
      // 카테고리별 횟수
      const currentCategoryCount = categoryCount.get(item.category || 'others') || 0;
      categoryCount.set(item.category || 'others', currentCategoryCount + item.quantity);
      
      // 아이템별 횟수
      const currentItemCount = itemCount.get(item.id) || 0;
      itemCount.set(item.id, currentItemCount + item.quantity);
      
      // 총 주문 금액
      totalValue += item.price * item.quantity;
      orderCount += item.quantity;
    });
    
    // 선호 카테고리 정렬
    const favoriteCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
    
    // 자주 주문한 아이템
    const frequentItems = Array.from(itemCount.entries())
      .filter(([, count]) => count >= 2)
      .map(([itemId]) => itemId);
    
    return {
      favoriteCategories,
      frequentItems,
      averageOrderValue: orderCount > 0 ? totalValue / orderCount : 10000,
      lastOrderTime: new Date(),
      dietaryRestrictions: []
    };
  }

  // 시간대별 추천
  getTimeBasedRecommendations(): MenuRecommendation[] {
    const hour = new Date().getHours();
    const allSets = this.getSetMenus();
    
    if (hour >= 7 && hour < 11) {
      // 아침: 가벼운 메뉴
      return allSets.filter(set => set.category === 'light');
    } else if (hour >= 11 && hour < 15) {
      // 점심: 든든한 메뉴
      return allSets.filter(set => ['korean', 'meat'].includes(set.category));
    } else if (hour >= 15 && hour < 18) {
      // 간식: 가벼운 메뉴
      return allSets.filter(set => set.category === 'light');
    } else {
      // 저녁: 모든 메뉴
      return allSets;
    }
  }

  // 날씨 기반 추천
  getWeatherBasedRecommendations(temperature: number): MenuRecommendation[] {
    const allSets = this.getSetMenus();
    
    if (temperature >= 25) {
      // 더운 날: 시원한 메뉴
      return allSets.filter(set => set.category === 'cold');
    } else if (temperature <= 10) {
      // 추운 날: 따뜻한 메뉴  
      return allSets.filter(set => ['korean', 'meat'].includes(set.category));
    } else {
      // 보통 날씨: 인기 순
      return allSets.sort((a, b) => b.popularity - a.popularity);
    }
  }

  // 추천 클릭/주문 데이터 업데이트
  updateRecommendationStats(recommendationId: string, action: 'view' | 'order') {
    // 실제로는 Analytics 서비스로 전송
    console.log(`추천 통계 업데이트: ${recommendationId} - ${action}`);
  }

  // 다국어 번역된 추천 제목/설명
  translateRecommendation(recommendation: MenuRecommendation, language: Language): MenuRecommendation {
    const translations = {
      ko: {
        'popular': '인기 메뉴',
        'set': '세트 메뉴', 
        'personalized': '맞춤 추천',
        'satisfaction': '% 고객 만족도',
        'frequent_category': '자주 주문하시는 카테고리입니다',
        'price_match': '평소 주문 가격대와 비슷합니다'
      },
      en: {
        'popular': 'Popular Menu',
        'set': 'Set Menu',
        'personalized': 'Recommended for You', 
        'satisfaction': '% Customer Satisfaction',
        'frequent_category': 'From your favorite category',
        'price_match': 'Matches your usual price range'
      },
      zh: {
        'popular': '热门菜单',
        'set': '套餐',
        'personalized': '为您推荐',
        'satisfaction': '% 客户满意度', 
        'frequent_category': '您经常点的菜系',
        'price_match': '符合您的价格范围'
      },
      ja: {
        'popular': '人気メニュー',
        'set': 'セットメニュー',
        'personalized': 'おすすめ',
        'satisfaction': '% 顧客満足度',
        'frequent_category': 'よく注文されるカテゴリ',
        'price_match': '普段の価格帯に近い'
      }
    };
    
    const trans = translations[language];
    if (!trans) return recommendation;
    
    return {
      ...recommendation,
      title: recommendation.title.replace('인기 메뉴', trans.popular)
                                .replace('세트 메뉴', trans.set)
                                .replace('맞춤 추천', trans.personalized),
      description: recommendation.description.replace('% 고객 만족도', trans.satisfaction)
                                           .replace('자주 주문하시는 카테고리입니다', trans.frequent_category)
                                           .replace('평소 주문 가격대와 비슷합니다', trans.price_match)
    };
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
export type { MenuRecommendation, UserPreference };