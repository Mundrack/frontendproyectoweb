import React from 'react';
import { X } from 'lucide-react';
import { TemplateWithQuestions } from '@/types/audit.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface TemplatePreviewProps {
  template: TemplateWithQuestions;
  onClose: () => void;
  onUse: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose, onUse }) => {
  const questionsByCategory = template.questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof template.questions>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-gray-600 mt-1">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(questionsByCategory).map(([category, questions]) => (
              <Card key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                <div className="space-y-3">
                  {questions
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((question, idx) => (
                      <div key={question.id} className="flex gap-3">
                        <span className="text-sm font-medium text-gray-500 mt-0.5">
                          {idx + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{question.question_text}</p>
                          <span className="text-xs text-gray-500">Peso: {question.weight}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{template.questions.length}</span> preguntas en{' '}
            <span className="font-medium">{Object.keys(questionsByCategory).length}</span> categorías
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onUse}>Usar esta Plantilla</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
