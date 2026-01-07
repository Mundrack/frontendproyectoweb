import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCcw,
} from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Company } from '@/types/company.types';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { KPICard } from '@/components/dashboard/KPICard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { AuditsByStatusChart } from '@/components/dashboard/AuditsByStatusChart';
import { AuditsByMonthChart } from '@/components/dashboard/AuditsByMonthChart';
import { ScoreDistributionChart } from '@/components/dashboard/ScoreDistributionChart';
import { TopCompaniesTable } from '@/components/dashboard/TopCompaniesTable';
import { RecentAuditsList } from '@/components/dashboard/RecentAuditsList';
import { CategoryPerformanceChart } from '@/components/dashboard/CategoryPerformanceChart';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);

  const {
    stats,
    auditsByStatus,
    auditsByMonth,
    topCompanies,
    recentAudits,
    categoryPerformance,
    filters,
    loading,
    error,
    updateFilters,
    resetFilters,
    refresh,
  } = useDashboard();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companiesApi.getCompanies();
      console.log('Companies data:', data, 'Is array:', Array.isArray(data));
      if (Array.isArray(data)) {
        setCompanies(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        // Handle paginated response
        setCompanies((data as any).results || []);
      } else {
        console.error('Unexpected companies data format:', data);
        setCompanies([]);
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      setCompanies([]);
    }
  };

  const scoreDistribution = stats
    ? [
        { range: '0-20%', count: Math.floor(stats.total_audits * 0.05) },
        { range: '21-40%', count: Math.floor(stats.total_audits * 0.1) },
        { range: '41-60%', count: Math.floor(stats.total_audits * 0.15) },
        { range: '61-80%', count: Math.floor(stats.total_audits * 0.3) },
        { range: '81-100%', count: Math.floor(stats.total_audits * 0.4) },
      ]
    : [];

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Auditorías
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.first_name} {user?.last_name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={refresh} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => navigate('/audits/create')}>
            <FileText className="h-4 w-4 mr-2" />
            Nueva Auditoría
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => {}} />}

      <DashboardFilters
        companies={companies}
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Auditorías"
            value={stats.total_audits}
            icon={FileText}
            iconColor="text-primary-600"
            iconBg="bg-primary-100"
            subtitle={`${stats.completed_audits} completadas`}
          />

          <KPICard
            title="Score Promedio"
            value={`${stats.average_score.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="text-success-600"
            iconBg="bg-success-100"
            subtitle="Todas las auditorías"
          />

          <KPICard
            title="En Progreso"
            value={stats.in_progress_audits}
            icon={Clock}
            iconColor="text-warning-600"
            iconBg="bg-warning-100"
            subtitle={`${stats.draft_audits} borradores`}
          />

          <KPICard
            title="Tasa de Completitud"
            value={`${stats.completion_rate.toFixed(1)}%`}
            icon={CheckCircle}
            iconColor="text-success-600"
            iconBg="bg-success-100"
            subtitle={`${stats.total_companies} empresas`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {auditsByStatus.length > 0 && (
          <AuditsByStatusChart data={auditsByStatus} />
        )}
        {scoreDistribution.length > 0 && (
          <ScoreDistributionChart data={scoreDistribution} />
        )}
      </div>

      {auditsByMonth.length > 0 && (
        <AuditsByMonthChart data={auditsByMonth} />
      )}

      {categoryPerformance.length > 0 && (
        <CategoryPerformanceChart data={categoryPerformance} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topCompanies.length > 0 && (
          <TopCompaniesTable companies={topCompanies} />
        )}
        {recentAudits.length > 0 && (
          <RecentAuditsList audits={recentAudits} />
        )}
      </div>
    </div>
  );
};
