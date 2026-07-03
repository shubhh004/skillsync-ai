export default function Label({ htmlFor, children, required = false, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={['block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide', className].join(' ')}
    >
      {children}
      {required && (
        <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
      )}
    </label>
  );
}
