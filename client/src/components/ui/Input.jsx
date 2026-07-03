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
        'w-full h-10 px-3.5 rounded-xl text-sm',
        'bg-white/5 transition-all duration-200',
        'placeholder:text-neutral-400 text-neutral-800',
        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:bg-white/10',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        error
          ? 'border border-danger-500 focus:ring-danger-500/40 focus:border-danger-500'
          : 'border border-neutral-300 focus:border-brand-500 focus:ring-brand-500/40',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
