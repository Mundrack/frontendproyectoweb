import React from 'react';
import { Branch } from '@/types/company.types';
import { BranchCard } from './BranchCard';

interface BranchListProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export const BranchList: React.FC<BranchListProps> = ({
  branches,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
