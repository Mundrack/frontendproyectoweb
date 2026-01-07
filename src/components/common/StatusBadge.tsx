import React from 'react';

interface StatusBadgeProps {
  label: string;
  color?: 'gray' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, color = 'gray', size = 'md' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
    primary: 'bg-primary-100 text-primary-700 border-primary-300',
    success: 'bg-success-100 text-success-700 border-success-300',
    warning: 'bg-warning-100 text-warning-700 border-warning-300',
    danger: 'bg-danger-100 text-danger-700 border-danger-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${colorClasses[color]}
        ${sizeClasses[size]}
      `}
    >
      {label}
    </span>
  );
};
