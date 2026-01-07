import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RecentAudit } from '@/types/dashboard.types';
import { formatDateShort, getStatusColor, getScoreColor } from '@/utils/formatters';

interface RecentAuditsListProps {
  audits: RecentAudit[];
}

export const RecentAuditsList: React.FC<RecentAuditsListProps> = ({ audits }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Auditorías Recientes
      </h3>
      <div className="space-y-3">
        {audits.map((audit) => {
          const statusColor = getStatusColor(audit.status as any);
          const scoreColor = audit.score_percentage !== null ? getScoreColor(audit.score_percentage) : 'gray';
          const scoreColorClass = scoreColor === 'success' ? 'text-success-600' : scoreColor === 'warning' ? 'text-warning-600' : 'text-danger-600';

          return (
            <div
              key={audit.id}
              onClick={() => navigate(`/audits/${audit.id}/report`)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{audit.title}</h4>
                  <p className="text-sm text-gray-600">{audit.company_name}</p>
                </div>
                <StatusBadge
                  label={audit.status}
                  color={statusColor}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{formatDateShort(audit.created_at)}</span>
                {audit.score_percentage !== null && (
                  <span className={`font-medium ${scoreColorClass}`}>
                    {audit.score_percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
