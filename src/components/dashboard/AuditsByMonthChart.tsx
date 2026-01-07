import React from 'react';
import { Card } from '@/components/common/Card';
import { LineChartWrapper } from '@/components/charts/LineChartWrapper';
import { AuditByMonth } from '@/types/dashboard.types';

interface AuditsByMonthChartProps {
  data: AuditByMonth[];
}

export const AuditsByMonthChart: React.FC<AuditsByMonthChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    month: item.month,
    auditorías: item.count,
    'score promedio': item.average_score,
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendencias de Auditorías
      </h3>
      <LineChartWrapper
        data={chartData}
        xKey="month"
        lines={[
          { dataKey: 'auditorías', stroke: '#6366f1', name: 'Auditorías' },
          { dataKey: 'score promedio', stroke: '#22c55e', name: 'Score Promedio' },
        ]}
        height={300}
      />
    </Card>
  );
};
