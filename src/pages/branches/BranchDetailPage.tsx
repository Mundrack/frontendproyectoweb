import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Plus, MapPin } from 'lucide-react';
import { companiesApi } from '@/api/endpoints/companies';
import { Branch, Department, CreateDepartmentData } from '@/types/company.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { DepartmentList } from '@/components/departments/DepartmentList';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export const BranchDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const createModal = useModal();
    const editModal = useModal();
    const confirmDialog = useConfirm();

    useEffect(() => {
        if (id) {
            loadBranchData();
        }
    }, [id]);

    const loadBranchData = async () => {
        try {
            setLoading(true);
            const [branchData, departmentsData] = await Promise.all([
                companiesApi.getBranch(Number(id)),
                companiesApi.getDepartments(Number(id)),
            ]);

            setBranch(branchData);
            const depsArray = Array.isArray(departmentsData) ? departmentsData : (departmentsData as any).results || [];
            setDepartments(depsArray);
        } catch (err) {
            console.error('Error loading branch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateDepartmentData) => {
        await companiesApi.createDepartment(data);
        createModal.close();
        loadBranchData();
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
            loadBranchData();
        }
    };

    const handleDelete = (department: Department) => {
        confirmDialog.confirm(
            'Eliminar Departamento',
            `¿Estás seguro de eliminar "${department.name}"?`,
            () => confirmDelete(department.id)
        );
    };

    const confirmDelete = async (departmentId: number) => {
        try {
            setDeleteLoading(true);
            await companiesApi.deleteDepartment(departmentId);
            confirmDialog.close();
            loadBranchData();
        } catch (err) {
            console.error('Error deleting department:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleBack = () => {
        if (branch) {
            navigate(`/companies/${branch.company}`);
        } else {
            navigate('/companies');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!branch) {
        return <div>Sucursal no encontrada</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Empresa
                </Button>
            </div>

            <Card>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary-100 rounded-lg">
                            <Building2 className="h-8 w-8 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{branch.name}</h1>
                            <p className="text-gray-600 mt-1">{branch.company_name}</p>
                            {branch.address && (
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {branch.address}
                                </div>
                            )}
                            {branch.phone && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Tel: {branch.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Departamentos</h2>
                    <p className="text-gray-600 mt-1">Gestiona los departamentos de {branch.name}</p>
                </div>
                <Button onClick={createModal.open}>
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Departamento
                </Button>
            </div>

            {departments.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Building2}
                        title="No hay departamentos registrados"
                        description="Comienza creando el primer departamento para esta sucursal"
                        actionLabel="Crear Primer Departamento"
                        onAction={createModal.open}
                    />
                </Card>
            ) : (
                <DepartmentList departments={departments} onEdit={handleEdit} onDelete={handleDelete} />
            )}

            {/* Modal Crear */}
            <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Nuevo Departamento">
                <DepartmentForm
                    branches={[branch]}
                    defaultBranchId={branch.id}
                    onSubmit={handleCreate}
                    onCancel={createModal.close}
                />
            </Modal>

            {/* Modal Editar */}
            <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Editar Departamento">
                <DepartmentForm
                    department={selectedDepartment}
                    branches={[branch]}
                    defaultBranchId={branch.id}
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
