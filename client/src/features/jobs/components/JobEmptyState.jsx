import Button from '../../../components/ui/Button';

export default function JobEmptyState({ hasFilters, onClear, onAdd }) {
  return (
    <div className="card py-20">
      <div className="text-center max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning-100/40 border border-warning-500/20 mb-5">
          <svg className="w-8 h-8 text-warning-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 mb-2">
          {hasFilters ? 'No applications match your filters' : 'No applications yet'}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          {hasFilters
            ? 'Try adjusting your search or filters.'
            : 'Start tracking your job applications by adding your first one.'}
        </p>

        <div className="mt-7">
          {hasFilters ? (
            <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          ) : (
            <Button onClick={onAdd}>Add First Application</Button>
          )}
        </div>
      </div>
    </div>
  );
}
