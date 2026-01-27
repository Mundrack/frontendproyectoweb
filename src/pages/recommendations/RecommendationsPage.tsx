import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { auditsApi } from '@/api/endpoints/audits';
import { Audit } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/utils/formatters';

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
  const [audits, setAudits] = useState<Audit[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<TemplateAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompletedAudits();
  }, []);

  const loadCompletedAudits = async () => {
    try {
      setLoading(true);
      const data = await auditsApi.getAudits();

      let auditsData: Audit[] = [];

      if (Array.isArray(data)) {
        auditsData = data;
      } else if (data && typeof data === 'object' && 'results' in data) {
        auditsData = (data as any).results || [];
      }

      // Filter only completed audits
      const completed = auditsData.filter(a => a.status === 'completed');

      console.log('✅ Auditorías completadas cargadas:', completed);
      setAudits(completed);
    } catch (err: any) {
      console.error('❌ Error al cargar auditorías:', err);
      setError('Error al cargar las auditorías');
    } finally {
      setLoading(false);
    }
  };

  const analyzeAudit = async (auditId: number) => {
    try {
      setAnalyzing(true);
      setError('');

      const audit = audits.find(a => a.id === auditId);
      if (!audit) {
        setError('Auditoría no encontrada');
        return;
      }

      // Obtener el reporte de la auditoría
      const report = await auditsApi.getAuditReport(auditId);
      console.log('📈 Reporte obtenido:', report);

      // Analizar categorías
      const categories: CategoryAnalysis[] = Object.entries(report.score_by_category).map(
        ([category, data]: [string, any]) => {
          const maxScore = data.max_score || 0;
          const score = data.score || 0;
          const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

          return {
            category,
            score,
            maxScore,
            percentage,
            needsAttention: percentage < 65
          };
        }
      );

      const categoriesNeedingAttention = categories.filter(c => c.needsAttention);
      const totalScore = audit.score || 0;
      const maxScore = audit.max_score || 100; // Default to 100 if missing
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

      setAnalysis({
        templateName: audit.template_name || 'Plantilla',
        totalScore,
        maxScore,
        percentage,
        categoriesNeedingAttention,
        allCategories: categories
      });

    } catch (err: any) {
      console.error('❌ Error analyzing audit:', err);
      let errorMessage = 'Error al analizar la auditoría.';

      if (err.response?.status === 404) {
        errorMessage = 'No se encontró el reporte de la auditoría.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      setAnalysis(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAuditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const auditId = Number(e.target.value);
    setSelectedAuditId(auditId);
    if (auditId) {
      analyzeAudit(auditId);
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
          Selecciona una auditoría completada para ver el análisis vs la plantilla y áreas de mejora
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Selector de Auditoría */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una Auditoría Completada
            </label>
            <select
              value={selectedAuditId || ''}
              onChange={handleAuditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={analyzing}
            >
              <option value="">-- Selecciona una auditoría --</option>
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.title} - {audit.template_name} ({formatDate(audit.completed_date || audit.updated_at)})
                </option>
              ))}
            </select>
          </div>

          {analyzing && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
              <span className="ml-3 text-gray-600">Analizando auditoría...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Análisis de Auditoría */}
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
                <p className="text-sm text-gray-600 mb-2">Puntaje Obtenido</p>
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
                <p className="text-sm text-gray-600 mb-2">Puntaje Máximo Posible</p>
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
      {!selectedAuditId && !analyzing && (
        <Card>
          <EmptyState
            icon={Lightbulb}
            title="Selecciona una Auditoría"
            description="Elige una auditoría completada para ver el análisis automático y las áreas que necesitan atención"
          />
        </Card>
      )}
    </div>
  );
};
