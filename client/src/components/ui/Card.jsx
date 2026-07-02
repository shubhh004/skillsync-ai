export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={[
        'bg-white rounded-xl border border-neutral-200 shadow-sm',
        padding ? 'p-6' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
