const variantClasses = {
  default:     'card',
  interactive: 'card-interactive',
  elevated:    'card-elevated',
  glass:       'glass-card',
  subtle:      'card-subtle',
  brand:       'card-brand',
};

export default function Card({
  children,
  className = '',
  padding = true,
  variant = 'default',
  onClick,
}) {
  const base = variantClasses[variant] ?? variantClasses.default;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      className={[
        base,
        padding ? 'p-6' : '',
        onClick ? 'cursor-pointer hover:-translate-y-0.5 transition-all duration-200' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
