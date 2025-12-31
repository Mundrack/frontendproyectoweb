import React, { useState, useEffect } from 'react';
import { Plus, Building } from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Department, Branch, CreateDepartmentData } from '@/types/company.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { DepartmentList } from '@/components/departments/DepartmentList';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
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
      const [departmentsData, branchesData] = await Promise.all([
        companiesApi.getDepartments(),
        companiesApi.getBranches(),
      ]);

      // Handle both array and paginated responses
      const departmentsArray = Array.isArray(departmentsData) ? departmentsData : (departmentsData as any).results || [];
      const branchesArray = Array.isArray(branchesData) ? branchesData : (branchesData as any).results || [];

      setDepartments(departmentsArray);
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateDepartmentData) => {
    await companiesApi.createDepartment(data);
    createModal.close();
    loadData();
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    editModal.open();
  };

  const handleUpdate = async (data: CreateDepartmentData) => {
    if (selectedDepartment) {
      await companiesApi.updateDepartment(selectedDepartment.id, data);
      editModal.close();
      setSelectedDepartment(undefined);
      loadData();
    }
  };

  const handleDelete = (department: Department) => {
    confirmDialog.confirm(
      'Eliminar Departamento',
      `¿Estás seguro de eliminar "${department.name}"? Esta acción no se puede deshacer.`,
      () => confirmDelete(department.id)
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      await companiesApi.deleteDepartment(id);
      confirmDialog.close();
      loadData();
    } catch (err) {
      console.error('Error deleting department:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Departamentos</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los departamentos de tus empresas</p>
        </div>
        <Button onClick={createModal.open}>
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Departamento
        </Button>
      </div>

      {departments.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building}
            title="No hay departamentos registrados"
            description="Comienza creando tu primer departamento"
            actionLabel="Crear Primer Departamento"
            onAction={createModal.open}
          />
        </Card>
      ) : (
        <DepartmentList
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal Crear */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Nuevo Departamento">
        <DepartmentForm
          branches={branches}
          onSubmit={handleCreate}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Editar Departamento">
        <DepartmentForm
          department={selectedDepartment}
          branches={branches}
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
