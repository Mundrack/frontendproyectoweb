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

      console.log('Audit data received:', auditData);
      console.log('Questions data received:', questionsData);

      setAudit(auditData);

      // Handle different response formats
      let questionsArray: any[] = [];

      if (Array.isArray(questionsData)) {
        // Direct array response
        questionsArray = questionsData;
        console.log('Questions is array, length:', questionsArray.length);
      } else if (questionsData && typeof questionsData === 'object') {
        // Check if it's the new format with questions property
        if ('questions' in questionsData) {
          questionsArray = (questionsData as any).questions || [];
          console.log('Questions from questions property, length:', questionsArray.length);
        } else if ('results' in questionsData) {
          // Paginated response
          questionsArray = (questionsData as any).results || [];
          console.log('Questions is paginated, results length:', questionsArray.length);
        }
      }

      console.log('Questions array to set:', questionsArray);

      // Map the questions to include has_response flag
      const mappedQuestions: QuestionWithResponse[] = questionsArray.map((q: any) => ({
        id: q.id,
        audit_id: auditData.id,
        question_id: q.id,
        question_text: q.question_text,
        category: q.category,
        order_num: q.order_num,
        max_score: q.max_score,
        is_required: q.is_required,
        help_text: q.help_text,
        has_response: q.response !== null && q.response !== undefined,
        response: q.response?.response_type,
        comments: q.response?.notes,
      }));

      console.log('Mapped questions:', mappedQuestions);
      setQuestions(mappedQuestions);

      const firstUnanswered = mappedQuestions.findIndex((q) => !q.has_response);
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      }
    } catch (err) {
      console.error('Error loading audit data:', err);
      setError('Error al cargar la auditoría');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (data: CreateResponseData) => {
    try {
      await auditsApi.submitResponse(Number(id), data);

      const updatedQuestionsData = await auditsApi.getAuditQuestions(Number(id));

      // Handle different response formats (same as loadAuditData)
      let questionsArray: any[] = [];

      if (Array.isArray(updatedQuestionsData)) {
        questionsArray = updatedQuestionsData;
      } else if (updatedQuestionsData && typeof updatedQuestionsData === 'object') {
        if ('questions' in updatedQuestionsData) {
          questionsArray = (updatedQuestionsData as any).questions || [];
        } else if ('results' in updatedQuestionsData) {
          questionsArray = (updatedQuestionsData as any).results || [];
        }
      }

      // Map the questions to include has_response flag
      const updatedQuestions: QuestionWithResponse[] = questionsArray.map((q: any) => ({
        id: q.id,
        audit_id: Number(id),
        question_id: q.id,
        question_text: q.question_text,
        category: q.category,
        order_num: q.order_num,
        max_score: q.max_score,
        is_required: q.is_required,
        help_text: q.help_text,
        has_response: q.response !== null && q.response !== undefined,
        response: q.response?.response_type,
        comments: q.response?.notes,
      }));

      setQuestions(updatedQuestions);

      const nextUnanswered = updatedQuestions.findIndex(
        (q, idx) => idx > currentQuestionIndex && !q.has_response
      );

      if (nextUnanswered !== -1) {
        setCurrentQuestionIndex(nextUnanswered);
      } else if (currentQuestionIndex < updatedQuestions.length - 1) {
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
      console.error('Error completing audit:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.error
        || err.response?.data?.detail
        || (typeof err.response?.data === 'object' ? JSON.stringify(err.response?.data) : 'Error al completar la auditoría');
      setError(errorMessage);
      confirmDialog.close();
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
    console.log('Render check - audit:', audit);
    console.log('Render check - questions length:', questions.length);
    console.log('Render check - questions:', questions);
    return (
      <div className="text-center py-12">
        <p className="text-gray-900 font-medium">Auditoría no encontrada</p>
        <p className="text-sm text-gray-500 mt-2">
          {!audit ? 'No se pudo cargar la auditoría' : 'No hay preguntas disponibles'}
        </p>
        <Button onClick={() => navigate('/audits')} className="mt-4">
          Volver a Auditorías
        </Button>
      </div>
    );
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
                    ${idx === currentQuestionIndex
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
