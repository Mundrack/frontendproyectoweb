import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LogOut, User, Home, FileText, ClipboardList, BarChart3, Lightbulb, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME, ROUTES } from '@/utils/constants';
import { Button } from '@/components/common/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { to: ROUTES.COMPANIES, label: 'Empresas', icon: Building2 },
    { to: '/templates', label: 'Plantillas', icon: FileText },
    { to: '/audits', label: 'Auditorías', icon: ClipboardList },
    { to: '/comparisons', label: 'Comparaciones', icon: BarChart3 },
    { to: '/recommendations', label: 'Recomendaciones', icon: Lightbulb },
    { to: '/teams', label: 'Equipos', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {user.first_name} {user.last_name}
                </span>
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  {user.user_type === 'owner' ? 'Owner' : 'Employee'}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
