import type { MenuItem, MenuCategory } from '../types/menu';

// 샘플 카테고리 데이터
export const sampleCategories: MenuCategory[] = [
  {
    id: 'soup',
    name: {
      ko: '국물 요리',
      en: 'Soup & Stew',
      zh: '汤类',
      ja: 'スープ・鍋物'
    },
    description: {
      ko: '따뜻하고 푸짐한 국물 요리',
      en: 'Warm and hearty soup dishes',
      zh: '温暖丰盛的汤类菜品',
      ja: '温かくてボリュームたっぷりのスープ料理'
    },
    icon: '🍲',
    color: '#FEF3C7',
    order: 1
  },
  {
    id: 'rice',
    name: {
      ko: '밥류',
      en: 'Rice Dishes',
      zh: '米饭类',
      ja: 'ご飯もの'
    },
    icon: '🍚',
    color: '#F3E8FF',
    order: 2
  },
  {
    id: 'side',
    name: {
      ko: '반찬',
      en: 'Side Dishes',
      zh: '小菜',
      ja: 'おかず'
    },
    icon: '🥬',
    color: '#ECFDF5',
    order: 3
  },
  {
    id: 'beverage',
    name: {
      ko: '음료',
      en: 'Beverages',
      zh: '饮料',
      ja: '飲み物'
    },
    icon: '🥤',
    color: '#EFF6FF',
    order: 4
  }
];

// 샘플 메뉴 아이템 데이터
export const sampleMenuItems: MenuItem[] = [
  // 국물 요리
  {
    id: 'kimchi-stew',
    name: {
      ko: '김치찌개',
      en: 'Kimchi Stew',
      zh: '泡菜汤',
      ja: 'キムチチゲ'
    },
    description: {
      ko: '시원하고 얼큰한 김치찌개',
      en: 'Spicy and refreshing kimchi stew',
      zh: '爽口微辣的泡菜汤',
      ja: 'さっぱりとした辛口キムチチゲ'
    },
    price: 8000,
    category: 'soup',
    isAvailable: true,
    isPopular: true,
    preparationTime: 15,
    nutritionInfo: {
      calories: 320,
      protein: 18,
      carbs: 25,
      fat: 12
    }
  },
  {
    id: 'soybean-paste-stew',
    name: {
      ko: '된장찌개',
      en: 'Soybean Paste Stew',
      zh: '大豆酱汤',
      ja: '味噌チゲ'
    },
    description: {
      ko: '구수한 된장의 깊은 맛',
      en: 'Deep savory flavor of fermented soybean paste',
      zh: '香浓的大豆酱深层味道',
      ja: '香ばしい味噌の深い味わい'
    },
    price: 7500,
    category: 'soup',
    isAvailable: true,
    preparationTime: 12,
    nutritionInfo: {
      calories: 280,
      protein: 15,
      carbs: 22,
      fat: 10
    }
  },
  
  // 밥류
  {
    id: 'bibimbap',
    name: {
      ko: '비빔밥',
      en: 'Bibimbap',
      zh: '拌饭',
      ja: 'ビビンバ'
    },
    description: {
      ko: '영양만점 채소와 고기가 어우러진 비빔밥',
      en: 'Nutritious mixed rice with vegetables and meat',
      zh: '营养丰富的蔬菜肉类拌饭',
      ja: '栄養満点の野菜と肉が調和したビビンバ'
    },
    price: 12000,
    category: 'rice',
    isAvailable: true,
    isPopular: true,
    preparationTime: 10,
    nutritionInfo: {
      calories: 450,
      protein: 22,
      carbs: 55,
      fat: 15
    }
  },
  {
    id: 'fried-rice',
    name: {
      ko: '김치볶음밥',
      en: 'Kimchi Fried Rice',
      zh: '泡菜炒饭',
      ja: 'キムチチャーハン'
    },
    description: {
      ko: '김치의 매콤함이 살아있는 볶음밥',
      en: 'Fried rice with spicy kimchi flavor',
      zh: '带有泡菜辣味的炒饭',
      ja: 'キムチの辛さが生きているチャーハン'
    },
    price: 9000,
    category: 'rice',
    isAvailable: true,
    preparationTime: 8,
    nutritionInfo: {
      calories: 380,
      protein: 16,
      carbs: 48,
      fat: 14
    }
  },
  
  // 반찬
  {
    id: 'pajeon',
    name: {
      ko: '파전',
      en: 'Scallion Pancake',
      zh: '葱煎饼',
      ja: 'ネギチヂミ'
    },
    description: {
      ko: '바삭하고 고소한 파전',
      en: 'Crispy and savory scallion pancake',
      zh: '酥脆香浓的葱煎饼',
      ja: 'サクサクで香ばしいネギチヂミ'
    },
    price: 15000,
    category: 'side',
    isAvailable: true,
    preparationTime: 20,
    nutritionInfo: {
      calories: 520,
      protein: 12,
      carbs: 45,
      fat: 32
    }
  },
  {
    id: 'kimchi',
    name: {
      ko: '김치',
      en: 'Kimchi',
      zh: '泡菜',
      ja: 'キムチ'
    },
    description: {
      ko: '집에서 담근 신선한 김치',
      en: 'Fresh homemade kimchi',
      zh: '家制新鲜泡菜',
      ja: '家で漬けた新鮮なキムチ'
    },
    price: 3000,
    category: 'side',
    isAvailable: false, // 품절 예시
    preparationTime: 0,
    nutritionInfo: {
      calories: 25,
      protein: 2,
      carbs: 5,
      fat: 0
    }
  },
  
  // 음료
  {
    id: 'sikhye',
    name: {
      ko: '식혜',
      en: 'Sweet Rice Punch',
      zh: '甜米露',
      ja: 'シッケ'
    },
    description: {
      ko: '달콤하고 시원한 전통 음료',
      en: 'Sweet and refreshing traditional drink',
      zh: '甘甜清爽的传统饮品',
      ja: '甘くて爽やかな伝統飲料'
    },
    price: 3500,
    category: 'beverage',
    isAvailable: true,
    preparationTime: 2,
    nutritionInfo: {
      calories: 120,
      protein: 1,
      carbs: 28,
      fat: 0
    }
  },
  {
    id: 'cola',
    name: {
      ko: '콜라',
      en: 'Cola',
      zh: '可乐',
      ja: 'コーラ'
    },
    description: {
      ko: '시원한 탄산음료',
      en: 'Refreshing carbonated drink',
      zh: '清爽的碳酸饮料',
      ja: '爽やかな炭酸飲料'
    },
    price: 2000,
    category: 'beverage',
    isAvailable: true,
    preparationTime: 1,
    nutritionInfo: {
      calories: 140,
      protein: 0,
      carbs: 35,
      fat: 0
    }
  }
];