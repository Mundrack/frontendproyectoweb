import React, { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Branch, Company, CreateBranchData } from '@/types/company.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { BranchForm } from '@/components/branches/BranchForm';
import { BranchList } from '@/components/branches/BranchList';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';

export const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createModal = useModal();
  const editModal = useModal();
  const confirmDialog = useConfirm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [branchesData, companiesData] = await Promise.all([
        companiesApi.getBranches(),
        companiesApi.getCompanies(),
      ]);

      // Extraer arrays de objetos paginados si es necesario
      const branchesArray = Array.isArray(branchesData) ? branchesData : (branchesData as any).results || [];
      const companiesArray = Array.isArray(companiesData) ? companiesData : (companiesData as any).results || [];

      setBranches(branchesArray);
      setCompanies(companiesArray);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateBranchData) => {
    await companiesApi.createBranch(data);
    createModal.close();
    loadData();
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
      loadData();
    }
  };

  const handleDelete = (branch: Branch) => {
    confirmDialog.confirm(
      'Eliminar Sucursal',
      `¿Estás seguro de eliminar "${branch.name}"? Esta acción eliminará todos los departamentos asociados.`,
      () => confirmDelete(branch.id)
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      await companiesApi.deleteBranch(id);
      confirmDialog.close();
      loadData();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sucursales</h1>
          <p className="text-gray-600 mt-1">Gestiona todas las sucursales de tus empresas</p>
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
            description="Comienza creando tu primera sucursal"
            actionLabel="Crear Primera Sucursal"
            onAction={createModal.open}
          />
        </Card>
      ) : (
        <BranchList branches={branches} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Modal Crear */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Nueva Sucursal">
        <BranchForm companies={companies} onSubmit={handleCreate} onCancel={createModal.close} />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Editar Sucursal">
        <BranchForm
          branch={selectedBranch}
          companies={companies}
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
