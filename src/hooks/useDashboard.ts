import { useState, useEffect } from 'react';
import { dashboardApi } from '@/api/endpoints/dashboard';
import {
  DashboardStats,
  AuditByStatus,
  AuditByMonth,
  TopCompany,
  RecentAudit,
  CategoryPerformance,
  DashboardFilters,
} from '@/types/dashboard.types';

export const useDashboard = (initialFilters: DashboardFilters = {}) => {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditsByStatus, setAuditsByStatus] = useState<AuditByStatus[]>([]);
  const [auditsByMonth, setAuditsByMonth] = useState<AuditByMonth[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [recentAudits, setRecentAudits] = useState<RecentAudit[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        statsData,
        statusData,
        monthData,
        companiesData,
        auditsData,
        categoryData,
      ] = await Promise.all([
        dashboardApi.getStats(filters),
        dashboardApi.getAuditsByStatus(filters),
        dashboardApi.getAuditsByMonth(filters),
        dashboardApi.getTopCompanies({ ...filters, limit: 5 }),
        dashboardApi.getRecentAudits({ ...filters, limit: 5 }),
        dashboardApi.getCategoryPerformance(filters),
      ]);

      setStats(statsData);
      setAuditsByStatus(statusData);
      setAuditsByMonth(monthData);
      setTopCompanies(companiesData);
      setRecentAudits(auditsData);
      setCategoryPerformance(categoryData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const updateFilters = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const refresh = () => {
    loadData();
  };

  return {
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
  };
};
