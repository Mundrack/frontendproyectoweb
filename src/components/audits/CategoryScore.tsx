import React, { useEffect, useState } from 'react';
import { CategoryScore as CategoryScoreType } from '@/types/audit.types';
import { getScoreColor } from '@/utils/formatters';

interface CategoryScoreProps {
  category: string;
  score: CategoryScoreType;
}

export const CategoryScore: React.FC<CategoryScoreProps> = ({ category, score }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const color = getScoreColor(score.percentage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(score.percentage);
    }, 200); // Slightly delayed animation
    return () => clearTimeout(timer);
  }, [score.percentage]);

  const colorClasses = {
    success: {
      bar: 'from-emerald-500 to-teal-400',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    warning: {
      bar: 'from-amber-400 to-orange-400',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    danger: {
      bar: 'from-rose-500 to-red-400',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">{category}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${classes.bg} ${classes.text} border ${classes.border}`}>
          {score.percentage.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{score.score}</span>
            <span className="text-sm text-gray-400 font-medium">/ {score.max_score}</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">{score.question_count} preguntas</span>
        </div>

        <div className="relative">
          <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-gray-100 shadow-inner">
            <div
              style={{ width: `${animatedWidth}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out bg-gradient-to-r ${classes.bar}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
