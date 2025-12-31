import api from '../axios.config';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register/', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/api/auth/logout/', { refresh: refreshToken });
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/api/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};
