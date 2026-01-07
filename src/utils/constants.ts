export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sistema de Auditorías';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPANIES: '/companies',
  AUDITS: '/audits',
  TEMPLATES: '/templates',
  TEAMS: '/teams',
  COMPARISONS: '/comparisons',
} as const;

export const USER_TYPES = {
  OWNER: 'owner',
  EMPLOYEE: 'employee',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

export const AUDIT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const RESPONSE_TYPES = {
  YES: 'yes',
  NO: 'no',
  PARTIAL: 'partial',
  NA: 'na',
} as const;
