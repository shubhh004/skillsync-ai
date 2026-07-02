import Button from '../../../components/ui/Button';

export default function DsaDeleteDialog({ problem, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-base font-semibold text-neutral-900 mb-2">Delete Problem</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-neutral-900">"{problem.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
