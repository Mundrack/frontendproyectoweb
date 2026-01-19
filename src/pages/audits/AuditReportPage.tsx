import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp } from 'lucide-react';
import { auditsApi } from '@/api/endpoints/audits';
import { AuditReport, ScoreBreakdown } from '@/types/audit.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { ScoreCard } from '@/components/common/ScoreCard';
import { CategoryScore } from '@/components/audits/CategoryScore';
import { formatDate, getResponseLabel } from '@/utils/formatters';

export const AuditReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<AuditReport | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const [reportData, scoreData] = await Promise.all([
        auditsApi.getAuditReport(Number(id)),
        auditsApi.getScoreBreakdown(Number(id)),
      ]);
      setReport(reportData);
      setScoreBreakdown(scoreData);
    } catch (err) {
      console.error('Error loading report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    console.log('Descargar reporte');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report || !scoreBreakdown) {
    return <div>Reporte no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/audits')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Auditorías
        </Button>

        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Descargar Reporte
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.audit.title}</h1>
          <p className="text-gray-600">{report.audit.template_name}</p>
          <p className="text-sm text-gray-500 mt-2">
            {report.audit.company_name} • {formatDate(report.audit.created_at)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard
            title="Puntuación Total"
            score={scoreBreakdown.total_score}
            maxScore={scoreBreakdown.max_score}
            percentage={scoreBreakdown.percentage}
          />

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Resumen de Respuestas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sí:</span>
                <span className="font-medium text-success-600">{report.summary.yes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Parcial:</span>
                <span className="font-medium text-warning-600">{report.summary.partial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">No:</span>
                <span className="font-medium text-danger-600">{report.summary.no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">N/A:</span>
                <span className="font-medium text-gray-600">{report.summary.na}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Progreso</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-medium">{report.summary.total_questions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Respondidas:</span>
                <span className="font-medium text-primary-600">{report.summary.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tasa:</span>
                <span className="font-medium">
                  {((report.summary.answered / report.summary.total_questions) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Puntuación por Categoría</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(scoreBreakdown.categories).map(([category, score]) => (
            <CategoryScore key={category} category={category} score={score} />
          ))}
        </div>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalle de Respuestas</h2>

        <div className="space-y-6">
          {Object.entries(report.score_by_category).map(([category, _]) => {
            const categoryResponses = report.responses.filter(
              (r) => r.category === category
            );

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                <div className="space-y-3">
                  {categoryResponses.map((response, idx) => (
                    <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {response.question_text}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Respuesta:{' '}
                          <span className="font-medium">
                            {getResponseLabel(response.response)}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Puntuación: <span className="font-medium">{response.score}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
