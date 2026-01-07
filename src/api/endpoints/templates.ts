import api from '../axios.config';
import { Template, TemplateWithQuestions } from '@/types/audit.types';

export const templatesApi = {
  getTemplates: async (): Promise<Template[]> => {
    const response = await api.get<Template[]>('/api/templates/');
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
};
