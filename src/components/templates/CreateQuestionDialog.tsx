import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface CreateQuestionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: QuestionFormData) => void;
    nextOrderNum: number;
    isLoading?: boolean;
}

export interface QuestionFormData {
    question_text: string;
    category: string;
    max_score: number;
    order_num: number;
    is_required: boolean;
    help_text: string;
}

export const CreateQuestionDialog: React.FC<CreateQuestionDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    nextOrderNum,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<QuestionFormData>({
        question_text: '',
        category: '',
        max_score: 5,
        order_num: nextOrderNum,
        is_required: true,
        help_text: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof QuestionFormData, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof QuestionFormData, string>> = {};

        if (!formData.question_text.trim()) {
            newErrors.question_text = 'La pregunta es obligatoria';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'La categoría es obligatoria';
        }

        if (formData.max_score < 1 || formData.max_score > 10) {
            newErrors.max_score = 'El puntaje debe estar entre 1 y 10';
        }

        if (formData.order_num < 1) {
            newErrors.order_num = 'El orden debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({
            question_text: '',
            category: '',
            max_score: 5,
            order_num: nextOrderNum,
            is_required: true,
            help_text: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Nueva Pregunta</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <Input
                            label="Pregunta *"
                            value={formData.question_text}
                            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                            placeholder="¿Se mantiene un inventario actualizado de todos los activos de información?"
                            error={errors.question_text}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Categoría *"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Ej: Gestión de Activos"
                            error={errors.category}
                            disabled={isLoading}
                        />

                        <Input
                            label="Puntaje Máximo (Valoración) *"
                            type="number"
                            min={1}
                            max={10}
                            value={formData.max_score}
                            onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                            error={errors.max_score}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Número de Orden *"
                            type="number"
                            min={1}
                            value={formData.order_num}
                            onChange={(e) => setFormData({ ...formData, order_num: Number(e.target.value) })}
                            error={errors.order_num}
                            disabled={isLoading}
                            help="Posición de la pregunta en la plantilla"
                        />

                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_required}
                                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    disabled={isLoading}
                                />
                                <span className="text-sm font-medium text-gray-700">Respuesta Obligatoria</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="help_text" className="block text-sm font-medium text-gray-700 mb-1">
                            Ayuda / Descripción
                        </label>
                        <textarea
                            id="help_text"
                            value={formData.help_text}
                            onChange={(e) => setFormData({ ...formData, help_text: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Información adicional para guiar la respuesta..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            Crear Pregunta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
