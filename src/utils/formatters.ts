import { AuditStatus, ResponseType } from '@/types/audit.types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status: AuditStatus): string => {
  const labels: Record<AuditStatus, string> = {
    draft: 'Borrador',
    in_progress: 'En Progreso',
    completed: 'Completada',
  };
  return labels[status];
};

export const getStatusColor = (status: AuditStatus): string => {
  const colors: Record<AuditStatus, string> = {
    draft: 'gray',
    in_progress: 'primary',
    completed: 'success',
  };
  return colors[status];
};

export const getResponseLabel = (response: ResponseType): string => {
  const labels: Record<ResponseType, string> = {
    yes: 'Sí',
    no: 'No',
    partial: 'Parcial',
    na: 'N/A',
  };
  return labels[response];
};

export const getResponseColor = (response: ResponseType): string => {
  const colors: Record<ResponseType, string> = {
    yes: 'success',
    no: 'danger',
    partial: 'warning',
    na: 'gray',
  };
  return colors[response];
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'danger';
};
