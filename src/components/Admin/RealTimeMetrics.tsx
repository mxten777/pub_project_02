import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import type { RealTimeMetrics as RealTimeMetricsType } from '../../services/analyticsService';
import LoadingSpinner from '../UI/LoadingSpinner';

interface RealTimeMetricsProps {
  className?: string;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<RealTimeMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
    
    // 10초마다 실시간 데이터 업데이트
    const interval = setInterval(() => {
      loadMetrics();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await analyticsService.getRealTimeMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('실시간 메트릭스 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'offline': return XCircle;
      default: return Activity;
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 80) return 'bg-red-500';
    if (load >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-senior shadow-senior p-6 ${className}`}>
        <LoadingSpinner message="실시간 데이터를 불러오는 중..." />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-senior shadow-senior p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-4" />
          <p>실시간 데이터를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-senior shadow-senior p-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-senior-subtitle font-bold text-gray-800">
          실시간 모니터링
        </h3>
        <div className="flex items-center space-x-2 text-senior-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>마지막 업데이트: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* 메트릭스 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 활성 사용자 */}
        <div className="bg-blue-50 rounded-senior p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-senior-sm text-blue-600 font-medium">활성 사용자</p>
              <p className="text-senior-xl font-bold text-blue-800">{metrics.activeUsers}</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        {/* 진행중인 주문 */}
        <div className="bg-green-50 rounded-senior p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-senior-sm text-green-600 font-medium">진행중인 주문</p>
              <p className="text-senior-xl font-bold text-green-800">{metrics.ordersInProgress}</p>
            </div>
            <ShoppingCart className="text-green-500" size={32} />
          </div>
        </div>

        {/* 음성 인식 상태 */}
        <div className="bg-purple-50 rounded-senior p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-senior-sm text-purple-600 font-medium">음성 인식</p>
              <div className="flex items-center space-x-2">
                <span className={`text-senior-base font-bold ${getStatusColor(metrics.voiceRecognitionStatus)}`}>
                  {metrics.voiceRecognitionStatus === 'online' && '정상'}
                  {metrics.voiceRecognitionStatus === 'degraded' && '저하'}
                  {metrics.voiceRecognitionStatus === 'offline' && '오프라인'}
                </span>
              </div>
            </div>
            <div className={getStatusColor(metrics.voiceRecognitionStatus)}>
              {React.createElement(getStatusIcon(metrics.voiceRecognitionStatus), { size: 32 })}
            </div>
          </div>
        </div>

        {/* 오류율 */}
        <div className="bg-orange-50 rounded-senior p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-senior-sm text-orange-600 font-medium">오류율</p>
              <p className="text-senior-xl font-bold text-orange-800">{(metrics.errorRate * 100).toFixed(2)}%</p>
            </div>
            <AlertTriangle className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* 시스템 부하 표시 */}
      <div className="bg-gray-50 rounded-senior p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-senior-base font-medium text-gray-700">시스템 부하</span>
          <span className="text-senior-sm font-bold text-gray-800">{metrics.systemLoad}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getLoadColor(metrics.systemLoad)}`}
            style={{ width: `${metrics.systemLoad}%` }}
          />
        </div>
        
        <div className="flex justify-between text-senior-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 상태 메시지 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-senior">
        <div className="flex items-center space-x-2">
          <Activity size={16} className="text-gray-500" />
          <span className="text-senior-sm text-gray-600">
            {metrics.systemLoad < 50 && '시스템이 정상적으로 동작하고 있습니다.'}
            {metrics.systemLoad >= 50 && metrics.systemLoad < 80 && '시스템 부하가 보통 수준입니다.'}
            {metrics.systemLoad >= 80 && '시스템 부하가 높습니다. 모니터링이 필요합니다.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;