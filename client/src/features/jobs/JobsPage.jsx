import { useState, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import JobSummaryCards from './components/JobSummaryCards';
import JobFilterBar from './components/JobFilterBar';
import JobTable from './components/JobTable';
import JobEmptyState from './components/JobEmptyState';
import mockJobs from './mockJobs';

const EMPTY_FILTERS = { search: '', status: '', company: '' };

const companies = [...new Set(mockJobs.map((j) => j.company))].sort();

export default function JobsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear = () => setFilters(EMPTY_FILTERS);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((j) => {
      const term = filters.search.toLowerCase();
      const matchSearch =
        !term ||
        j.company.toLowerCase().includes(term) ||
        j.role.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term);
      const matchStatus  = !filters.status  || j.status  === filters.status;
      const matchCompany = !filters.company || j.company === filters.company;
      return matchSearch && matchStatus && matchCompany;
    });
  }, [filters]);

  return (
    <DashboardLayout title="Job Applications">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Job Applications</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Track every application, status, and next step in one place.
            </p>
          </div>
          <Button size="sm" className="flex-shrink-0">+ Add Job</Button>
        </div>

        {/* Summary cards */}
        <JobSummaryCards jobs={mockJobs} />

        {/* Filters */}
        <JobFilterBar
          {...filters}
          companies={companies}
          onChange={handleFilterChange}
          onClear={handleClear}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Result count */}
        {hasActiveFilters && filteredJobs.length > 0 && (
          <p className="text-sm text-neutral-500 -mt-2">
            Showing <span className="font-medium text-neutral-700">{filteredJobs.length}</span> of{' '}
            <span className="font-medium text-neutral-700">{mockJobs.length}</span> applications
          </p>
        )}

        {/* Table or empty state */}
        {filteredJobs.length > 0 ? (
          <JobTable jobs={filteredJobs} />
        ) : (
          <JobEmptyState hasFilters={hasActiveFilters} onClear={handleClear} />
        )}
      </div>
    </DashboardLayout>
  );
}
