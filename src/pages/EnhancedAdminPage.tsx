import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SeniorButton from '../components/UI/SeniorButton';
import StatCard from '../components/Admin/StatCard';
import MetricsChart from '../components/Admin/MetricsChart';
import RealTimeMetrics from '../components/Admin/RealTimeMetrics';
import { 
  BarChart3, TrendingUp, DollarSign, 
  ShoppingCart, Star, Activity, Download, RefreshCw
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

import type { DashboardStats } from '../services/analyticsService';

interface AdminPageProps {
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    end: new Date()
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'system' | 'feedback'>('overview');

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getDashboardStats(dateRange);
      setStats(data);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExportData = () => {
    // CSV 내보내기 구현
    console.log('데이터 내보내기 시작...');
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 주문 수"
          value={stats?.totalOrders || 0}
          change={{ value: 12.3, type: 'increase' }}
          icon={ShoppingCart}
          iconColor="text-blue-500"
        />
        <StatCard
          title="총 매출"
          value={stats?.totalRevenue || 0}
          change={{ value: 8.7, type: 'increase' }}
          icon={DollarSign}
          iconColor="text-green-500"
          format="currency"
        />
        <StatCard
          title="평균 주문 금액"
          value={stats?.averageOrderValue || 0}
          change={{ value: 3.2, type: 'increase' }}
          icon={TrendingUp}
          iconColor="text-purple-500"
          format="currency"
        />
        <StatCard
          title="고객 만족도"
          value={stats?.customerSatisfaction || 0}
          change={{ value: 2.1, type: 'increase' }}
          icon={Star}
          iconColor="text-yellow-500"
          format="percentage"
        />
      </div>

      {/* 실시간 모니터링 */}
      <RealTimeMetrics />

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetricsChart
          title="시간대별 주문 현황"
          data={stats?.ordersByHour.map(item => ({
            label: `${item.hour}시`,
            value: item.count
          })) || []}
          colors={{ primary: '#3B82F6' }}
        />
        
        <MetricsChart
          title="일별 매출 추이"
          data={stats?.ordersByDay.slice(-7).map(item => ({
            label: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            value: item.revenue,
            secondary: item.count
          })) || []}
          colors={{ primary: '#10B981', secondary: '#F59E0B' }}
          showLegend
        />
      </div>

      {/* 인기 메뉴 및 최근 주문 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 인기 메뉴 */}
        <div className="bg-white rounded-senior shadow-senior p-6">
          <h3 className="text-senior-subtitle font-bold mb-4">인기 메뉴 TOP 10</h3>
          <div className="space-y-3">
            {stats?.popularMenus.slice(0, 10).map((menu, index) => (
              <div key={menu.id} className="flex items-center space-x-4">
                <span className="text-senior-base font-bold text-gray-500 w-8">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-senior-base font-medium">{menu.name}</span>
                    <div className="text-right">
                      <div className="text-senior-sm text-gray-600">{menu.orderCount}회</div>
                      <div className="text-senior-xs text-green-600">
                        {menu.revenue.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min((menu.orderCount / (stats?.popularMenus[0]?.orderCount || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시스템 성과 */}
        <div className="bg-white rounded-senior shadow-senior p-6">
          <h3 className="text-senior-subtitle font-bold mb-4">시스템 성과</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-senior-base">음성 인식 정확도</span>
                <span className="text-senior-base font-bold text-blue-600">
                  {stats?.systemPerformance.voiceRecognitionAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.systemPerformance.voiceRecognitionAccuracy}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-senior-base">평균 주문 시간</span>
                <span className="text-senior-base font-bold text-green-600">
                  {stats?.systemPerformance.averageOrderTime.toFixed(0)}초
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, 100 - (stats?.systemPerformance.averageOrderTime || 0) / 3)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-senior-base">시스템 가동률</span>
                <span className="text-senior-base font-bold text-purple-600">
                  {stats?.systemPerformance.systemUptime.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.systemPerformance.systemUptime}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title="관리자 대시보드" showBackButton onBackClick={onBack}>
      <div className="space-y-6">
        {/* 헤더 컨트롤 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-senior-title font-bold text-gray-800">관리자 대시보드</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-senior-sm text-gray-500">실시간 연결됨</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              className="border border-gray-200 rounded-senior px-3 py-2 text-senior-sm"
              value={`${Math.floor((Date.now() - dateRange.start.getTime()) / (24 * 60 * 60 * 1000))}`}
              onChange={(e) => {
                const days = parseInt(e.target.value);
                setDateRange({
                  start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                  end: new Date()
                });
              }}
            >
              <option value="7">지난 7일</option>
              <option value="30">지난 30일</option>
              <option value="90">지난 3개월</option>
            </select>
            
            <SeniorButton
              variant="secondary"
              onClick={handleRefresh}
              className="!min-w-0 !px-3"
            >
              <RefreshCw size={20} />
            </SeniorButton>
            
            <SeniorButton
              variant="secondary"
              onClick={handleExportData}
              className="!min-w-0 !px-3"
            >
              <Download size={20} />
            </SeniorButton>
          </div>
        </div>

        {/* 프리미엄 탭 네비게이션 */}
        <div className="px-2 sm:px-4 lg:px-6 mb-6 sm:mb-8">
          <div className="card-premium p-2 sm:p-3">
            <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
              {[
                { key: 'overview', label: '개요', icon: BarChart3, gradient: 'from-primary-500 to-primary-600' },
                { key: 'analytics', label: '분석', icon: TrendingUp, gradient: 'from-secondary-500 to-secondary-600' },
                { key: 'system', label: '시스템', icon: Activity, gradient: 'from-accent-500 to-accent-600' },
                { key: 'feedback', label: '피드백', icon: Star, gradient: 'from-warning-500 to-warning-600' }
              ].map(({ key, label, icon: Icon, gradient }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`
                    group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-premium text-senior-sm sm:text-senior-base font-semibold transition-all duration-300 min-w-[100px] sm:min-w-[140px] justify-center overflow-hidden flex-1 sm:flex-none
                    ${
                      activeTab === key
                        ? `bg-gradient-to-r ${gradient} text-white shadow-premium-lg transform scale-105`
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50 hover:shadow-premium hover:scale-102'
                    }
                  `}
                >
                  {/* 활성 상태 배경 애니메이션 */}
                  {activeTab === key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse-gentle"></div>
                  )}
                  
                  <Icon className={`w-6 h-6 relative z-10 transition-transform duration-300 ${
                    activeTab === key ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="relative z-10">{label}</span>
                  
                  {/* 호버 효과 */}
                  {activeTab !== key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 프리미엄 탭 컨텐츠 */}
        <div className="px-6 pb-8">
          {loading ? (
            <div className="card-premium text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="loading-spinner w-20 h-20 border-4"></div>
                <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-30"></div>
                <div className="absolute inset-2 bg-primary-200 rounded-full animate-pulse-gentle opacity-20"></div>
              </div>
              <h3 className="text-senior-xl font-display font-semibold text-neutral-700 mb-3">
                데이터를 불러오는 중
              </h3>
              <p className="text-senior-base text-neutral-500 max-w-md mx-auto">
                최신 분석 결과를 가져오고 있습니다. 잠시만 기다려주세요...
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'analytics' && (
                <div className="card-premium text-center py-16 hover-lift">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full opacity-10 animate-pulse-gentle"></div>
                    <BarChart3 size={80} className="text-secondary-500 relative z-10" />
                  </div>
                  <h3 className="text-senior-xl font-display font-semibold text-neutral-700 mb-4">
                    고급 분석 대시보드
                  </h3>
                  <p className="text-senior-base text-neutral-500 max-w-lg mx-auto mb-8">
                    매출 트렌드, 고객 행동 분석, 예측 모델링 등 상세한 비즈니스 인사이트를 제공합니다.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-50 text-secondary-700 rounded-premium font-medium">
                    <TrendingUp size={20} />
                    <span>곧 출시 예정</span>
                  </div>
                </div>
              )}
              {activeTab === 'system' && (
                <div className="card-premium text-center py-16 hover-lift">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full opacity-10 animate-pulse-gentle"></div>
                    <Activity size={80} className="text-accent-500 relative z-10" />
                  </div>
                  <h3 className="text-senior-xl font-display font-semibold text-neutral-700 mb-4">
                    시스템 모니터링
                  </h3>
                  <p className="text-senior-base text-neutral-500 max-w-lg mx-auto mb-8">
                    서버 상태, 성능 지표, 오류 로그 등 시스템 전반의 건강 상태를 실시간으로 모니터링합니다.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-50 text-accent-700 rounded-premium font-medium">
                    <Activity size={20} />
                    <span>개발 진행 중</span>
                  </div>
                </div>
              )}
              {activeTab === 'feedback' && (
                <div className="card-premium text-center py-16 hover-lift">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-warning-400 to-warning-600 rounded-full opacity-10 animate-pulse-gentle"></div>
                    <Star size={80} className="text-warning-500 relative z-10" />
                  </div>
                  <h3 className="text-senior-xl font-display font-semibold text-neutral-700 mb-4">
                    고객 피드백 분석
                  </h3>
                  <p className="text-senior-base text-neutral-500 max-w-lg mx-auto mb-8">
                    고객 만족도, 리뷰 분석, 개선 포인트 등을 AI가 자동으로 분석하여 인사이트를 제공합니다.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-warning-50 text-warning-700 rounded-premium font-medium">
                    <Star size={20} />
                    <span>설계 단계</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;