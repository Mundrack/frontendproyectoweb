import api from '../axios.config';
import {
  DashboardStats,
  AuditByStatus,
  AuditByMonth,
  TopCompany,
  RecentAudit,
  CategoryPerformance,
  DashboardFilters,
} from '@/types/dashboard.types';

export const dashboardApi = {
  // Usar /api/dashboard/overview/ en lugar de /stats/
  getStats: async (filters?: DashboardFilters): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/dashboard/overview/', { params: filters });
    return response.data;
  },

  // Backend usa /trends/ para datos por mes
  getAuditsByStatus: async (filters?: DashboardFilters): Promise<AuditByStatus[]> => {
    const response = await api.get<AuditByStatus[]>('/api/dashboard/score-distribution/', { params: filters });
    return response.data;
  },

  // Backend usa /trends/ para auditorías por mes
  getAuditsByMonth: async (filters?: DashboardFilters): Promise<AuditByMonth[]> => {
    const response = await api.get<AuditByMonth[]>('/api/dashboard/trends/', { params: filters });
    return response.data;
  },

  // Backend usa /company-stats/ para estadísticas de empresas
  getTopCompanies: async (filters?: DashboardFilters & { limit?: number }): Promise<TopCompany[]> => {
    const response = await api.get<TopCompany[]>('/api/dashboard/company-stats/', { params: filters });
    return response.data;
  },

  getRecentAudits: async (filters?: DashboardFilters & { limit?: number }): Promise<RecentAudit[]> => {
    const response = await api.get<RecentAudit[]>('/api/dashboard/recent-audits/', { params: filters });
    return response.data;
  },

  getCategoryPerformance: async (filters?: DashboardFilters): Promise<CategoryPerformance[]> => {
    const response = await api.get<CategoryPerformance[]>('/api/dashboard/category-performance/', { params: filters });
    return response.data;
  },

  // Endpoint que devuelve todo el dashboard de una vez
  getSummary: async (filters?: DashboardFilters): Promise<any> => {
    const response = await api.get('/api/dashboard/summary/', { params: filters });
    return response.data;
  },
};
