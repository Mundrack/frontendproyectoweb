import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { recommendationsApi } from '@/api/endpoints/recommendations';
import { Recommendation } from '@/types/recommendation.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationsApi.getRecommendations();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setRecommendations((data as any).results || []);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      setError('Error al cargar las recomendaciones');
      setRecommendations([]);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recomendaciones</h1>
        <p className="text-gray-600 mt-1">
          Gestiona recomendaciones automáticas y manuales para mejorar tus auditorías
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {recommendations.length === 0 ? (
        <Card>
          <EmptyState
            icon={Lightbulb}
            title="No hay recomendaciones"
            description="Las recomendaciones se generan automáticamente al completar auditorías"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      rec.priority === 'high'
                        ? 'bg-danger-100 text-danger-700'
                        : rec.priority === 'medium'
                        ? 'bg-warning-100 text-warning-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  {rec.is_auto_generated && (
                    <span className="text-xs text-primary-600">Automática</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                <p className="text-sm text-gray-700">{rec.recommendation_text}</p>
                <p className="text-xs text-gray-500">{rec.audit_title}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
