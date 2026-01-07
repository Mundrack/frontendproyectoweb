import React from 'react';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { CheckCircle } from 'lucide-react';

interface AuditProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
  progress: number;
}

export const AuditProgress: React.FC<AuditProgressProps> = ({
  totalQuestions,
  answeredQuestions,
  progress,
}) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Progreso</h3>
      </div>

      <div className="space-y-4">
        <ProgressBar value={answeredQuestions} max={totalQuestions} color="primary" />

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{answeredQuestions}</div>
            <div className="text-xs text-gray-600">Respondidas</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalQuestions - answeredQuestions}</div>
            <div className="text-xs text-gray-600">Pendientes</div>
          </div>
        </div>

        {progress === 100 && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700 font-medium text-center">
              ¡Todas las preguntas han sido respondidas!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
