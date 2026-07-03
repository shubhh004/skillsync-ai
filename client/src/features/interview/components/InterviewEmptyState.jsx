import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function InterviewEmptyState({ onAdd }) {
  return (
    <Card className="py-14">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-neutral-100 mb-4">
          <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-neutral-900">No interviews yet</h3>
        <p className="mt-1.5 text-sm text-neutral-500">
          Create your first mock interview to start practising.
        </p>
        <div className="mt-6">
          <Button onClick={onAdd}>Create First Interview</Button>
        </div>
      </div>
    </Card>
  );
}
