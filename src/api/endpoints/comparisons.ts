import api from '../axios.config';
import {
  Comparison,
  CreateComparisonData,
  ComparisonAnalysis,
  TrendsAnalysis,
} from '@/types/comparison.types';

export const comparisonsApi = {
  getComparisons: async (): Promise<Comparison[]> => {
    const response = await api.get<Comparison[]>('/api/comparisons/');
    return response.data;
  },

  getComparison: async (id: number): Promise<Comparison> => {
    const response = await api.get<Comparison>(`/api/comparisons/${id}/`);
    return response.data;
  },

  createComparison: async (data: CreateComparisonData): Promise<Comparison> => {
    const response = await api.post<Comparison>('/api/comparisons/', data);
    return response.data;
  },

  deleteComparison: async (id: number): Promise<void> => {
    await api.delete(`/api/comparisons/${id}/`);
  },

  compareAudits: async (auditIds: number[]): Promise<ComparisonAnalysis> => {
    const response = await api.post<ComparisonAnalysis>('/api/comparisons/compare/', {
      audit_ids: auditIds,
    });
    return response.data;
  },

  analyzeComparison: async (id: number): Promise<ComparisonAnalysis> => {
    const response = await api.get<ComparisonAnalysis>(`/api/comparisons/${id}/analyze/`);
    return response.data;
  },

  analyzeTrends: async (auditIds: number[]): Promise<TrendsAnalysis> => {
    const response = await api.post<TrendsAnalysis>('/api/comparisons/trends/', {
      audit_ids: auditIds,
    });
    return response.data;
  },

  getComparisonTrends: async (id: number): Promise<TrendsAnalysis> => {
    const response = await api.get<TrendsAnalysis>(`/api/comparisons/${id}/trends/`);
    return response.data;
  },
};
