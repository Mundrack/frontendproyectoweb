import React, { useEffect, useState } from 'react';
import { getScoreColor } from '@/utils/formatters';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore, percentage }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const color = getScoreColor(percentage);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorClasses = {
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      bar: 'from-emerald-500 to-teal-400',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      bar: 'from-amber-400 to-orange-400',
      badge: 'bg-amber-100 text-amber-800'
    },
    danger: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      bar: 'from-rose-500 to-red-400',
      badge: 'bg-rose-100 text-rose-800'
    },
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`p-6 rounded-xl border ${classes.border} ${classes.bg} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold tracking-tight ${classes.text}`}>{score}</span>
            <span className="text-xl text-gray-400 font-medium">/ {maxScore}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${classes.badge}`}>
          {percentage.toFixed(1)}%
        </div>
      </div>

      <div className="relative pt-2">
        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white/50 border border-gray-100 shadow-inner">
          <div
            style={{ width: `${animatedWidth}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out bg-gradient-to-r ${classes.bar}`}
          />
        </div>
      </div>
    </div>
  );
};
