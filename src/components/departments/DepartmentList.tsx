import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Department } from '@/types/company.types';

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department) => (
        <Card key={department.id} className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
              <p className="text-sm text-gray-500">{department.branch_name}</p>
              <p className="text-xs text-gray-400">{department.company_name}</p>
            </div>
          </div>

          {department.description && (
            <p className="text-sm text-gray-600 mb-4">{department.description}</p>
          )}

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(department)}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(department)}>
              <Trash2 className="h-4 w-4 text-danger-600 mr-1" />
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
