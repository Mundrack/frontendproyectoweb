import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartWrapperProps {
  data: any[];
  xKey: string;
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  height?: number;
}

export const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
  data,
  xKey,
  bars,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
