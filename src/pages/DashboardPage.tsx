import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { BarChart3, Building2, FileText, Users } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.first_name}
        </h1>
        <p className="text-gray-600 mt-1">
          Este es tu dashboard principal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Auditorías</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <Building2 className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Empresas</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Equipos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-danger-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Comparaciones</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Próximas Funcionalidades
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Gestión de empresas y sucursales</li>
          <li>• Crear y ejecutar auditorías</li>
          <li>• Comparar resultados de auditorías</li>
          <li>• Dashboard con estadísticas visuales</li>
          <li>• Gestión de equipos y jerarquía</li>
        </ul>
      </Card>
    </div>
  );
};
