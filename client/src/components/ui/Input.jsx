export default function Input({
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={[
        'w-full h-10 px-3 rounded-md text-sm',
        'bg-neutral-0 border',
        'placeholder:text-neutral-400 text-neutral-800',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-danger-500 focus:ring-danger-500'
          : 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
