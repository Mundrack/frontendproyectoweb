import api from '../axios.config';
import {
  Recommendation,
  CreateRecommendationData,
  RecommendationsSummary,
} from '@/types/recommendation.types';

export const recommendationsApi = {
  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get<Recommendation[]>('/api/recommendations/');
    return response.data;
  },

  getRecommendation: async (id: number): Promise<Recommendation> => {
    const response = await api.get<Recommendation>(`/api/recommendations/${id}/`);
    return response.data;
  },

  createRecommendation: async (data: CreateRecommendationData): Promise<Recommendation> => {
    const response = await api.post<Recommendation>('/api/recommendations/', data);
    return response.data;
  },

  updateRecommendation: async (
    id: number,
    data: Partial<CreateRecommendationData>
  ): Promise<Recommendation> => {
    const response = await api.put<Recommendation>(`/api/recommendations/${id}/`, data);
    return response.data;
  },

  deleteRecommendation: async (id: number): Promise<void> => {
    await api.delete(`/api/recommendations/${id}/`);
  },

  generateRecommendations: async (
    auditId: number
  ): Promise<{
    message: string;
    summary: RecommendationsSummary;
    recommendations: Recommendation[];
  }> => {
    const response = await api.post(`/api/audits/${auditId}/generate-recommendations/`);
    return response.data;
  },

  getAuditRecommendations: async (auditId: number): Promise<Recommendation[]> => {
    const response = await api.get<Recommendation[]>(`/api/audits/${auditId}/recommendations/`);
    return response.data;
  },
};
