import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { auditsApi } from '@/api/endpoints/audits';
import { Audit, QuestionWithResponse, CreateResponseData } from '@/types/audit.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { QuestionCard } from '@/components/audits/QuestionCard';
import { AuditProgress } from '@/components/audits/AuditProgress';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export const AuditExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [audit, setAudit] = useState<Audit | null>(null);
  const [questions, setQuestions] = useState<QuestionWithResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  const confirmDialog = useConfirm();

  useEffect(() => {
    if (id) {
      loadAuditData();
    }
  }, [id]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      const [auditData, questionsData] = await Promise.all([
        auditsApi.getAudit(Number(id)),
        auditsApi.getAuditQuestions(Number(id)),
      ]);

      setAudit(auditData);
      setQuestions(questionsData);

      const firstUnanswered = questionsData.findIndex((q) => !q.has_response);
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      }
    } catch (err) {
      setError('Error al cargar la auditoría');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (data: CreateResponseData) => {
    try {
      await auditsApi.submitResponse(Number(id), data);

      const updatedQuestions = await auditsApi.getAuditQuestions(Number(id));
      setQuestions(updatedQuestions);

      const nextUnanswered = updatedQuestions.findIndex(
        (q, idx) => idx > currentQuestionIndex && !q.has_response
      );

      if (nextUnanswered !== -1) {
        setCurrentQuestionIndex(nextUnanswered);
      } else if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar la respuesta');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = () => {
    const answeredCount = questions.filter((q) => q.has_response).length;
    const requiredCount = questions.length;

    if (answeredCount < requiredCount) {
      confirmDialog.confirm(
        'Completar Auditoría',
        `Faltan ${requiredCount - answeredCount} preguntas por responder. ¿Deseas completar la auditoría de todas formas?`,
        confirmComplete
      );
    } else {
      confirmDialog.confirm(
        'Completar Auditoría',
        '¿Estás seguro de completar esta auditoría? No podrás modificar las respuestas después.',
        confirmComplete
      );
    }
  };

  const confirmComplete = async () => {
    try {
      setCompleteLoading(true);
      await auditsApi.completeAudit(Number(id));
      confirmDialog.close();
      navigate(`/audits/${id}/report`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al completar la auditoría');
    } finally {
      setCompleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!audit || questions.length === 0) {
    return <div>Auditoría no encontrada</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = questions.filter((q) => q.has_response).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/audits')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Auditorías
        </Button>
      </div>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{audit.title}</h1>
        <p className="text-gray-600">{audit.template_name}</p>
      </Card>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            onSubmit={handleSubmitResponse}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>

            <span className="text-sm text-gray-600">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>

            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AuditProgress
            totalQuestions={questions.length}
            answeredQuestions={answeredCount}
            progress={progress}
          />

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Navegación Rápida
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    aspect-square rounded-lg border-2 font-medium text-sm transition-all
                    ${
                      idx === currentQuestionIndex
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : q.has_response
                        ? 'border-success-300 bg-success-50 text-success-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </Card>

          {progress === 100 && (
            <Button fullWidth onClick={handleComplete}>
              <CheckCircle className="h-5 w-5 mr-2" />
              Completar Auditoría
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant="primary"
        confirmText="Completar"
        isLoading={completeLoading}
      />
    </div>
  );
};
