const variants = {
  primary:   'gradient-brand text-white shadow-glow-sm hover:shadow-glow hover:-translate-y-px active:translate-y-0',
  secondary: 'glass-surface text-neutral-700 hover:text-neutral-900 hover:bg-white/10',
  outline:   'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-white/10 hover:border-neutral-400',
  ghost:     'bg-transparent text-neutral-500 hover:bg-white/10 hover:text-neutral-700',
  danger:    'bg-danger-500 text-white shadow-sm hover:bg-danger-700 hover:-translate-y-px active:translate-y-0',
  success:   'bg-success-500 text-white shadow-sm hover:bg-success-700 hover:-translate-y-px active:translate-y-0',
};

const sizes = {
  sm: 'h-8  px-4  text-xs  gap-1.5',
  md: 'h-10 px-5  text-sm  gap-2',
  lg: 'h-12 px-6  text-base gap-2.5',
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0"
    />
  );
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-full',
        'transition-all duration-200 ease-smooth',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50',
        'disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
