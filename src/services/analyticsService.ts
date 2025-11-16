

/* eslint-disable @typescript-eslint/no-explicit-any */

type MockData = any;

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularMenus: Array<{
    id: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  ordersByHour: Array<{
    hour: number;
    count: number;
  }>;
  ordersByDay: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  customerSatisfaction: number;
  systemPerformance: {
    voiceRecognitionAccuracy: number;
    averageOrderTime: number;
    systemUptime: number;
  };
}

export interface RealTimeMetrics {
  activeUsers: number;
  ordersInProgress: number;
  voiceRecognitionStatus: 'online' | 'offline' | 'degraded';
  systemLoad: number;
  errorRate: number;
}

class AnalyticsService {
  private mockData: MockData = {
    orders: [],
    menuItems: [],
    performance: { uptime: 0, errorRate: 0 }
  };
  
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // 실제 운영에서는 데이터베이스에서 가져올 데이터
    this.mockData = {
      orders: this.generateMockOrders(),
      menuItems: this.generateMockMenuItems(),
      performance: this.generatePerformanceData()
    };
  }

  private generateMockOrders() {
    const orders = [];
    const menuNames = [
      '김치찌개', '된장찌개', '불고기', '비빔밥', '냉면', 
      '갈비탕', '삼겹살', '치킨', '떡볶이', '라면'
    ];
    
    // 지난 30일 주문 데이터 생성
    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      // 하루당 10-50개 주문
      const dailyOrders = Math.floor(Math.random() * 40) + 10;
      
      for (let order = 0; order < dailyOrders; order++) {
        const hour = Math.floor(Math.random() * 14) + 7; // 7시-21시
        const orderTime = new Date(date);
        orderTime.setHours(hour, Math.floor(Math.random() * 60));
        
        const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3개 메뉴
        const items = [];
        
        for (let i = 0; i < itemCount; i++) {
          const menuName = menuNames[Math.floor(Math.random() * menuNames.length)];
          const price = Math.floor(Math.random() * 15000) + 5000; // 5000-20000원
          const quantity = Math.floor(Math.random() * 3) + 1;
          
          items.push({
            id: `item-${Date.now()}-${i}`,
            name: menuName,
            price,
            quantity,
            category: 'korean'
          });
        }
        
        orders.push({
          id: `order-${Date.now()}-${order}`,
          timestamp: orderTime,
          items,
          customerSatisfaction: Math.floor(Math.random() * 30) + 70, // 70-100점
          orderTime: Math.floor(Math.random() * 180) + 30, // 30-210초
          voiceAccuracy: Math.floor(Math.random() * 20) + 80 // 80-100%
        });
      }
    }
    
    return orders;
  }

  private generateMockMenuItems() {
    return [
      { id: '1', name: '김치찌개', category: 'korean', price: 8000 },
      { id: '2', name: '된장찌개', category: 'korean', price: 7500 },
      { id: '3', name: '불고기', category: 'meat', price: 15000 },
      { id: '4', name: '비빔밥', category: 'rice', price: 9000 },
      { id: '5', name: '냉면', category: 'noodles', price: 10000 },
      { id: '6', name: '갈비탕', category: 'soup', price: 13000 },
      { id: '7', name: '삼겹살', category: 'meat', price: 16000 },
      { id: '8', name: '치킨', category: 'chicken', price: 18000 },
      { id: '9', name: '떡볶이', category: 'snack', price: 6000 },
      { id: '10', name: '라면', category: 'noodles', price: 4000 }
    ];
  }

  private generatePerformanceData() {
    return {
      systemUptime: 99.8,
      voiceRecognitionAccuracy: 94.2,
      averageOrderTime: 125,
      errorRate: 0.03,
      systemLoad: 45
    };
  }

  // 대시보드 통계 조회
  async getDashboardStats(dateRange: { start: Date; end: Date }): Promise<DashboardStats> {
    const { start, end } = dateRange;
    const orders = this.mockData.orders.filter((order: any) => 
      order.timestamp >= start && order.timestamp <= end
    );

    // 총 주문수 및 매출
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: any) =>
      sum + order.items.reduce((itemSum: number, item: any) =>
        itemSum + (item.price * item.quantity), 0
      ), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 인기 메뉴 분석
    const menuStats = new Map();
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const key = `${item.id}-${item.name}`;
        if (!menuStats.has(key)) {
          menuStats.set(key, {
            id: item.id,
            name: item.name,
            orderCount: 0,
            revenue: 0
          });
        }
        const stats = menuStats.get(key);
        stats.orderCount += item.quantity;
        stats.revenue += item.price * item.quantity;
      });
    });

    const popularMenus = Array.from(menuStats.values())
      .sort((a: any, b: any) => b.orderCount - a.orderCount)
      .slice(0, 10);

    // 시간대별 주문 분석
    const hourlyStats = new Map();
    for (let hour = 0; hour < 24; hour++) {
      hourlyStats.set(hour, 0);
    }
    
    orders.forEach((order: any) => {
      const hour = order.timestamp.getHours();
      hourlyStats.set(hour, hourlyStats.get(hour) + 1);
    });

    const ordersByHour = Array.from(hourlyStats.entries())
      .map(([hour, count]) => ({ hour, count }));

    // 일별 주문 분석
    const dailyStats = new Map();
    orders.forEach((order: any) => {
      const dateKey = order.timestamp.toISOString().split('T')[0];
      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, { date: dateKey, count: 0, revenue: 0 });
      }
      const stats = dailyStats.get(dateKey);
      stats.count++;
      stats.revenue += order.items.reduce((sum: number, item: any) => 
        sum + (item.price * item.quantity), 0
      );
    });

    const ordersByDay = Array.from(dailyStats.values())
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 고객 만족도
    const customerSatisfaction = orders.length > 0 
      ? orders.reduce((sum: number, order: any) => sum + order.customerSatisfaction, 0) / orders.length
      : 0;

    // 시스템 성능
    const systemPerformance = {
      voiceRecognitionAccuracy: orders.length > 0
        ? orders.reduce((sum: number, order: any) => sum + order.voiceAccuracy, 0) / orders.length
        : 0,
      averageOrderTime: orders.length > 0
        ? orders.reduce((sum: number, order: any) => sum + order.orderTime, 0) / orders.length
        : 0,
      systemUptime: this.mockData.performance.systemUptime
    };

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      popularMenus,
      ordersByHour,
      ordersByDay,
      customerSatisfaction,
      systemPerformance
    };
  }

  // 실시간 메트릭스
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    // 실시간 데이터 시뮬레이션
    return {
      activeUsers: Math.floor(Math.random() * 20) + 5,
      ordersInProgress: Math.floor(Math.random() * 8) + 2,
      voiceRecognitionStatus: Math.random() > 0.1 ? 'online' : 'degraded',
      systemLoad: Math.floor(Math.random() * 40) + 30,
      errorRate: Math.random() * 0.05
    };
  }

  // 메뉴 성과 분석
  async getMenuPerformance(menuId: string, dateRange: { start: Date; end: Date }) {
    const { start, end } = dateRange;
    const orders = this.mockData.orders.filter((order: any) => 
      order.timestamp >= start && order.timestamp <= end
    );

    const menuOrders = orders.filter((order: any) =>
      order.items.some((item: any) => item.id === menuId)
    );

    const totalQuantity = menuOrders.reduce((sum: number, order: any) => 
      sum + order.items
        .filter((item: any) => item.id === menuId)
        .reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0
    );

    const totalRevenue = menuOrders.reduce((sum: number, order: any) => 
      sum + order.items
        .filter((item: any) => item.id === menuId)
        .reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0), 0
    );

    return {
      orderCount: menuOrders.length,
      totalQuantity,
      totalRevenue,
      averageQuantityPerOrder: menuOrders.length > 0 ? totalQuantity / menuOrders.length : 0,
      conversionRate: orders.length > 0 ? (menuOrders.length / orders.length) * 100 : 0
    };
  }

  // A/B 테스트 결과
  async getABTestResults() {
    return {
      voicePromptTest: {
        variant: 'friendly',
        conversionRate: 87.3,
        improvement: 12.8,
        sampleSize: 1247
      },
      recommendationAlgorithm: {
        variant: 'personalized',
        clickThroughRate: 34.2,
        improvement: 8.9,
        sampleSize: 892
      },
      uiLayout: {
        variant: 'senior-friendly',
        completionRate: 94.1,
        improvement: 15.7,
        sampleSize: 1584
      }
    };
  }

  // 고객 피드백 분석
  async getCustomerFeedback() {
    return {
      overallSatisfaction: 4.3,
      feedbackCount: 284,
      categories: [
        { name: '음성 인식', rating: 4.1, count: 98 },
        { name: '사용 편의성', rating: 4.5, count: 127 },
        { name: '메뉴 추천', rating: 4.2, count: 76 },
        { name: '주문 속도', rating: 4.4, count: 89 }
      ],
      recentFeedback: [
        { date: '2025-11-16', rating: 5, comment: '음성 인식이 정확해서 편리합니다' },
        { date: '2025-11-15', rating: 4, comment: '메뉴 추천이 도움이 됩니다' },
        { date: '2025-11-15', rating: 5, comment: '시니어도 쉽게 사용할 수 있어요' }
      ]
    };
  }

  // 시스템 알림 및 경고
  async getSystemAlerts() {
    const alerts = [];
    const metrics = await this.getRealTimeMetrics();

    if (metrics.systemLoad > 80) {
      alerts.push({
        type: 'warning',
        message: '시스템 부하가 높습니다',
        timestamp: new Date(),
        severity: 'medium'
      });
    }

    if (metrics.voiceRecognitionStatus === 'degraded') {
      alerts.push({
        type: 'error',
        message: '음성 인식 성능이 저하되었습니다',
        timestamp: new Date(),
        severity: 'high'
      });
    }

    if (metrics.errorRate > 0.05) {
      alerts.push({
        type: 'warning',
        message: '오류율이 임계치를 초과했습니다',
        timestamp: new Date(),
        severity: 'medium'
      });
    }

    return alerts;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;