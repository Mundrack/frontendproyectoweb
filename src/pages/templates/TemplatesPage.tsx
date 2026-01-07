import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { templatesApi } from '@/api/endpoints/templates';
import { Template, TemplateWithQuestions } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreview } from '@/components/templates/TemplatePreview';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateWithQuestions | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templatesApi.getActiveTemplates();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setTemplates(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setTemplates((data as any).results || []);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      setError('Error al cargar las plantillas');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (template: Template) => {
    try {
      setPreviewLoading(true);
      const data = await templatesApi.getTemplate(template.id);
      setPreviewTemplate(data);
    } catch (err) {
      setError('Error al cargar la plantilla');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleUseTemplate = (template: Template) => {
    navigate('/audits/create', { state: { templateId: template.id } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Plantillas de Auditoría</h1>
        <p className="text-gray-600 mt-1">
          Selecciona una plantilla para crear una nueva auditoría
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {templates.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No hay plantillas disponibles"
            description="No se encontraron plantillas activas en el sistema"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onUse={handleUseTemplate}
            />
          ))}
        </div>
      )}

      {previewLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner size="lg" />
        </div>
      )}

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => handleUseTemplate(previewTemplate)}
        />
      )}
    </div>
  );
};
