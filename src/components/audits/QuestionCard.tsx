import React, { useState, useEffect } from 'react';
import { QuestionWithResponse, CreateResponseData, ResponseType } from '@/types/audit.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { getResponseLabel } from '@/utils/formatters';

interface QuestionCardProps {
  question: QuestionWithResponse;
  questionNumber: number;
  onSubmit: (data: CreateResponseData) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onSubmit,
}) => {
  const [selectedResponse, setSelectedResponse] = useState<ResponseType | undefined>(
    question.response
  );
  const [comments, setComments] = useState(question.comments || '');

  useEffect(() => {
    setSelectedResponse(question.response);
    setComments(question.comments || '');
  }, [question]);

  const handleSubmit = () => {
    if (!selectedResponse) return;

    onSubmit({
      question_id: question.question_id,
      response: selectedResponse,
      comments: comments.trim() || undefined,
    });
  };

  const responseOptions: ResponseType[] = ['yes', 'no', 'partial', 'na'];

  const getResponseColor = (response: ResponseType): string => {
    const colors: Record<ResponseType, string> = {
      yes: 'success',
      no: 'danger',
      partial: 'warning',
      na: 'gray',
    };
    return colors[response];
  };

  const getButtonClasses = (response: ResponseType): string => {
    const isSelected = selectedResponse === response;
    const color = getResponseColor(response);

    const colorClasses: Record<string, string> = {
      success: isSelected
        ? 'bg-success-600 text-white border-success-600'
        : 'border-success-300 text-success-700 hover:bg-success-50',
      danger: isSelected
        ? 'bg-danger-600 text-white border-danger-600'
        : 'border-danger-300 text-danger-700 hover:bg-danger-50',
      warning: isSelected
        ? 'bg-warning-600 text-white border-warning-600'
        : 'border-warning-300 text-warning-700 hover:bg-warning-50',
      gray: isSelected
        ? 'bg-gray-600 text-white border-gray-600'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50',
    };

    return colorClasses[color];
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
              Pregunta {questionNumber}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {question.category}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.question_text}
          </h3>
          <p className="text-sm text-gray-500 mt-2">Peso: {question.weight}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona tu respuesta:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {responseOptions.map((response) => (
              <button
                key={response}
                onClick={() => setSelectedResponse(response)}
                className={`
                  px-4 py-3 rounded-lg border-2 font-medium transition-all
                  ${getButtonClasses(response)}
                `}
              >
                {getResponseLabel(response)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios (opcional):
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Agrega observaciones, evidencias o notas adicionales..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selectedResponse}>
            Guardar Respuesta
          </Button>
        </div>
      </div>
    </Card>
  );
};
