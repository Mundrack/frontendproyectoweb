import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { Department, CreateDepartmentData, Branch } from '@/types/company.types';

interface DepartmentFormProps {
  department?: Department;
  branches: Branch[];
  onSubmit: (data: CreateDepartmentData) => Promise<void>;
  onCancel: () => void;
  defaultBranchId?: number;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  branches,
  onSubmit,
  onCancel,
  defaultBranchId,
}) => {
  const [formData, setFormData] = useState<CreateDepartmentData>({
    branch: defaultBranchId || 0,
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        branch: department.branch,
        name: department.name,
        description: department.description,
      });
    }
  }, [department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      const backendErrors = err.response?.data;
      if (backendErrors) {
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Error al guardar el departamento. Intenta nuevamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <Alert type="error" message={errors.general} onClose={() => setErrors({ ...errors, general: '' })} />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sucursal <span className="text-danger-500">*</span>
        </label>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          disabled={!!department}
        >
          <option value="">Selecciona una sucursal</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.company_name} - {branch.name}
            </option>
          ))}
        </select>
        {errors.branch && <p className="mt-1 text-sm text-danger-600">{errors.branch}</p>}
      </div>

      <Input
        label="Nombre del Departamento"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Ej: Tecnología"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
          placeholder="Descripción del departamento"
        />
        {errors.description && <p className="mt-1 text-sm text-danger-600">{errors.description}</p>}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {department ? 'Actualizar' : 'Crear'} Departamento
        </Button>
      </div>
    </form>
  );
};
