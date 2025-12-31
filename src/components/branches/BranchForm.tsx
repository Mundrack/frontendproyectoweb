import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { Branch, CreateBranchData, Company } from '@/types/company.types';

interface BranchFormProps {
  branch?: Branch;
  companies: Company[];
  onSubmit: (data: CreateBranchData) => Promise<void>;
  onCancel: () => void;
  defaultCompanyId?: number;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  branch,
  companies,
  onSubmit,
  onCancel,
  defaultCompanyId,
}) => {
  const [formData, setFormData] = useState<CreateBranchData>({
    company: defaultCompanyId || 0,
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (branch) {
      setFormData({
        company: branch.company,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
      });
    } else if (!defaultCompanyId) {
      // Reset form when branch is undefined and no default company
      setFormData({
        company: 0,
        name: '',
        address: '',
        phone: '',
      });
    }
  }, [branch, defaultCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // When editing, don't send the company field (it can't be changed)
      let dataToSubmit: any;

      if (branch) {
        // Editing: only send fields that have values
        dataToSubmit = { name: formData.name };
        if (formData.address) dataToSubmit.address = formData.address;
        if (formData.phone) dataToSubmit.phone = formData.phone;
      } else {
        // Creating: send all fields including company
        dataToSubmit = { ...formData };
        // Remove empty optional fields
        if (!formData.address) delete dataToSubmit.address;
        if (!formData.phone) delete dataToSubmit.phone;
      }

      console.log('📤 Datos a enviar:', dataToSubmit);
      await onSubmit(dataToSubmit as CreateBranchData);
    } catch (err: any) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      const backendErrors = err.response?.data;
      if (backendErrors) {
        console.error('❌ Errores del backend:', backendErrors);
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Error al guardar la sucursal. Intenta nuevamente.' });
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
          Empresa <span className="text-danger-500">*</span>
        </label>
        <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          disabled={!!branch}
        >
          <option value="">Selecciona una empresa</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.company && <p className="mt-1 text-sm text-danger-600">{errors.company}</p>}
      </div>

      <Input
        label="Nombre de la Sucursal"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Ej: Quito Norte"
      />

      <Input
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="Ej: Av. Naciones Unidas 123"
      />

      <Input
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="Ej: +593 2 123 4567"
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {branch ? 'Actualizar' : 'Crear'} Sucursal
        </Button>
      </div>
    </form>
  );
};
