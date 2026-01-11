import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { CreateTemplateData } from '@/types/audit.types';
import { templatesApi } from '@/api/endpoints/templates';

interface CreateTemplateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (templateId: number) => void;
}

export const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState<CreateTemplateData>({
        name: '',
        iso_standard: 'ISO 27001',
        description: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const template = await templatesApi.createTemplate(formData);
            onSuccess(template.id);
            onClose();
        } catch (err) {
            console.error('Error creating template:', err);
            setError('Error al crear la plantilla. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Nueva Plantilla de Auditoría
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Plantilla *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Auditoría Anual ISO 9001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Norma / Estándar *
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    value={formData.iso_standard}
                                    onChange={(e) => setFormData({ ...formData, iso_standard: e.target.value })}
                                >
                                    <option value="ISO 9001">ISO 9001 - Calidad</option>
                                    <option value="ISO 27001">ISO 27001 - Seguridad</option>
                                    <option value="ISO 45001">ISO 45001 - Salud y Seguridad</option>
                                    <option value="ISO 14001">ISO 14001 - Medio Ambiente</option>
                                    <option value="Otro">Otro Estándar</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe el propósito de esta plantilla..."
                                />
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:col-start-2"
                                >
                                    {loading ? 'Creando...' : 'Crear Plantilla'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="mt-3 w-full sm:mt-0 sm:col-start-1"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
