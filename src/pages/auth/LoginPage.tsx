import React from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta para gestionar auditorías"
    >
      <LoginForm />
    </AuthLayout>
  );
};
