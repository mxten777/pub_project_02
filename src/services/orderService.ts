import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  // 주문 생성
  async createOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<string> {
    try {
      const newOrder: Order = {
        ...order,
        id: uuidv4(),
        timestamp: new Date()
      };
      
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
      return docRef.id;
    } catch (error) {
      console.error('주문 생성 실패:', error);
      // Fallback - 로컬 저장소에 임시 저장
      const orderId = uuidv4();
      const orders = this.getLocalOrders();
      orders.push({
        ...order,
        id: orderId,
        timestamp: new Date()
      });
      localStorage.setItem('fallback-orders', JSON.stringify(orders));
      return orderId;
    }
  },

  // 최근 주문 가져오기
  async getRecentOrders(limitCount: number = 10): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Order[];
    } catch (error) {
      console.error('주문 조회 실패:', error);
      return this.getLocalOrders().slice(-limitCount);
    }
  },

  // 로컬 저장소에서 주문 가져오기 (fallback)
  getLocalOrders(): Order[] {
    try {
      const orders = localStorage.getItem('fallback-orders');
      return orders ? JSON.parse(orders) : [];
    } catch {
      return [];
    }
  },

  // 주문 상태 업데이트
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      // Firebase 업데이트 로직 (실제 구현시)
      console.log(`주문 ${orderId} 상태를 ${status}로 업데이트`);
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error);
    }
  }
};

// 주문 총액 계산 유틸리티
export const calculateOrderTotal = (order: Pick<Order, 'items'>): number => {
  return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// 주문 요약 생성 유틸리티
export const generateOrderSummary = (order: Order): string => {
  const itemSummary = order.items
    .map(item => `${item.name} ${item.quantity}개`)
    .join(', ');
  
  return `${itemSummary} - 총 ${order.totalAmount.toLocaleString()}원`;
};