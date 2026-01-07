import React from 'react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { RotateCcw } from 'lucide-react';
import { Company } from '@/types/company.types';
import { DashboardFilters as Filters } from '@/types/dashboard.types';

interface DashboardFiltersProps {
  companies: Company[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  companies,
  filters,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof Filters, value: any) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <select
            value={filters.company_id || ''}
            onChange={(e) =>
              handleChange('company_id', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas las empresas</option>
            {Array.isArray(companies) && companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Fecha Inicio"
          type="date"
          value={filters.start_date || ''}
          onChange={(e) => handleChange('start_date', e.target.value || undefined)}
        />

        <Input
          label="Fecha Fin"
          type="date"
          value={filters.end_date || ''}
          onChange={(e) => handleChange('end_date', e.target.value || undefined)}
        />
      </div>
    </Card>
  );
};
