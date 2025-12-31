import React, { ReactNode } from 'react';
import { Building2 } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3 text-white">
          <Building2 className="h-10 w-10" />
          <span className="text-2xl font-bold">{APP_NAME}</span>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            Gestión Profesional de Auditorías
          </h1>
          <p className="text-primary-100 text-lg">
            Administra auditorías ISO, genera reportes, compara resultados y gestiona equipos
            desde una sola plataforma.
          </p>
        </div>

        <div className="text-primary-200 text-sm">
          © 2024 {APP_NAME}. Todos los derechos reservados.
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>

          {/* Card con formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-gray-600">{subtitle}</p>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
