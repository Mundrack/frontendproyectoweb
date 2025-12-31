import React from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate para comenzar a gestionar tus auditorías"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
