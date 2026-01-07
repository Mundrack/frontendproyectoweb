import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { teamsApi } from '@/api/endpoints/teams';
import { Team } from '@/types/team.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { EmptyState } from '@/components/common/EmptyState';

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsApi.getTeams();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setTeams(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setTeams((data as any).results || []);
      } else {
        setTeams([]);
      }
    } catch (err) {
      setError('Error al cargar los equipos');
      setTeams([]);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los equipos y su estructura organizacional
          </p>
        </div>
        <Button onClick={() => alert('Funcionalidad próximamente')}>
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {teams.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No hay equipos"
            description="Crea tu primer equipo para organizar tu estructura"
            actionLabel="Crear Equipo"
            onAction={() => alert('Funcionalidad próximamente')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.department_detail.name}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      team.is_active
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {team.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium">{team.team_type_display}</p>
                  <p className="mt-1">{team.member_count} miembros</p>
                  {team.leader_detail && (
                    <p className="mt-1">Líder: {team.leader_detail.name}</p>
                  )}
                </div>

                {team.description && (
                  <p className="text-sm text-gray-700">{team.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
