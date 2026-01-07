import React from 'react';
import { Card } from '@/components/common/Card';
import { TopCompany } from '@/types/dashboard.types';
import { getScoreColor } from '@/utils/formatters';

interface TopCompaniesTableProps {
  companies: TopCompany[];
}

export const TopCompaniesTable: React.FC<TopCompaniesTableProps> = ({ companies }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Empresas por Desempeño
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auditorías
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score Promedio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => {
              const scoreColor = getScoreColor(company.average_score);
              const colorClass = scoreColor === 'success' ? 'text-success-600' : scoreColor === 'warning' ? 'text-warning-600' : 'text-danger-600';

              return (
                <tr key={company.company_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.audits_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-semibold ${colorClass}`}>
                      {company.average_score.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
