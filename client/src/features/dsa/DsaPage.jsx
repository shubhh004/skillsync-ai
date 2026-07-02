import { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import DsaProgressCards from './components/DsaProgressCards';
import DsaFilterBar from './components/DsaFilterBar';
import DsaProblemTable from './components/DsaProblemTable';
import DsaEmptyState from './components/DsaEmptyState';
import DsaModal from './components/DsaModal';
import DsaDeleteDialog from './components/DsaDeleteDialog';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../../services/dsaService';

const EMPTY_FILTERS = { search: '', topic: '', difficulty: '', status: '' };

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
      toast.type === 'success'
        ? 'bg-success-100 text-success-700 border border-success-500/20'
        : 'bg-danger-100 text-danger-700 border border-danger-500/20'
    }`}>
      {toast.message}
    </div>
  );
}

export default function DsaPage() {
  const [problems, setProblems]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState(EMPTY_FILTERS);
  const [modal, setModal]           = useState(null);   // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProblems = useCallback(async () => {
    try {
      const data = await getProblems();
      setProblems(data);
    } catch {
      showToast('error', 'Failed to load problems.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear = () => setFilters(EMPTY_FILTERS);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const term = filters.search.toLowerCase();
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.topic.toLowerCase().includes(term) ||
        (p.platform || '').toLowerCase().includes(term);
      const matchTopic      = !filters.topic      || p.topic      === filters.topic;
      const matchDifficulty = !filters.difficulty || p.difficulty === filters.difficulty;
      const matchStatus     = !filters.status     || p.status     === filters.status;
      return matchSearch && matchTopic && matchDifficulty && matchStatus;
    });
  }, [problems, filters]);

  const openAdd  = () => { setEditTarget(null); setModal('add'); };
  const openEdit = (p) => { setEditTarget(p);   setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSave = async (form) => {
    if (modal === 'add') {
      const created = await createProblem(form);
      setProblems((prev) => [created, ...prev]);
      showToast('success', 'Problem added.');
    } else {
      const updated = await updateProblem(editTarget._id, form);
      setProblems((prev) => prev.map((p) => p._id === updated._id ? updated : p));
      showToast('success', 'Problem updated.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProblem(deleteTarget._id);
      setProblems((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showToast('success', 'Problem deleted.');
    } catch {
      showToast('error', 'Failed to delete problem.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout title="DSA Tracker">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">DSA Problems</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Track and manage your practice problems across topics and difficulty levels.
            </p>
          </div>
          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>
            + Add Problem
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Progress summary */}
            <DsaProgressCards problems={problems} />

            {/* Filters */}
            <DsaFilterBar
              {...filters}
              onChange={handleFilterChange}
              onClear={handleClear}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Result count */}
            {hasActiveFilters && filteredProblems.length > 0 && (
              <p className="text-sm text-neutral-500 -mt-2">
                Showing <span className="font-medium text-neutral-700">{filteredProblems.length}</span> of{' '}
                <span className="font-medium text-neutral-700">{problems.length}</span> problems
              </p>
            )}

            {/* Table or empty state */}
            {filteredProblems.length > 0 ? (
              <DsaProblemTable
                problems={filteredProblems}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ) : (
              <DsaEmptyState
                hasFilters={hasActiveFilters}
                onClear={handleClear}
                onAdd={openAdd}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <DsaModal
          mode={modal}
          initial={editTarget}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DsaDeleteDialog
          problem={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
