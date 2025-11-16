// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../config/firebase';
import type { MenuItem } from '../types';

// const MENU_COLLECTION = 'menu-items';

export const menuService = {
  // 모든 메뉴 아이템 가져오기
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      // Firebase 설정이 완료되지 않았으므로 fallback 메뉴 사용
      console.log('Firebase 미설정으로 fallback 메뉴 사용');
      return this.getFallbackMenu();
      
      // Firebase 설정 완료시 아래 코드 활성화
      // const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
      // return querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // })) as MenuItem[];
    } catch (error) {
      console.error('메뉴 아이템을 가져오는데 실패했습니다:', error);
      // Fallback 데이터
      return this.getFallbackMenu();
    }
  },

  // 메뉴 아이템 추가
  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
    try {
      // Firebase 미설정시 로컬 처리 (개발용)
      console.log('메뉴 아이템 추가 (로컬):', item);
      const newId = Date.now().toString();
      // 실제 앱에서는 로컬 상태 업데이트 로직 추가 필요
      return newId;
      
      // Firebase 설정 완료시 아래 코드 활성화
      // const docRef = await addDoc(collection(db, MENU_COLLECTION), item);
      // return docRef.id;
    } catch (error) {
      console.error('메뉴 아이템 추가 실패:', error);
      throw error;
    }
  },

  // 메뉴 아이템 업데이트
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      // Firebase 미설정시 로컬 처리 (개발용)
      console.log('메뉴 아이템 업데이트 (로컬):', id, updates);
      // 실제 앱에서는 로컬 상태 업데이트 로직 추가 필요
      
      // Firebase 설정 완료시 아래 코드 활성화
      // const docRef = doc(db, MENU_COLLECTION, id);
      // await updateDoc(docRef, updates);
    } catch (error) {
      console.error('메뉴 아이템 업데이트 실패:', error);
      throw error;
    }
  },

  // 메뉴 아이템 삭제
  async deleteMenuItem(id: string): Promise<void> {
    try {
      // Firebase 미설정시 로컬 처리 (개발용)
      console.log('메뉴 아이템 삭제 (로컬):', id);
      // 실제 앱에서는 로컬 상태 업데이트 로직 추가 필요
      
      // Firebase 설정 완료시 아래 코드 활성화
      // const docRef = doc(db, MENU_COLLECTION, id);
      // await deleteDoc(docRef);
    } catch (error) {
      console.error('메뉴 아이템 삭제 실패:', error);
      throw error;
    }
  },

  // Firebase 연결 실패시 fallback 메뉴
  getFallbackMenu(): MenuItem[] {
    return [
      {
        id: '1',
        name: '된장찌개',
        price: 8000,
        category: '찌개',
        description: '구수한 된장으로 끓인 찌개',
        available: true
      },
      {
        id: '2', 
        name: '김치찌개',
        price: 8500,
        category: '찌개',
        description: '얼큰한 김치찌개',
        available: true
      },
      {
        id: '3',
        name: '비빔밥',
        price: 9000,
        category: '밥',
        description: '신선한 나물과 고추장이 어우러진 비빔밥',
        available: true
      },
      {
        id: '4',
        name: '불고기',
        price: 12000,
        category: '고기',
        description: '달콤한 양념에 재운 불고기',
        available: true
      },
      {
        id: '5',
        name: '공기밥',
        price: 2000,
        category: '밥',
        description: '따뜻한 공기밥',
        available: true
      },
      {
        id: '6',
        name: '콜라',
        price: 2500,
        category: '음료',
        description: '시원한 콜라',
        available: true
      }
    ];
  }
};