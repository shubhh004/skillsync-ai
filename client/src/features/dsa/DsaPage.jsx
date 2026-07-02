import { useState, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import DsaProgressCards from './components/DsaProgressCards';
import DsaFilterBar from './components/DsaFilterBar';
import DsaProblemTable from './components/DsaProblemTable';
import DsaEmptyState from './components/DsaEmptyState';
import mockProblems from './mockProblems';

const EMPTY_FILTERS = { search: '', topic: '', difficulty: '', status: '' };

export default function DsaPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => setFilters(EMPTY_FILTERS);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const filteredProblems = useMemo(() => {
    return mockProblems.filter((p) => {
      const term = filters.search.toLowerCase();
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.topic.toLowerCase().includes(term) ||
        p.platform.toLowerCase().includes(term);
      const matchTopic      = !filters.topic      || p.topic      === filters.topic;
      const matchDifficulty = !filters.difficulty || p.difficulty === filters.difficulty;
      const matchStatus     = !filters.status     || p.status     === filters.status;
      return matchSearch && matchTopic && matchDifficulty && matchStatus;
    });
  }, [filters]);

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
          <Button size="sm" className="flex-shrink-0">
            + Add Problem
          </Button>
        </div>

        {/* Progress summary */}
        <DsaProgressCards problems={mockProblems} />

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
            <span className="font-medium text-neutral-700">{mockProblems.length}</span> problems
          </p>
        )}

        {/* Table or empty state */}
        {filteredProblems.length > 0 ? (
          <DsaProblemTable problems={filteredProblems} />
        ) : (
          <DsaEmptyState hasFilters={hasActiveFilters} onClear={handleClear} />
        )}
      </div>
    </DashboardLayout>
  );
}
