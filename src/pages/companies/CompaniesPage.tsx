import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2 } from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Company, CreateCompanyData } from '@/types/company.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { CompanyForm } from '@/components/companies/CompanyForm';
import { CompanyList } from '@/components/companies/CompanyList';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';
import { ROUTES } from '@/utils/constants';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createModal = useModal();
  const editModal = useModal();
  const confirmDialog = useConfirm();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesApi.getCompanies();
      console.log('📊 Datos recibidos del backend:', data);

      // Si el backend retorna un objeto paginado, extraer los resultados
      const companiesArray = Array.isArray(data) ? data : (data as any).results || [];
      setCompanies(companiesArray);
    } catch (err) {
      console.error('❌ Error cargando empresas:', err);
      setError('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateCompanyData) => {
    await companiesApi.createCompany(data);
    createModal.close();
    loadCompanies();
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    editModal.open();
  };

  const handleUpdate = async (data: CreateCompanyData) => {
    if (selectedCompany) {
      await companiesApi.updateCompany(selectedCompany.id, data);
      editModal.close();
      setSelectedCompany(undefined);
      loadCompanies();
    }
  };

  const handleDelete = (company: Company) => {
    confirmDialog.confirm(
      'Eliminar Empresa',
      `¿Estás seguro de eliminar "${company.name}"? Esta acción no se puede deshacer y eliminará todas las sucursales y departamentos asociados.`,
      () => confirmDelete(company.id)
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      await companiesApi.deleteCompany(id);
      confirmDialog.close();
      loadCompanies();
    } catch (err) {
      setError('Error al eliminar la empresa');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleView = (company: Company) => {
    navigate(`${ROUTES.COMPANIES}/${company.id}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus empresas y organizaciones</p>
        </div>
        <Button onClick={createModal.open}>
          <Plus className="h-5 w-5 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {companies.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="No hay empresas registradas"
            description="Comienza creando tu primera empresa para gestionar auditorías"
            actionLabel="Crear Primera Empresa"
            onAction={createModal.open}
          />
        </Card>
      ) : (
        <CompanyList
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Modal Crear */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Nueva Empresa">
        <CompanyForm onSubmit={handleCreate} onCancel={createModal.close} />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Editar Empresa">
        <CompanyForm
          company={selectedCompany}
          onSubmit={handleUpdate}
          onCancel={editModal.close}
        />
      </Modal>

      {/* Diálogo Confirmar */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant="danger"
        confirmText="Eliminar"
        isLoading={deleteLoading}
      />
    </div>
  );
};
