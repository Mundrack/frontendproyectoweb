import React from 'react';
import { CategoryScore as CategoryScoreType } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { getScoreColor } from '@/utils/formatters';

interface CategoryScoreProps {
  category: string;
  score: CategoryScoreType;
}

export const CategoryScore: React.FC<CategoryScoreProps> = ({ category, score }) => {
  const color = getScoreColor(score.percentage);

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{score.score}</span>
          <span className="text-lg text-gray-500">/ {score.max_score}</span>
        </div>
        <ProgressBar
          value={score.score}
          max={score.max_score}
          color={color}
          showLabel={false}
        />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{score.question_count} preguntas</span>
          <span className={`font-semibold text-${color}-600`}>
            {score.percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
};
