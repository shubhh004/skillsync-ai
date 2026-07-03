import Button from '../../../components/ui/Button';

export default function DsaDeleteDialog({ problem, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onCancel} aria-hidden="true" />

      <div className="modal-panel max-w-sm p-6">
        {/* Danger icon */}
        <div className="w-10 h-10 rounded-xl bg-danger-100/60 border border-danger-500/20 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-danger-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-neutral-900 mb-2">Delete Problem</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-neutral-800">"{problem.title}"</span>?
          {' '}This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
