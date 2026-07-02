import { useState, useMemo, useCallback, useEffect } from 'react';
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

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${type === 'error' ? 'bg-danger-600' : 'bg-success-600'}`}>
      {message}
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

  const openAdd  = () => { setEditTarget(null); setModal('add'); };
  const openEdit = (job) => { setEditTarget(job); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  return (
    <DashboardLayout title="Job Applications">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Job Applications</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Track every application, status, and next step in one place.
            </p>
          </div>
          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>+ Add Job</Button>
        </div>

        <JobSummaryCards jobs={jobs} />

        <JobFilterBar
          {...filters}
          companies={companies}
          onChange={handleFilterChange}
          onClear={handleClear}
          hasActiveFilters={hasActiveFilters}
        />

        {hasActiveFilters && filteredJobs.length > 0 && (
          <p className="text-sm text-neutral-500 -mt-2">
            Showing <span className="font-medium text-neutral-700">{filteredJobs.length}</span> of{' '}
            <span className="font-medium text-neutral-700">{jobs.length}</span> applications
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-brand-600 animate-spin" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <JobTable jobs={filteredJobs} onEdit={openEdit} onDelete={setDeleteTarget} />
        ) : (
          <JobEmptyState hasFilters={hasActiveFilters} onClear={handleClear} onAdd={openAdd} />
        )}
      </div>

      {modal && (
        <JobModal
          mode={modal}
          initial={editTarget}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <JobDeleteDialog
          job={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
