import React from 'react';
import { Play, Eye, Trash2, FileText } from 'lucide-react';
import { Audit } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { formatDateShort, getStatusLabel, getStatusColor } from '@/utils/formatters';

interface AuditCardProps {
  audit: Audit;
  onStart: (audit: Audit) => void;
  onContinue: (audit: Audit) => void;
  onView: (audit: Audit) => void;
  onDelete: (audit: Audit) => void;
}

export const AuditCard: React.FC<AuditCardProps> = ({
  audit,
  onStart,
  onContinue,
  onView,
  onDelete,
}) => {
  const canStart = audit.status === 'draft';
  const canContinue = audit.status === 'in_progress';
  const isCompleted = audit.status === 'completed';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{audit.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{audit.description}</p>
          </div>
          <StatusBadge label={getStatusLabel(audit.status)} color={getStatusColor(audit.status)} />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{audit.template_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{audit.company_name}</span>
            <span className="text-xs">{formatDateShort(audit.created_at)}</span>
          </div>
          {audit.scheduled_date && (
            <div className="text-xs">
              Programada: {formatDateShort(audit.scheduled_date)}
            </div>
          )}
        </div>

        {audit.status === 'in_progress' && audit.score !== undefined && audit.max_score !== undefined && (
          <ProgressBar
            value={audit.score}
            max={audit.max_score}
            size="sm"
            color="primary"
          />
        )}

        {isCompleted && audit.score !== undefined && audit.max_score !== undefined && (
          <div className="p-3 bg-success-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success-700">Puntuación Final</span>
              <span className="text-lg font-bold text-success-700">
                {audit.score} / {audit.max_score}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          {canStart && (
            <>
              <Button size="sm" onClick={() => onStart(audit)}>
                <Play className="h-4 w-4 mr-1" />
                Iniciar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(audit)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {canContinue && (
            <>
              <Button size="sm" onClick={() => onContinue(audit)}>
                Continuar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(audit)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isCompleted && (
            <Button fullWidth size="sm" onClick={() => onView(audit)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Reporte
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
