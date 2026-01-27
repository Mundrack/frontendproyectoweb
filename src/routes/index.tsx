import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { CompaniesPage } from '@/pages/companies/CompaniesPage';
import { CompanyDetailPage } from '@/pages/companies/CompanyDetailPage';
import { BranchDetailPage } from '@/pages/branches/BranchDetailPage';
import { BranchesPage } from '@/pages/branches/BranchesPage';
import { DepartmentsPage } from '@/pages/departments/DepartmentsPage';
import { TemplatesPage } from '@/pages/templates/TemplatesPage';
import { TemplateEditorPage } from '@/pages/templates/TemplateEditorPage';
import { AuditsPage } from '@/pages/audits/AuditsPage';
import { CreateAuditPage } from '@/pages/audits/CreateAuditPage';
import { AuditExecutionPage } from '@/pages/audits/AuditExecutionPage';
import { AuditReportPage } from '@/pages/audits/AuditReportPage';
import { ComparisonsPage } from '@/pages/comparisons/ComparisonsPage';
import { CreateComparisonPage } from '@/pages/comparisons/CreateComparisonPage';
import { ComparisonDetailPage } from '@/pages/comparisons/ComparisonDetailPage';
import { RecommendationsPage } from '@/pages/recommendations/RecommendationsPage';
import { TeamsPage } from '@/pages/teams/TeamsPage';
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
        path="/branches/:id"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <BranchDetailPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

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

      {/* Plantillas */}
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <TemplatesPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/templates/:id/editor"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <TemplateEditorPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Auditorías */}
      <Route
        path="/audits"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <AuditsPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audits/create"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <CreateAuditPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audits/:id/execute"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <AuditExecutionPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audits/:id/report"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <AuditReportPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Comparaciones */}
      <Route
        path="/comparisons"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <ComparisonsPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comparisons/create"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <CreateComparisonPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comparisons/:id"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <ComparisonDetailPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Recomendaciones */}
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <RecommendationsPage />
              </main>
            </>
          </ProtectedRoute>
        }
      />

      {/* Equipos */}
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="container-custom py-8">
                <TeamsPage />
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
