import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { comparisonsApi } from '@/api/endpoints/comparisons';
import { Comparison, ComparisonAnalysis } from '@/types/comparison.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';

export const ComparisonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadComparison();
      loadAnalysis();
    }
  }, [id]);

  const loadComparison = async () => {
    try {
      const data = await comparisonsApi.getComparison(Number(id));
      setComparison(data);
    } catch (err) {
      setError('Error al cargar la comparación');
    }
  };

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const data = await comparisonsApi.analyzeComparison(Number(id));
      setAnalysis(data);
    } catch (err) {
      setError('Error al cargar el análisis');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-5 w-5 text-success-600" />;
    if (value < 0) return <TrendingDown className="h-5 w-5 text-error-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-success-600';
    if (value < 0) return 'text-error-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!comparison || !analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la comparación</p>
        <Button onClick={() => navigate('/comparisons')} className="mt-4">
          Volver a Comparaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/comparisons')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{comparison.name}</h1>
          <p className="text-gray-600 mt-1">{comparison.description}</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Auditorías</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {analysis.comparative_analysis.total_audits}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Puntuación Promedio</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {analysis.comparative_analysis.average_score.toFixed(1)}%
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Puntuación Más Alta</p>
            <p className="text-3xl font-bold text-success-600 mt-2">
              {analysis.comparative_analysis.highest_score.score.toFixed(1)}%
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Puntuación Más Baja</p>
            <p className="text-3xl font-bold text-error-600 mt-2">
              {analysis.comparative_analysis.lowest_score.score.toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Audits Comparison */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Auditorías Comparadas
        </h3>
        <div className="space-y-3">
          {analysis.audits.map((audit) => (
            <div
              key={audit.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{audit.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  {Object.entries(audit.score_by_category).map(([category, data]) => (
                    <span key={category} className="text-sm text-gray-600">
                      {category}: {data.percentage.toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {audit.score_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories Comparison */}
      {analysis.categories_comparison && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparación por Categorías
          </h3>
          <div className="space-y-4">
            {Object.entries(analysis.categories_comparison).map(([category, data]) => (
              <div key={category} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Promedio: <span className="font-semibold">{data.average.toFixed(1)}%</span>
                    </span>
                    <span className="text-success-600">
                      Máx: {data.highest.toFixed(1)}%
                    </span>
                    <span className="text-error-600">
                      Mín: {data.lowest.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {data.audits.map((auditData) => {
                    const audit = analysis.audits.find((a) => a.id === auditData.audit_id);
                    return (
                      <div
                        key={auditData.audit_id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {audit?.title || `Auditoría ${auditData.audit_id}`}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {auditData.percentage.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analysis Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getTrendIcon(analysis.comparative_analysis.score_range)}
            </div>
            <div>
              <p className="font-medium text-gray-900">Rango de Variación</p>
              <p className="text-sm text-gray-600">
                Las puntuaciones varían en{' '}
                <span className="font-semibold">
                  {analysis.comparative_analysis.score_range.toFixed(1)}%
                </span>
                {' '}entre la auditoría más alta y más baja.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getTrendIcon(analysis.comparative_analysis.score_variance)}
            </div>
            <div>
              <p className="font-medium text-gray-900">Varianza</p>
              <p className="text-sm text-gray-600">
                La varianza de las puntuaciones es de{' '}
                <span className="font-semibold">
                  {analysis.comparative_analysis.score_variance.toFixed(2)}
                </span>
                {analysis.comparative_analysis.score_variance < 100
                  ? ', indicando consistencia en los resultados.'
                  : ', indicando alta variabilidad en los resultados.'}
              </p>
            </div>
          </div>

          {!analysis.comparative_analysis.same_template && (
            <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-lg">
              <div className="mt-1">
                <Alert type="warning" message="" onClose={() => { }} />
              </div>
              <div>
                <p className="font-medium text-warning-900">Diferentes Plantillas</p>
                <p className="text-sm text-warning-700">
                  Las auditorías utilizan diferentes plantillas, lo que puede afectar la
                  comparabilidad de los resultados.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
