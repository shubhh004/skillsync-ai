import Button from '../../../components/ui/Button';

export default function InterviewEmptyState({ onAdd }) {
  return (
    <div className="card py-20">
      <div className="text-center max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-100/40 border border-danger-500/20 mb-5">
          <svg className="w-8 h-8 text-danger-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 mb-2">No interviews yet</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Create your first mock interview to start practising with AI feedback.
        </p>

        <div className="mt-7">
          <Button onClick={onAdd}>Create First Interview</Button>
        </div>
      </div>
    </div>
  );
}
