import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { Company, CreateCompanyData } from '@/types/company.types';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CreateCompanyData) => Promise<void>;
  onCancel: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setErrors({ general: 'Error al guardar la empresa. Intenta nuevamente.' });
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

      <Input
        label="Nombre de la Empresa"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Ej: ACME Corporation"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Breve descripción de la empresa"
        />
        {errors.description && <p className="mt-1 text-sm text-danger-600">{errors.description}</p>}
      </div>

      <Input
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="Ej: Av. Principal 123, Quito"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="Ej: +593 2 123 4567"
        />

        <Input
          label="Email Corporativo"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Ej: info@empresa.com"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {company ? 'Actualizar' : 'Crear'} Empresa
        </Button>
      </div>
    </form>
  );
};
