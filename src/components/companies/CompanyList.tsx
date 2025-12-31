import React from 'react';
import { Company } from '@/types/company.types';
import { CompanyCard } from './CompanyCard';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onView: (company: Company) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};
