import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { CompaniesPage } from '@/pages/companies/CompaniesPage';
import { CompanyDetailPage } from '@/pages/companies/CompanyDetailPage';
import { BranchesPage } from '@/pages/branches/BranchesPage';
import { DepartmentsPage } from '@/pages/departments/DepartmentsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ROUTES } from '@/utils/constants';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <DashboardPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Empresas */}
      <Route
        path={ROUTES.COMPANIES}
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <CompaniesPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path={`${ROUTES.COMPANIES}/:id`}
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <CompanyDetailPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Sucursales */}
      <Route
        path="/branches"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <BranchesPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Departamentos */}
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <DepartmentsPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Redirect root a dashboard */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
