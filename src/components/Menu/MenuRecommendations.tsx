import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Clock, Percent } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import SeniorButton from '../UI/SeniorButton';
import LoadingSpinner from '../UI/LoadingSpinner';
import type { MenuRecommendation, OrderItem } from '../../types';

interface MenuRecommendationsProps {
  onSelectRecommendation: (recommendation: MenuRecommendation) => void;
  orderHistory?: OrderItem[];
  userId?: string;
  className?: string;
}

const MenuRecommendations: React.FC<MenuRecommendationsProps> = ({
  onSelectRecommendation,
  orderHistory = [],
  userId = 'guest',
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState<{
    popular: MenuRecommendation[];
    sets: MenuRecommendation[];
    personalized: MenuRecommendation[];
    timeBased: MenuRecommendation[];
  }>({ popular: [], sets: [], personalized: [], timeBased: [] });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'popular' | 'sets' | 'personalized' | 'time'>('popular');
  const { t, language } = useLanguage();
  const { speak } = useSpeech();

  useEffect(() => {
    loadRecommendations();
  }, [language, orderHistory]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 병렬로 모든 추천 데이터 로드
      const [popular, sets, personalized, timeBased] = await Promise.all([
        recommendationService.getPopularMenus(6),
        Promise.resolve(recommendationService.getSetMenus()),
        recommendationService.getPersonalizedRecommendations(userId, orderHistory, 4),
        Promise.resolve(recommendationService.getTimeBasedRecommendations())
      ]);

      // 언어에 맞게 번역
      setRecommendations({
        popular: popular.map(rec => recommendationService.translateRecommendation(rec, language)),
        sets: sets.map(rec => recommendationService.translateRecommendation(rec, language)),
        personalized: personalized.map(rec => recommendationService.translateRecommendation(rec, language)),
        timeBased: timeBased.map(rec => recommendationService.translateRecommendation(rec, language))
      });
    } catch (error) {
      console.error('추천 메뉴 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation: MenuRecommendation) => {
    // 클릭 통계 업데이트
    recommendationService.updateRecommendationStats(recommendation.id, 'view');
    
    // 음성 안내
    speak(`${recommendation.title}을 선택하셨습니다.`);
    
    // 선택 이벤트 발생
    onSelectRecommendation(recommendation);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    
    // 탭 변경 음성 안내
    const tabNames = {
      popular: t('menu.recommendation') + ' - ' + '인기',
      sets: t('menu.recommendation') + ' - ' + '세트',
      personalized: t('menu.recommendation') + ' - ' + '맞춤',
      time: t('menu.recommendation') + ' - ' + '시간대'
    };
    
    speak(`${tabNames[tab]} 탭으로 이동했습니다.`);
  };

  const getCurrentRecommendations = () => {
    switch (activeTab) {
      case 'popular': return recommendations.popular;
      case 'sets': return recommendations.sets;
      case 'personalized': return recommendations.personalized;
      case 'time': return recommendations.timeBased;
      default: return recommendations.popular;
    }
  };

  const getTabIcon = (tab: typeof activeTab) => {
    const icons = {
      popular: TrendingUp,
      sets: Users,
      personalized: Star,
      time: Clock
    };
    return icons[tab];
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-senior shadow-senior p-4 sm:p-6 ${className}`}>
        <LoadingSpinner message="추천 메뉴를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-senior shadow-senior p-4 sm:p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-senior-subtitle font-bold text-gray-800 mb-2">
          {t('menu.recommendation')}
        </h2>
        <p className="text-sm sm:text-senior-base text-gray-600">
          고객님을 위한 특별한 추천 메뉴입니다
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b border-gray-200 pb-3 sm:pb-4">
        {([
          { key: 'popular', label: '인기 메뉴', count: recommendations.popular.length },
          { key: 'sets', label: '세트 메뉴', count: recommendations.sets.length },
          { key: 'personalized', label: '맞춤 추천', count: recommendations.personalized.length },
          { key: 'time', label: '시간대별', count: recommendations.timeBased.length }
        ] as const).map(({ key, label, count }) => {
          const IconComponent = getTabIcon(key);
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`
                px-4 py-3 rounded-senior font-medium text-senior-base transition-all duration-200 flex items-center space-x-2
                ${activeTab === key 
                  ? 'bg-blue-500 text-white shadow-senior' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <IconComponent size={20} />
              <span>{label}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 추천 메뉴 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {getCurrentRecommendations().map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onClick={() => handleRecommendationClick(recommendation)}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {getCurrentRecommendations().length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star size={32} className="text-gray-400" />
          </div>
          <p className="text-senior-base text-gray-500">
            추천할 메뉴가 없습니다
          </p>
        </div>
      )}
    </div>
  );
};

// 개별 추천 카드 컴포넌트
interface RecommendationCardProps {
  recommendation: MenuRecommendation;
  onClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onClick
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      popular: 'bg-red-500',
      set: 'bg-blue-500', 
      personalized: 'bg-green-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      popular: TrendingUp,
      set: Users,
      personalized: Star
    };
    const IconComponent = icons[type as keyof typeof icons] || Star;
    return <IconComponent size={16} />;
  };

  return (
    <div 
      className="bg-white border-2 border-gray-100 rounded-senior p-4 hover:border-blue-300 hover:shadow-senior transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* 추천 타입 배지 */}
      <div className="flex items-center justify-between mb-3">
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(recommendation.type)}`}>
          {getTypeIcon(recommendation.type)}
          <span>
            {recommendation.type === 'popular' && '인기'}
            {recommendation.type === 'set' && '세트'} 
            {recommendation.type === 'personalized' && '맞춤'}
          </span>
        </div>
        
        {/* 인기도 표시 */}
        <div className="flex items-center space-x-1 text-orange-500">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-medium">{recommendation.popularity}</span>
        </div>
      </div>

      {/* 메뉴 제목 */}
      <h3 className="text-senior-base font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
        {recommendation.title}
      </h3>

      {/* 설명 */}
      <p className="text-senior-sm text-gray-600 mb-4 line-clamp-2">
        {recommendation.description}
      </p>

      {/* 가격 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-senior-base font-bold text-blue-600">
              {recommendation.totalPrice.toLocaleString()}원
            </span>
            {recommendation.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {recommendation.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>
          
          {recommendation.discount && (
            <div className="flex items-center space-x-1 text-red-500">
              <Percent size={12} />
              <span className="text-xs font-medium">
                {recommendation.discount}% 할인
              </span>
            </div>
          )}
        </div>
        
        {/* 선택 버튼 */}
        <SeniorButton
          className="!min-w-0 !px-4 !py-2 group-hover:scale-105 transition-transform"
        >
          선택
        </SeniorButton>
      </div>
    </div>
  );
};

export default MenuRecommendations;