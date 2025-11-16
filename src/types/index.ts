export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface MenuRecommendation {
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

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed';
  timestamp: Date;
  customerNote?: string;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface ParsedOrder {
  items: Array<{
    name: string;
    quantity: number;
  }>;
  confidence: number;
}