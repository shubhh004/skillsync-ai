import { motion } from 'framer-motion';

const variantClasses = {
  default:     'card',
  interactive: 'card-interactive',
  elevated:    'card-elevated',
  glass:       'glass-card',
  subtle:      'card-subtle',
  brand:       'card-brand',
};

const hoverLift = {
  default:     { y: -2 },
  interactive: { y: -4 },
  elevated:    { y: -3 },
  glass:       { y: -3 },
  subtle:      { y: -2 },
  brand:       { y: -3 },
};

export default function Card({
  children,
  className = '',
  padding = true,
  variant = 'default',
  onClick,
}) {
  const base   = variantClasses[variant] ?? variantClasses.default;
  const isClickable = Boolean(onClick);

  return (
    <motion.div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      whileHover={{ ...(hoverLift[variant] ?? hoverLift.default), transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] } }}
      whileTap={isClickable ? { scale: 0.99, transition: { duration: 0.1 } } : undefined}
      className={[
        base,
        padding ? 'p-6' : '',
        isClickable ? 'cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </motion.div>
  );
}
