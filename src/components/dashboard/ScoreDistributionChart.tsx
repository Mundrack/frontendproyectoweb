import React from 'react';
import { Card } from '@/components/common/Card';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';

interface ScoreDistributionChartProps {
  data: Array<{ range: string; count: number }>;
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  data,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribución de Puntuaciones
      </h3>
      <BarChartWrapper
        data={data}
        xKey="range"
        bars={[{ dataKey: 'count', fill: '#6366f1', name: 'Cantidad' }]}
        height={300}
      />
    </Card>
  );
};
