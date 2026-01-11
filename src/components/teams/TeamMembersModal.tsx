import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, UserCog } from 'lucide-react';
import { Team, TeamMember } from '@/types/team.types';
import { User } from '@/types/auth.types';
import { teamsApi } from '@/api/endpoints/teams';
import { companiesApi } from '@/api/endpoints/companies';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onUpdate: () => void;
}

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<'leader' | 'member'>('member');
  const [error, setError] = useState('');
  const [teamDetail, setTeamDetail] = useState<Team | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTeamDetail();
      loadEmployees();
    }
  }, [isOpen, team.id]);

  const loadTeamDetail = async () => {
    try {
      const data = await teamsApi.getTeam(team.id);
      setTeamDetail(data);
    } catch (err) {
      console.error('Error loading team detail:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      // Get all employees available to the owner
      const data = await companiesApi.getEmployees();
      const employeesArray = Array.isArray(data) ? data : (data as any)?.results || [];
      setEmployees(employeesArray);
    } catch (err) {
      console.error('Error loading employees:', err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      setError('Por favor selecciona un empleado');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await teamsApi.addMember(team.id, selectedEmployee, selectedRole);
      setSelectedEmployee(0);
      setSelectedRole('member');
      await loadTeamDetail();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al agregar el miembro');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm('¿Estás seguro de remover este miembro del equipo?')) {
      return;
    }

    try {
      await teamsApi.removeMember(team.id, userId);
      await loadTeamDetail();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al remover el miembro');
    }
  };

  const handleChangeRole = async (userId: number, newRole: 'leader' | 'member') => {
    try {
      await teamsApi.changeMemberRole(team.id, userId, newRole);
      await loadTeamDetail();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cambiar el rol');
    }
  };

  if (!isOpen) return null;

  const availableEmployees = employees.filter(
    (emp) => !teamDetail?.members_detail?.some((member) => member.user === emp.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestionar Miembros</h2>
            <p className="text-sm text-gray-600">{team.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Add Member Form */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Miembro</h3>
            {loadingEmployees ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empleado *
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un empleado</option>
                      {availableEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as 'leader' | 'member')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="member">Miembro</option>
                      <option value="leader">Líder</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" disabled={loading || !selectedEmployee}>
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? 'Agregando...' : 'Agregar Miembro'}
                </Button>
              </form>
            )}
          </div>

          {/* Current Members List */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Miembros Actuales ({teamDetail?.member_count || 0})
            </h3>

            {!teamDetail ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            ) : teamDetail.members_detail && teamDetail.members_detail.length > 0 ? (
              <div className="space-y-3">
                {teamDetail.members_detail.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.user_name}</p>
                      <p className="text-sm text-gray-600">{member.user_email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleChangeRole(member.user, e.target.value as 'leader' | 'member')
                        }
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="member">Miembro</option>
                        <option value="leader">Líder</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.user)}
                        className="text-error-600 hover:text-error-700 p-1"
                        title="Remover miembro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay miembros asignados aún
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
