import React from 'react';
import { FileText, Eye, Edit } from 'lucide-react';
import { Template } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  onEdit?: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPreview, onUse, onEdit }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-100 rounded-lg">
          <FileText className="h-8 w-8 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="px-2 py-1 bg-gray-100 rounded">{template.category}</span>
            {template.question_count && (
              <span>{template.question_count} preguntas</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => onPreview(template)}>
              <Eye className="h-4 w-4 mr-1" />
              Vista Previa
            </Button>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            <Button size="sm" onClick={() => onUse(template)}>
              Usar Plantilla
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
