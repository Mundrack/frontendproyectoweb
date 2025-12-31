import React from 'react';
import { Building2, Edit, Trash2, MapPin } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Company } from '@/types/company.types';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onView: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            {company.description && (
              <p className="text-sm text-gray-500">{company.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {company.address && (
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>{company.address}</p>
          </div>
        )}
        {(company.total_branches !== undefined || company.total_departments !== undefined) && (
          <div className="text-sm text-gray-600">
            {company.total_branches !== undefined && (
              <span className="mr-3">Sucursales: {company.total_branches}</span>
            )}
            {company.total_departments !== undefined && (
              <span>Departamentos: {company.total_departments}</span>
            )}
          </div>
        )}
        <div className="text-xs text-gray-500">
          Creada: {new Date(company.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" fullWidth onClick={() => onView(company)}>
          Ver Detalles
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(company)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(company)}>
          <Trash2 className="h-4 w-4 text-danger-600" />
        </Button>
      </div>
    </Card>
  );
};
