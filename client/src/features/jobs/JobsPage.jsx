import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import JobSummaryCards from './components/JobSummaryCards';
import JobFilterBar from './components/JobFilterBar';
import JobTable from './components/JobTable';
import JobEmptyState from './components/JobEmptyState';
import JobModal from './components/JobModal';
import JobDeleteDialog from './components/JobDeleteDialog';
import { getJobs, createJob, updateJob, deleteJob } from '../../services/jobService';

const EMPTY_FILTERS = { search: '', status: '', company: '' };

// ─── Glass toast ──────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const isSuccess = toast?.type !== 'error';
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message + toast.type}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.15 } }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{
            background: isSuccess ? 'rgba(20,30,22,0.88)' : 'rgba(30,18,18,0.88)',
            backdropFilter: 'blur(20px)',
            border: isSuccess ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(239,68,68,0.28)',
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <div key={i} className="card h-28 skeleton-shimmer rounded-2xl" />)}
      </div>
      <div className="card h-12 skeleton-shimmer rounded-2xl" />
      <div className="card p-4 space-y-3 rounded-2xl">
        <div className="h-3 w-40 skeleton-shimmer rounded-full" />
        {[90, 80, 95, 70, 85].map((w, i) => (
          <div key={i} className="h-12 skeleton-shimmer rounded-xl" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filters, setFilters]         = useState(EMPTY_FILTERS);
  const [modal, setModal]             = useState(null);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    getJobs()
      .then(setJobs)
      .catch(() => showToast('Failed to load applications.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear = () => setFilters(EMPTY_FILTERS);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const companies = useMemo(() => [...new Set(jobs.map((j) => j.company))].sort(), [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const term = filters.search.toLowerCase();
      const matchSearch =
        !term ||
        j.company.toLowerCase().includes(term) ||
        j.role.toLowerCase().includes(term) ||
        (j.location || '').toLowerCase().includes(term);
      const matchStatus  = !filters.status  || j.status  === filters.status;
      const matchCompany = !filters.company || j.company === filters.company;
      return matchSearch && matchStatus && matchCompany;
    });
  }, [jobs, filters]);

  const handleSave = async (form) => {
    if (modal === 'add') {
      const created = await createJob(form);
      setJobs((prev) => [created, ...prev]);
      showToast('Application added.');
    } else {
      const updated = await updateJob(editTarget._id, form);
      setJobs((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
      showToast('Application updated.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(deleteTarget._id);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      showToast('Application deleted.');
    } catch {
      showToast('Failed to delete application.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAdd    = () => { setEditTarget(null); setModal('add'); };
  const openEdit   = (job) => { setEditTarget(job); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  return (
    <DashboardLayout title="Job Applications">
      <div className="space-y-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Gradient briefcase icon */}
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 55%, #4338ca 100%)',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.35), 0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none" style={{ color: '#e4e4e7' }}>Job Applications</h2>
              <p className="mt-1 text-xs leading-none" style={{ color: '#52525b' }}>
                Track every application, status, and next step
              </p>
            </div>
          </div>

          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>+ Add Job</Button>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {loading ? (
          <PageSkeleton />
        ) : (
          <>
            <JobSummaryCards jobs={jobs} />

            <JobFilterBar
              {...filters}
              companies={companies}
              onChange={handleFilterChange}
              onClear={handleClear}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Result count badge */}
            {hasActiveFilters && filteredJobs.length > 0 && (
              <div className="flex items-center gap-2 -mt-1">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}
                >
                  {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs" style={{ color: '#3f3f46' }}>of {jobs.length} applications</span>
              </div>
            )}

            {filteredJobs.length > 0 ? (
              <JobTable jobs={filteredJobs} onEdit={openEdit} onDelete={setDeleteTarget} />
            ) : (
              <JobEmptyState hasFilters={hasActiveFilters} onClear={handleClear} onAdd={openAdd} />
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <JobModal key="job-modal" mode={modal} initial={editTarget} onClose={closeModal} onSave={handleSave} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <JobDeleteDialog key="job-delete" job={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
