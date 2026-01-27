import React from 'react';
import { MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Branch } from '@/types/company.types';

interface BranchCardProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onViewDetails?: (branch: Branch) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
          <p className="text-sm text-gray-500">{branch.company_name}</p>
          {branch.total_departments !== undefined && (
            <p className="text-xs text-gray-400 mt-1">
              {branch.total_departments} departamento{branch.total_departments !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {branch.address && (
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>{branch.address}</p>
          </div>
        )}
        {branch.phone && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Tel:</span> {branch.phone}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onViewDetails && (
          <Button variant="primary" size="sm" onClick={() => onViewDetails(branch)} fullWidth>
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalles
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onEdit(branch)}>
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(branch)}>
          <Trash2 className="h-4 w-4 text-danger-600 mr-1" />
          Eliminar
        </Button>
      </div>
    </Card>
  );
};
