import React from 'react';
import { Card } from '@/components/common/Card';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';
import { CategoryPerformance } from '@/types/dashboard.types';

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
}

export const CategoryPerformanceChart: React.FC<CategoryPerformanceChartProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    categoría: item.category.length > 20 ? item.category.substring(0, 20) + '...' : item.category,
    'score promedio': item.average_score,
    auditorías: item.audits_count,
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rendimiento por Categoría
      </h3>
      <BarChartWrapper
        data={chartData}
        xKey="categoría"
        bars={[
          { dataKey: 'score promedio', fill: '#6366f1', name: 'Score Promedio' },
        ]}
        height={300}
      />
    </Card>
  );
};
