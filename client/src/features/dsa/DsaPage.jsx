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

// ─── Glass toast ──────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium animate-fade-slide-up"
      style={{
        background: isSuccess ? 'rgba(20,30,22,0.88)' : 'rgba(30,18,18,0.88)',
        backdropFilter: 'blur(20px)',
        border: isSuccess
          ? '1px solid rgba(34,197,94,0.28)'
          : '1px solid rgba(239,68,68,0.28)',
        boxShadow: isSuccess
          ? '0 0 0 1px rgba(34,197,94,0.1), 0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(34,197,94,0.12)'
          : '0 0 0 1px rgba(239,68,68,0.1), 0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(239,68,68,0.12)',
      }}
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
        style={{
          background: isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          color: isSuccess ? '#22c55e' : '#ef4444',
        }}
      >
        {isSuccess ? '✓' : '✕'}
      </span>
      <span style={{ color: isSuccess ? '#86efac' : '#fca5a5' }}>{toast.message}</span>
    </div>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 h-24 skeleton-shimmer rounded-2xl" />
        ))}
      </div>
      {/* Difficulty row */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 h-36 skeleton-shimmer rounded-2xl" />
        ))}
      </div>
      {/* Table skeleton */}
      <div className="card p-4 space-y-3 rounded-2xl">
        <div className="h-3 w-32 skeleton-shimmer rounded-full" />
        {[80, 95, 70, 88, 75].map((w, i) => (
          <div key={i} className="h-10 skeleton-shimmer rounded-xl" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function DsaPage() {
  const [problems, setProblems]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [modal, setModal]               = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);

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

  const openAdd    = () => { setEditTarget(null); setModal('add'); };
  const openEdit   = (p) => { setEditTarget(p);   setModal('edit'); };
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
      <div className="space-y-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Gradient code icon */}
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 55%, #4338ca 100%)',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.35), 0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none" style={{ color: '#e4e4e7' }}>DSA Tracker</h2>
              <p className="mt-1 text-xs leading-none" style={{ color: '#52525b' }}>
                Track and manage your practice problems
              </p>
            </div>
          </div>

          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>
            + Add Problem
          </Button>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <>
            <DsaProgressCards problems={problems} />

            <DsaFilterBar
              {...filters}
              onChange={handleFilterChange}
              onClear={handleClear}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Result count badge */}
            {hasActiveFilters && filteredProblems.length > 0 && (
              <div className="flex items-center gap-2 -mt-1">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: '#a5b4fc',
                  }}
                >
                  {filteredProblems.length} result{filteredProblems.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs" style={{ color: '#3f3f46' }}>
                  of {problems.length} problems
                </span>
              </div>
            )}

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
