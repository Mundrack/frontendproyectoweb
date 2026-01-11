import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { comparisonsApi } from '@/api/endpoints/comparisons';
import { auditsApi } from '@/api/endpoints/audits';
import { Audit } from '@/types/audit.types';
import { CreateComparisonData } from '@/types/comparison.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';

export const CreateComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingAudits, setLoadingAudits] = useState(true);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateComparisonData>({
    name: '',
    description: '',
    audit_ids: [],
  });

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      setLoadingAudits(true);
      const data = await auditsApi.getAudits();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        // Filter only completed audits
        setAudits(data.filter((audit) => audit.status === 'completed'));
      } else if (data && typeof data === 'object' && 'results' in data) {
        const auditsArray = (data as any).results || [];
        setAudits(auditsArray.filter((audit: Audit) => audit.status === 'completed'));
      } else {
        setAudits([]);
      }
    } catch (err) {
      setError('Error al cargar las auditorías');
      setAudits([]);
    } finally {
      setLoadingAudits(false);
    }
  };

  const handleToggleAudit = (auditId: number) => {
    setFormData((prev) => {
      const isSelected = prev.audit_ids.includes(auditId);
      return {
        ...prev,
        audit_ids: isSelected
          ? prev.audit_ids.filter((id) => id !== auditId)
          : [...prev.audit_ids, auditId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setError('Por favor ingresa un nombre para la comparación');
      return;
    }

    if (formData.audit_ids.length < 2) {
      setError('Por favor selecciona al menos 2 auditorías para comparar');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await comparisonsApi.createComparison(formData);
      navigate('/comparisons');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear la comparación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/comparisons')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Comparación</h1>
          <p className="text-gray-600 mt-1">
            Selecciona las auditorías que deseas comparar
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Comparación"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Comparación Q1 vs Q2"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el propósito de esta comparación..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.audit_ids.length} auditorías seleccionadas
                </p>
                <p className="text-xs text-gray-500">
                  Mínimo 2 auditorías requeridas
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/comparisons')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || formData.audit_ids.length < 2}
                  className="flex-1"
                >
                  {loading ? 'Creando...' : 'Crear Comparación'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Audits List */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Auditorías Completadas
            </h3>

            {loadingAudits ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
              </div>
            ) : audits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No hay auditorías completadas disponibles</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/audits')}
                  className="mt-4"
                >
                  Ver Auditorías
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {audits.map((audit) => (
                  <label
                    key={audit.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.audit_ids.includes(audit.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.audit_ids.includes(audit.id)}
                      onChange={() => handleToggleAudit(audit.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">{audit.title}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{audit.company_name}</span>
                        {audit.branch_name && <span>• {audit.branch_name}</span>}
                        <span>
                          • {audit.score_percentage !== null ? `${audit.score_percentage}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
