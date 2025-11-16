import React from 'react';
import type { OrderItem } from '../../types';
import SeniorButton from '../UI/SeniorButton';
import { Trash2, Edit } from 'lucide-react';

interface OrderSummaryProps {
  items: OrderItem[];
  onItemRemove?: (itemId: string) => void;
  onItemEdit?: (itemId: string) => void;
  showActions?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  onItemRemove,
  onItemEdit,
  showActions = false
}) => {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="card-senior text-center">
        <p className="text-senior-lg text-gray-500">
          주문한 상품이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="card-senior mobile-padding">
      <h2 className="text-senior-lg sm:text-senior-xl lg:text-senior-2xl text-center mb-4 sm:mb-6">
        주문 내역
      </h2>

      {/* 주문 아이템 목록 */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 rounded-senior hover:bg-gray-100 transition-colors duration-200 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-senior-sm sm:text-senior-base font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-senior-xs sm:text-senior-sm text-gray-600">
                {item.price.toLocaleString()}원 × {item.quantity}개
              </p>
            </div>
            
            <div className="flex justify-between sm:block sm:text-right items-center">
              <p className="text-senior-base sm:text-senior-lg font-bold text-blue-600">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
              
              {showActions && (
                <div className="flex space-x-2 sm:mt-2">
                  <SeniorButton
                    variant="secondary"
                    size="small"
                    onClick={() => onItemEdit?.(item.id)}
                    icon={Edit}
                    className="!min-w-[2.5rem] !min-h-[2.5rem] !p-1">
                    <span className="sr-only">수정</span>
                  </SeniorButton>
                  
                  <SeniorButton
                    variant="danger"
                    size="small"
                    onClick={() => onItemRemove?.(item.id)}
                    icon={Trash2}
                    className="!min-w-[2.5rem] !min-h-[2.5rem] !p-1">
                    <span className="sr-only">삭제</span>
                  </SeniorButton>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 총 금액 */}
      <div className="border-t-2 border-gray-200 pt-4 sm:pt-6">
        <div className="flex justify-between items-center">
          <span className="text-senior-base sm:text-senior-xl font-bold text-gray-900">
            총 금액:
          </span>
          <span className="text-senior-lg sm:text-senior-2xl font-bold text-blue-600">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;