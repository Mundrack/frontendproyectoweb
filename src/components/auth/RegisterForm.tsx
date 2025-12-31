import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { ROUTES } from '@/utils/constants';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    user_type: 'owner' as 'owner' | 'employee',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error del campo al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
    } catch (err: any) {
      const backendErrors = err.response?.data;
      if (backendErrors) {
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Error al registrar usuario. Intenta nuevamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <Alert
          type="error"
          message={errors.general}
          onClose={() => setErrors({ ...errors, general: '' })}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
          required
        />

        <Input
          label="Apellido"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
          required
        />
      </div>

      <Input
        label="Correo Electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="usuario@empresa.com"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Usuario <span className="text-danger-500">*</span>
        </label>
        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="owner">Dueño de Empresa</option>
          <option value="employee">Empleado</option>
        </select>
      </div>

      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Mínimo 8 caracteres"
        helperText="Mínimo 8 caracteres"
        required
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        name="password_confirm"
        value={formData.password_confirm}
        onChange={handleChange}
        error={errors.password_confirm}
        placeholder="Repite tu contraseña"
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
      >
        Crear Cuenta
      </Button>

      <div className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </form>
  );
};
