import React from 'react';
import { Card } from '@/components/common/Card';
import { PieChartWrapper } from '@/components/charts/PieChartWrapper';
import { AuditByStatus } from '@/types/dashboard.types';
import { getStatusLabel } from '@/utils/formatters';

interface AuditsByStatusChartProps {
  data: AuditByStatus[];
}

export const AuditsByStatusChart: React.FC<AuditsByStatusChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: getStatusLabel(item.status as any),
    value: item.count,
  }));

  const colors = ['#94a3b8', '#3b82f6', '#22c55e'];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Auditorías por Estado
      </h3>
      <PieChartWrapper
        data={chartData}
        dataKey="value"
        nameKey="name"
        colors={colors}
        height={300}
      />
    </Card>
  );
};
