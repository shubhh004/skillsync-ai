import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function JobEmptyState({ hasFilters, onClear }) {
  return (
    <Card className="py-14">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-neutral-100 mb-4">
          <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-neutral-900">
          {hasFilters ? 'No applications match your filters' : 'No applications yet'}
        </h3>
        <p className="mt-1.5 text-sm text-neutral-500">
          {hasFilters
            ? 'Try adjusting your search or filters.'
            : 'Start tracking your job applications by adding your first one.'}
        </p>
        <div className="mt-6">
          {hasFilters ? (
            <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          ) : (
            <Button>Add First Application</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
