import api from '../axios.config';
import {
  Audit,
  CreateAuditData,
  QuestionWithResponse,
  CreateResponseData,
  AuditReport,
  ScoreBreakdown,
} from '@/types/audit.types';

export const auditsApi = {
  // Audits CRUD
  getAudits: async (): Promise<Audit[]> => {
    const response = await api.get<Audit[]>('/api/audits/');
    return response.data;
  },

  getAudit: async (id: number): Promise<Audit> => {
    const response = await api.get<Audit>(`/api/audits/${id}/`);
    return response.data;
  },

  createAudit: async (data: CreateAuditData): Promise<Audit> => {
    const response = await api.post<Audit>('/api/audits/', data);
    return response.data;
  },

  deleteAudit: async (id: number): Promise<void> => {
    await api.delete(`/api/audits/${id}/`);
  },

  // Audit Execution
  startAudit: async (id: number): Promise<Audit> => {
    const response = await api.post<Audit>(`/api/audits/${id}/start/`);
    return response.data;
  },

  getAuditQuestions: async (id: number): Promise<QuestionWithResponse[]> => {
    const response = await api.get<QuestionWithResponse[]>(`/api/audits/${id}/questions/`);
    return response.data;
  },

  submitResponse: async (auditId: number, data: CreateResponseData): Promise<void> => {
    await api.post(`/api/audits/${auditId}/responses/`, data);
  },

  completeAudit: async (id: number): Promise<Audit> => {
    const response = await api.post<Audit>(`/api/audits/${id}/complete/`);
    return response.data;
  },

  // Reports
  getAuditReport: async (id: number): Promise<AuditReport> => {
    const response = await api.get<AuditReport>(`/api/audits/${id}/report/`);
    return response.data;
  },

  getScoreBreakdown: async (id: number): Promise<ScoreBreakdown> => {
    const response = await api.get<ScoreBreakdown>(`/api/audits/${id}/score-breakdown/`);
    return response.data;
  },
};
