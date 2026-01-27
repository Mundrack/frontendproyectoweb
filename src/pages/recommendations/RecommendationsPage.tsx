import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { templatesApi } from '@/api/endpoints/templates';
import { auditsApi } from '@/api/endpoints/audits';
import { Template } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';

interface CategoryAnalysis {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  needsAttention: boolean;
}

interface TemplateAnalysis {
  templateName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  categoriesNeedingAttention: CategoryAnalysis[];
  allCategories: CategoryAnalysis[];
}

export const RecommendationsPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<TemplateAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templatesApi.getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  const analyzeTemplate = async (templateId: number) => {
    try {
      setAnalyzing(true);
      setError('');

      // Obtener todas las auditorías completadas de esta plantilla
      const auditsResponse = await auditsApi.getAudits();

      // Handle both array and paginated response
      const auditsArray = Array.isArray(auditsResponse)
        ? auditsResponse
        : (auditsResponse as any).results || [];

      console.log('📊 Auditorías obtenidas:', auditsArray);

      const completedAudits = auditsArray.filter(
        (a: any) => {
          console.log(`Auditoría ${a.id}: template=${a.template}, status=${a.status}`);
          return a.template === templateId && a.status === 'completed';
        }
      );

      console.log('✅ Auditorías completadas filtradas:', completedAudits);

      if (completedAudits.length === 0) {
        setError('No hay auditorías completadas para esta plantilla');
        setAnalysis(null);
        return;
      }

      // Tomar la auditoría más reciente
      const latestAudit = completedAudits.sort((a: any, b: any) =>
        new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
      )[0];

      // Obtener el reporte de la auditoría
      const report = await auditsApi.getAuditReport(latestAudit.id);

      const template = templates.find(t => t.id === templateId);

      // Analizar categorías
      const categories: CategoryAnalysis[] = Object.entries(report.score_by_category).map(
        ([category, data]: [string, any]) => {
          const percentage = (data.score / data.max_score) * 100;
          return {
            category,
            score: data.score,
            maxScore: data.max_score,
            percentage,
            needsAttention: percentage < 65
          };
        }
      );

      const categoriesNeedingAttention = categories.filter(c => c.needsAttention);

      setAnalysis({
        templateName: template?.name || 'Plantilla',
        totalScore: latestAudit.score || 0,
        maxScore: latestAudit.max_score || 100,
        percentage: latestAudit.score_percentage || 0,
        categoriesNeedingAttention,
        allCategories: categories
      });

    } catch (err: any) {
      console.error('❌ Error analyzing template:', err);
      console.error('❌ Error response:', err.response);

      let errorMessage = 'Error al analizar la plantilla.';

      if (err.response?.status === 404) {
        errorMessage = 'No se encontró el reporte de la auditoría.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage + ' Asegúrate de tener auditorías completadas.');
      setAnalysis(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = Number(e.target.value);
    setSelectedTemplateId(templateId);
    if (templateId) {
      analyzeTemplate(templateId);
    } else {
      setAnalysis(null);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Recomendaciones</h1>
        <p className="text-gray-600 mt-1">
          Gestiona recomendaciones automáticas y manuales para mejorar tus auditorías
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Selector de Plantilla */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una Plantilla para Analizar
            </label>
            <select
              value={selectedTemplateId || ''}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={analyzing}
            >
              <option value="">-- Selecciona una plantilla --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {analyzing && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
              <span className="ml-3 text-gray-600">Analizando plantilla...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Análisis de Plantilla */}
      {analysis && !analyzing && (
        <>
          {/* Comparación VS */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Comparación: {analysis.templateName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Puntaje Actual */}
              <div className="text-center p-6 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Tu Puntaje</p>
                <p className="text-4xl font-bold text-primary-600">
                  {analysis.totalScore}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {analysis.percentage.toFixed(1)}%
                </p>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-400">VS</span>
              </div>

              {/* Puntaje Perfecto */}
              <div className="text-center p-6 bg-success-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Puntaje Perfecto</p>
                <p className="text-4xl font-bold text-success-600">
                  {analysis.maxScore}
                </p>
                <p className="text-sm text-gray-500 mt-1">100%</p>
              </div>
            </div>
          </Card>

          {/* Áreas que Necesitan Atención */}
          {analysis.categoriesNeedingAttention.length > 0 ? (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-warning-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Áreas que Necesitan Atención
                </h2>
              </div>

              <p className="text-gray-700 mb-6">
                Las siguientes categorías obtuvieron menos del <strong>65%</strong> del puntaje
                y requieren atención inmediata:
              </p>

              <div className="space-y-4">
                {analysis.categoriesNeedingAttention.map((category, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-danger-500 bg-danger-50 p-4 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {category.category}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            Puntaje: <strong>{category.score}</strong> / {category.maxScore}
                          </span>
                          <span className={`font-bold ${category.percentage < 50 ? 'text-danger-600' : 'text-warning-600'
                            }`}>
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <TrendingDown className="h-5 w-5 text-danger-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-success-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  ¡Excelente Desempeño!
                </h2>
              </div>
              <p className="text-gray-700">
                Todas las categorías obtuvieron más del 65% del puntaje.
                ¡Sigue manteniendo estos estándares!
              </p>
            </Card>
          )}

          {/* Todas las Categorías */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Desglose por Categoría
            </h2>

            <div className="space-y-3">
              {analysis.allCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{category.category}</p>
                    <p className="text-sm text-gray-600">
                      {category.score} / {category.maxScore} puntos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.percentage >= 65
                          ? 'bg-success-600'
                          : 'bg-danger-600'
                          }`}
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      />
                    </div>
                    <span className={`font-bold text-sm w-16 text-right ${category.percentage >= 65
                      ? 'text-success-600'
                      : 'text-danger-600'
                      }`}>
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Empty State */}
      {!selectedTemplateId && !analyzing && (
        <Card>
          <EmptyState
            icon={Lightbulb}
            title="Selecciona una Plantilla"
            description="Elige una plantilla de auditoría para ver el análisis automático y las áreas que necesitan atención"
          />
        </Card>
      )}
    </div>
  );
};
