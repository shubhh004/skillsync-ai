const variants = {
  primary:   'bg-brand-500 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus-visible:ring-neutral-500',
  danger:    'bg-danger-500 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
  ghost:     'bg-transparent text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-neutral-500',
  outline:   'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-200 hover:border-neutral-400 focus-visible:ring-neutral-500',
};

const sizes = {
  sm: 'h-8  px-3 text-sm  gap-1.5',
  md: 'h-10 px-4 text-sm  gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
        'disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
