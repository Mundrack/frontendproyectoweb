import api from '../axios.config';
import { Template, TemplateWithQuestions, TemplateQuestion, CreateTemplateData } from '@/types/audit.types';

export const templatesApi = {
  getTemplates: async (): Promise<Template[]> => {
    const response = await api.get<Template[]>('/api/templates/');
    return response.data;
  },

  createTemplate: async (data: CreateTemplateData): Promise<Template> => {
    const response = await api.post<Template>('/api/templates/', data);
    return response.data;
  },

  getTemplate: async (id: number): Promise<TemplateWithQuestions> => {
    const response = await api.get<TemplateWithQuestions>(`/api/templates/${id}/`);
    return response.data;
  },

  // El backend ya filtra plantillas activas automáticamente en /api/templates/
  getActiveTemplates: async (): Promise<Template[]> => {
    const response = await api.get<Template[]>('/api/templates/');
    return response.data;
  },

  getTemplateQuestions: async (id: number): Promise<TemplateQuestion[]> => {
    const response = await api.get<TemplateQuestion[]>(`/api/templates/${id}/questions/`);
    return response.data;
  },

  // Question CRUD
  updateQuestion: async (id: number, data: Partial<TemplateQuestion>): Promise<TemplateQuestion> => {
    const response = await api.patch<TemplateQuestion>(`/api/questions/${id}/`, data);
    return response.data;
  },

  createQuestion: async (data: Omit<TemplateQuestion, 'id'>): Promise<TemplateQuestion> => {
    const response = await api.post<TemplateQuestion>('/api/questions/', data);
    return response.data;
  },

  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/api/questions/${id}/`);
  },
};
