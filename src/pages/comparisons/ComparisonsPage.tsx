import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3 } from 'lucide-react';
import { comparisonsApi } from '@/api/endpoints/comparisons';
import { Comparison } from '@/types/comparison.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/utils/formatters';

export const ComparisonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      const data = await comparisonsApi.getComparisons();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setComparisons(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setComparisons((data as any).results || []);
      } else {
        setComparisons([]);
      }
    } catch (err) {
      setError('Error al cargar las comparaciones');
      setComparisons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta comparación?')) return;

    try {
      await comparisonsApi.deleteComparison(id);
      loadComparisons();
    } catch (err) {
      setError('Error al eliminar la comparación');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comparaciones</h1>
          <p className="text-gray-600 mt-1">Compara múltiples auditorías y analiza tendencias</p>
        </div>
        <Button onClick={() => navigate('/comparisons/create')}>
          <Plus className="h-5 w-5 mr-2" />
          Nueva Comparación
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {comparisons.length === 0 ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="No hay comparaciones"
            description="Crea tu primera comparación para analizar múltiples auditorías"
            actionLabel="Crear Comparación"
            onAction={() => navigate('/comparisons/create')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((comparison) => (
            <Card key={comparison.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{comparison.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{comparison.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{comparison.audit_count} auditorías</span>
                  <span>{formatDate(comparison.created_at)}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => navigate(`/comparisons/${comparison.id}`)}
                  >
                    Ver Análisis
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(comparison.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
