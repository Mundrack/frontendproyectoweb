import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Plus } from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Company, Branch, CreateBranchData } from '@/types/company.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { BranchForm } from '@/components/branches/BranchForm';
import { BranchList } from '@/components/branches/BranchList';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ROUTES } from '@/utils/constants';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createModal = useModal();
  const editModal = useModal();
  const confirmDialog = useConfirm();

  useEffect(() => {
    if (id) {
      loadCompanyData();
    }
  }, [id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const [companyData, branchesData] = await Promise.all([
        companiesApi.getCompany(Number(id)),
        companiesApi.getBranches(Number(id)),
      ]);

      console.log('📊 Datos de sucursales:', branchesData);

      setCompany(companyData);
      // Si el backend retorna un objeto paginado, extraer los resultados
      const branchesArray = Array.isArray(branchesData) ? branchesData : (branchesData as any).results || [];
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateBranchData) => {
    await companiesApi.createBranch(data);
    createModal.close();
    loadCompanyData();
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    editModal.open();
  };

  const handleUpdate = async (data: CreateBranchData) => {
    if (selectedBranch) {
      await companiesApi.updateBranch(selectedBranch.id, data);
      editModal.close();
      setSelectedBranch(undefined);
      loadCompanyData();
    }
  };

  const handleDelete = (branch: Branch) => {
    confirmDialog.confirm(
      'Eliminar Sucursal',
      `¿Estás seguro de eliminar "${branch.name}"? Esta acción eliminará todos los departamentos asociados.`,
      () => confirmDelete(branch.id)
    );
  };

  const confirmDelete = async (branchId: number) => {
    try {
      setDeleteLoading(true);
      await companiesApi.deleteBranch(branchId);
      confirmDialog.close();
      loadCompanyData();
    } catch (err) {
      console.error('Error deleting branch:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!company) {
    return <div>Empresa no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.COMPANIES)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Empresas
        </Button>
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-100 rounded-lg">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              {company.description && (
                <p className="text-gray-600 mt-1">{company.description}</p>
              )}
              {company.address && (
                <p className="text-sm text-gray-500 mt-1">{company.address}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sucursales</h2>
          <p className="text-gray-600 mt-1">Gestiona las sucursales de {company.name}</p>
        </div>
        <Button onClick={createModal.open}>
          <Plus className="h-5 w-5 mr-2" />
          Nueva Sucursal
        </Button>
      </div>

      {branches.length === 0 ? (
        <Card>
          <EmptyState
            icon={MapPin}
            title="No hay sucursales registradas"
            description="Comienza creando la primera sucursal para esta empresa"
            actionLabel="Crear Primera Sucursal"
            onAction={createModal.open}
          />
        </Card>
      ) : (
        <BranchList branches={branches} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Modal Crear */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Nueva Sucursal">
        <BranchForm
          companies={[company]}
          defaultCompanyId={company.id}
          onSubmit={handleCreate}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Editar Sucursal">
        <BranchForm
          branch={selectedBranch}
          companies={[company]}
          defaultCompanyId={company.id}
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
