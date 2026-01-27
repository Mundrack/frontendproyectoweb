import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { CreateTeamData } from '@/types/team.types';
import { Company, Branch, Department } from '@/types/company.types';

import { companiesApi } from '@/api/endpoints/companies';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamData) => Promise<void>;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    department: 0,
    team_type: 'miembro_equipo',
    leader: undefined,
    description: '',
    is_active: true,
  });

  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCompany) {
      loadBranches(selectedCompany);
    } else {
      setBranches([]);
      setDepartments([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedBranch) {
      loadDepartments(selectedBranch);
    } else {
      setDepartments([]);
    }
  }, [selectedBranch]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const companiesData = await companiesApi.getCompanies();
      const companiesArray = Array.isArray(companiesData)
        ? companiesData
        : (companiesData as any)?.results || [];
      setCompanies(companiesArray);
    } catch (err) {
      setError('Error al cargar datos iniciales');
    } finally {
      setLoadingData(false);
    }
  };

  const loadBranches = async (companyId: number) => {
    try {
      const data = await companiesApi.getBranches(companyId);
      const branchesArray = Array.isArray(data) ? data : (data as any)?.results || [];
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading branches:', err);
      setBranches([]);
    }
  };

  const loadDepartments = async (branchId: number) => {
    try {
      console.log('🔄 Cargando departamentos para branch:', branchId);
      const data = await companiesApi.getDepartments(branchId);
      console.log('📦 Departamentos respuesta:', data);

      const departmentsArray = Array.isArray(data) ? data : (data as any)?.results || [];
      console.log('✅ Departamentos procesados:', departmentsArray);

      setDepartments(departmentsArray);
    } catch (err) {
      console.error('❌ Error loading departments:', err);
      setDepartments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.department) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      department: 0,
      team_type: 'miembro_equipo',
      leader: undefined,
      description: '',
      is_active: true,
    });
    setSelectedCompany(0);
    setSelectedBranch(0);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Equipo</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Nombre del Equipo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Equipo de Auditoría"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecciona una empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal *
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(Number(e.target.value))}
                required
                disabled={!selectedCompany || branches.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona una sucursal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              {selectedBranch && departments.length === 0 ? (
                <div className="bg-warning-50 border border-warning-200 text-warning-800 px-3 py-2 rounded text-sm mb-2">
                  <p className="mb-2">No hay departamentos en esta sucursal. Debes crear un departamento antes de crear un equipo.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      navigate(`/branches/${selectedBranch}`);
                    }}
                    className="w-full justify-center bg-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ir a gestionar sucursal
                  </Button>
                </div>
              ) : (
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: Number(e.target.value) })}
                  required
                  disabled={!selectedBranch || departments.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {departments.length === 0 ? 'No hay departamentos disponibles' : 'Selecciona un departamento'}
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Equipo *
              </label>
              <select
                value={formData.team_type}
                onChange={(e) => setFormData({ ...formData, team_type: e.target.value as any })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="miembro_equipo">Equipo de Miembros</option>
                <option value="manager_equipo">Equipo de Managers</option>
                <option value="gerente_general">Gerencia General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe las responsabilidades del equipo..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Equipo activo
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creando...' : 'Crear Equipo'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
