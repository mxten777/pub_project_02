import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  secondary?: number;
}

interface MetricsChartProps {
  title: string;
  data: ChartData[];
  height?: number;
  showLegend?: boolean;
  colors?: {
    primary: string;
    secondary?: string;
  };
  className?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  data,
  height = 300,
  showLegend = false,
  colors = { primary: '#3B82F6', secondary: '#10B981' },
  className = ''
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondary || 0)));
  const getBarHeight = (value: number) => (value / maxValue) * (height - 60);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className={`bg-white rounded-senior shadow-senior p-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-senior-subtitle font-bold text-gray-800">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <BarChart3 size={20} className="text-gray-500" />
          <select className="text-senior-sm border border-gray-200 rounded px-2 py-1">
            <option>지난 7일</option>
            <option>지난 30일</option>
            <option>지난 3개월</option>
          </select>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y축 라벨 */}
        <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-senior-xs text-gray-500">
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue(maxValue * 0.75)}</span>
          <span>{formatValue(maxValue * 0.5)}</span>
          <span>{formatValue(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* 차트 컨테이너 */}
        <div className="ml-14 mr-4 h-full flex items-end space-x-2 border-l border-b border-gray-200">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 툴팁 */}
              {hoveredIndex === index && (
                <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-senior-xs px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
                  <div className="text-center">
                    <div className="font-medium">{item.label}</div>
                    <div>{formatValue(item.value)}</div>
                    {item.secondary && (
                      <div className="text-green-300">
                        보조: {formatValue(item.secondary)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 막대 */}
              <div className="w-full flex justify-center space-x-1 mb-2">
                {/* 주요 값 */}
                <div
                  className="transition-all duration-200 rounded-t"
                  style={{
                    width: item.secondary ? '50%' : '80%',
                    height: `${getBarHeight(item.value)}px`,
                    backgroundColor: colors.primary,
                    opacity: hoveredIndex === index ? 0.8 : 1
                  }}
                />
                
                {/* 보조 값 */}
                {item.secondary && (
                  <div
                    className="transition-all duration-200 rounded-t"
                    style={{
                      width: '50%',
                      height: `${getBarHeight(item.secondary)}px`,
                      backgroundColor: colors.secondary,
                      opacity: hoveredIndex === index ? 0.8 : 1
                    }}
                  />
                )}
              </div>
              
              {/* X축 라벨 */}
              <div className="text-senior-xs text-gray-600 text-center transform -rotate-45 origin-top-left mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      {showLegend && (
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-senior-sm text-gray-600">주문 수</span>
          </div>
          {colors.secondary && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors.secondary }}
              />
              <span className="text-senior-sm text-gray-600">매출</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsChart;