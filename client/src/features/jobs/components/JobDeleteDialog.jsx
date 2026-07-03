import Button from '../../../components/ui/Button';

export default function JobDeleteDialog({ job, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onCancel} aria-hidden="true" />

      <div className="modal-panel max-w-sm p-6">
        {/* Danger icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            boxShadow: '0 0 16px rgba(239,68,68,0.15)',
          }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-base font-semibold mb-2" style={{ color: '#e4e4e7' }}>
          Delete Application
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717a' }}>
          Are you sure you want to delete the application for{' '}
          <span className="font-semibold" style={{ color: '#a1a1aa' }}>"{job.role}"</span> at{' '}
          <span className="font-semibold" style={{ color: '#a1a1aa' }}>{job.company}</span>?
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
