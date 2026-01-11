import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { templatesApi } from '@/api/endpoints/templates';
import { TemplateWithQuestions, TemplateQuestion } from '@/types/audit.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Input } from '@/components/common/Input';

export const TemplateEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<TemplateWithQuestions | null>(null);
    const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form states for editing
    const [editForm, setEditForm] = useState<Partial<TemplateQuestion>>({});

    useEffect(() => {
        if (id) {
            loadTemplateData();
        }
    }, [id]);

    const loadTemplateData = async () => {
        try {
            setLoading(true);
            const templateData = await templatesApi.getTemplate(Number(id));
            const questionsData = await templatesApi.getTemplateQuestions(Number(id));

            setTemplate(templateData);
            setQuestions(questionsData.sort((a, b) => a.order_num - b.order_num));
        } catch (err) {
            console.error('Error loading template data:', err);
            setError('Error al cargar la plantilla');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (question: TemplateQuestion) => {
        setEditingId(question.id);
        setEditForm({
            question_text: question.question_text,
            max_score: question.max_score,
            category: question.category,
            help_text: question.help_text,
            is_required: question.is_required
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveQuestion = async (questionId: number) => {
        try {
            setSaving(true);
            const updatedQuestion = await templatesApi.updateQuestion(questionId, editForm);

            setQuestions(prev =>
                prev.map(q => q.id === questionId ? updatedQuestion : q)
            );

            setEditingId(null);
            setSuccess('Pregunta actualizada correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating question:', err);
            setError('Error al actualizar la pregunta');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) return;

        try {
            await templatesApi.deleteQuestion(questionId);
            setQuestions(prev => prev.filter(q => q.id !== questionId));
            setSuccess('Pregunta eliminada correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting question:', err);
            setError('Error al eliminar la pregunta');
        }
    };

    const handleAddQuestion = () => {
        // Navigate to create question page or show modal
        // For now, let's just log it
        console.log('Add question clicked');
        alert('Funcionalidad de agregar pregunta próximamente');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!template) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-900 font-medium">Plantilla no encontrada</p>
                <Button onClick={() => navigate('/templates')} className="mt-4">
                    Volver a Plantillas
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                </div>
                <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Pregunta
                </Button>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            <div className="space-y-4">
                {questions.map((question) => (
                    <Card key={question.id} className="p-4">
                        {editingId === question.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Pregunta"
                                        value={editForm.question_text || ''}
                                        onChange={(e) => setEditForm({ ...editForm, question_text: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Categoría"
                                            value={editForm.category || ''}
                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        />
                                        <Input
                                            label="Puntaje Máx (Valoración)"
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={editForm.max_score || 0}
                                            onChange={(e) => setEditForm({ ...editForm, max_score: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Ayuda / Descripción"
                                        value={editForm.help_text || ''}
                                        onChange={(e) => setEditForm({ ...editForm, help_text: e.target.value })}
                                    />
                                    <div className="flex items-center pt-8">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_required}
                                                onChange={(e) => setEditForm({ ...editForm, is_required: e.target.checked })}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Respuesta Obligatoria</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                                    <Button variant="ghost" onClick={handleCancelEdit} disabled={saving}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={() => handleSaveQuestion(question.id)} disabled={saving} isLoading={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-gray-400">
                                    <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">
                                                #{question.order_num}
                                            </span>
                                            <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded">
                                                {question.category}
                                            </span>
                                            {question.is_required && (
                                                <span className="bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
                                                    Obligatoria
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(question)}>
                                                Editar
                                            </Button>
                                            <button
                                                onClick={() => handleDeleteQuestion(question.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {question.question_text}
                                    </h3>
                                    <div className="text-sm text-gray-500 flex gap-4">
                                        <span>Valoración: <span className="font-semibold text-gray-900">{question.max_score} puntos</span></span>
                                        {question.help_text && (
                                            <span className="text-gray-400 italic">• {question.help_text}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}

                {questions.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        No hay preguntas en esta plantilla aún.
                    </div>
                )}
            </div>
        </div>
    );
};
