import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { auditsApi } from '@/api/endpoints/audits';
import { Audit } from '@/types/audit.types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { AuditCard } from '@/components/audits/AuditCard';
import { useConfirm } from '@/hooks/useConfirm';

export const AuditsPage: React.FC = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDialog = useConfirm();

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const data = await auditsApi.getAudits();
      // Handle paginated response from Django REST Framework
      if (Array.isArray(data)) {
        setAudits(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        setAudits((data as any).results || []);
      } else {
        setAudits([]);
      }
    } catch (err) {
      setError('Error al cargar las auditorías');
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (audit: Audit) => {
    try {
      await auditsApi.startAudit(audit.id);
      navigate(`/audits/${audit.id}/execute`);
    } catch (err) {
      setError('Error al iniciar la auditoría');
    }
  };

  const handleContinue = (audit: Audit) => {
    navigate(`/audits/${audit.id}/execute`);
  };

  const handleView = (audit: Audit) => {
    navigate(`/audits/${audit.id}/report`);
  };

  const handleDelete = (audit: Audit) => {
    confirmDialog.confirm(
      'Eliminar Auditoría',
      `¿Estás seguro de eliminar "${audit.title}"? Esta acción no se puede deshacer.`,
      () => confirmDelete(audit.id)
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      await auditsApi.deleteAudit(id);
      confirmDialog.close();
      loadAudits();
    } catch (err) {
      setError('Error al eliminar la auditoría');
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
          <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
          <p className="text-gray-600 mt-1">Gestiona y ejecuta tus auditorías</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/templates')}>
            Ver Plantillas
          </Button>
          <Button onClick={() => navigate('/audits/create')}>
            <Plus className="h-5 w-5 mr-2" />
            Nueva Auditoría
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {audits.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No hay auditorías registradas"
            description="Comienza creando tu primera auditoría desde una plantilla"
            actionLabel="Crear Primera Auditoría"
            onAction={() => navigate('/audits/create')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <AuditCard
              key={audit.id}
              audit={audit}
              onStart={handleStart}
              onContinue={handleContinue}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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
