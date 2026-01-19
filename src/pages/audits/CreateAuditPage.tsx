import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auditsApi } from '@/api/endpoints/audits';
import { templatesApi } from '@/api/endpoints/templates';
import { companiesApi } from '@/api/endpoints/companies';
import { Template, CreateAuditData } from '@/types/audit.types';
import { Company, Branch } from '@/types/company.types';
import { User } from '@/types/auth.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Input } from '@/components/common/Input';

export const CreateAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedTemplateId = location.state?.templateId;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);


  const [employees, setEmployees] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateAuditData>({
    title: '',
    notes: '',
    template: preselectedTemplateId || 0,
    company: 0,
    branch: undefined,
    assigned_to: undefined,
    scheduled_date: undefined,
  });




  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.company) {
      loadBranches(formData.company);
    } else {
      setBranches([]);
    }
  }, [formData.company]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [templatesData, companiesData, employeesData] = await Promise.all([
        templatesApi.getActiveTemplates(),
        companiesApi.getCompanies(),
        companiesApi.getEmployees(),
      ]);

      // Handle paginated responses
      const templates = Array.isArray(templatesData)
        ? templatesData
        : (templatesData as any)?.results || [];
      const companies = Array.isArray(companiesData)
        ? companiesData
        : (companiesData as any)?.results || [];
      const employees = Array.isArray(employeesData)
        ? employeesData
        : (employeesData as any)?.results || [];

      setTemplates(templates);
      setCompanies(companies);
      setEmployees(employees);
    } catch (err) {
      setError('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async (companyId: number) => {
    try {
      const data = await companiesApi.getBranches(companyId);
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setBranches(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setBranches((data as any).results || []);
      } else {
        setBranches([]);
      }
    } catch (err) {
      console.error('Error loading branches:', err);
      setBranches([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.template || !formData.company || !formData.title || !formData.assigned_to) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    // Clean the data - remove undefined values and empty strings
    const cleanedData: any = {
      title: formData.title,
      template: formData.template,
      company: formData.company,
      assigned_to: formData.assigned_to,
    };

    if (formData.notes) {
      cleanedData.notes = formData.notes;
    }

    if (formData.branch) {
      cleanedData.branch = formData.branch;
    }

    if (formData.scheduled_date) {
      cleanedData.scheduled_date = formData.scheduled_date;
    }

    console.log('Submitting audit data:', cleanedData);

    try {
      setSubmitting(true);
      await auditsApi.createAudit(cleanedData);
      navigate('/audits');
    } catch (err: any) {
      console.error('Error creating audit:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.detail
        || (typeof err.response?.data === 'object' ? JSON.stringify(err.response?.data) : 'Error al crear la auditoría');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/audits')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Auditorías
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Auditoría</h1>
        <p className="text-gray-600 mt-1">Crea una auditoría basada en una plantilla</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Título de la Auditoría"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (Opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Agrega notas adicionales sobre esta auditoría..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plantilla *
              </label>
              <select
                value={formData.template}
                onChange={(e) =>
                  setFormData({ ...formData, template: Number(e.target.value) })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar plantilla</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <select
                value={formData.company}
                onChange={(e) => {
                  const companyId = Number(e.target.value);
                  setFormData({
                    ...formData,
                    company: companyId,
                    branch: undefined,
                  });
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal (Opcional)
              </label>
              <select
                value={formData.branch || ''}
                onChange={(e) => {
                  const branchId = e.target.value ? Number(e.target.value) : undefined;
                  setFormData({
                    ...formData,
                    branch: branchId,
                  });
                }}
                disabled={!formData.company || branches.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar sucursal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auditor Asignado *
              </label>
              <select
                value={formData.assigned_to || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigned_to: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar auditor</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} ({employee.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                type="date"
                label="Fecha Programada (Opcional)"
                value={formData.scheduled_date || ''}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value || undefined })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="ghost" onClick={() => navigate('/audits')} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear Auditoría'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
