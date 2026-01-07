import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartWrapperProps {
  data: any[];
  radars: Array<{
    dataKey: string;
    stroke: string;
    fill: string;
    name: string;
  }>;
  height?: number;
}

export const RadarChartWrapper: React.FC<RadarChartWrapperProps> = ({
  data,
  radars,
  height = 400,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Tooltip />
        <Legend />
        {radars.map((radar) => (
          <Radar
            key={radar.dataKey}
            name={radar.name}
            dataKey={radar.dataKey}
            stroke={radar.stroke}
            fill={radar.fill}
            fillOpacity={0.6}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};
