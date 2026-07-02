export default function Label({ htmlFor, children, required = false, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={['block text-sm font-medium text-neutral-700 mb-1', className].join(' ')}
    >
      {children}
      {required && <span className="ml-1 text-danger-500" aria-hidden="true">*</span>}
    </label>
  );
}
