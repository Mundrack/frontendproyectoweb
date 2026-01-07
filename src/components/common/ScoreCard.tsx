import React from 'react';
import { getScoreColor } from '@/utils/formatters';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore, percentage }) => {
  const color = getScoreColor(percentage);

  const colorClasses = {
    success: {
      bg: 'bg-success-50',
      text: 'text-success-700',
      border: 'border-success-200',
      ring: 'ring-success-500',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-700',
      border: 'border-warning-200',
      ring: 'ring-warning-500',
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-700',
      border: 'border-danger-200',
      ring: 'ring-danger-500',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`p-6 rounded-lg border-2 ${classes.border} ${classes.bg}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-4xl font-bold ${classes.text}`}>{score}</span>
        <span className="text-xl text-gray-500">/ {maxScore}</span>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${classes.text} ${classes.bg}`}>
            {percentage.toFixed(1)}%
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${classes.ring} ring-2`}
          />
        </div>
      </div>
    </div>
  );
};
