import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import { User, LoginCredentials, RegisterData, AuthContextType } from '@/types/auth.types';
import { STORAGE_KEYS, ROUTES } from '@/utils/constants';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario guardado al cargar
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      const { user: userData, tokens } = response;

      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setUser(userData);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      const { user: userData, tokens } = response;

      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setUser(userData);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Llamar al endpoint de logout (opcional, puede fallar si el token ya expiró)
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {
        // Ignorar errores del logout en el backend
      });
    }

    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
