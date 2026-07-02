import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function DsaEmptyState({ hasFilters, onClear, onAdd }) {
  return (
    <Card className="py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-neutral-100 mb-4">
          <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-neutral-900">
          {hasFilters ? 'No problems match your filters' : 'No problems logged yet'}
        </h3>
        <p className="mt-1.5 text-sm text-neutral-500">
          {hasFilters
            ? "Try adjusting your search or filters to find what you're looking for."
            : 'Start tracking your DSA practice by adding your first problem.'}
        </p>
        <div className="mt-6">
          {hasFilters ? (
            <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          ) : (
            <Button onClick={onAdd}>Add First Problem</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
