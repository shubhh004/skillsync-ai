export default function Card({ children, className = '', padding = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-neutral-0 rounded-xl border border-neutral-200 shadow-sm',
        'transition-shadow duration-200',
        onClick ? 'hover:shadow-md cursor-pointer' : 'hover:shadow-md',
        padding ? 'p-6' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
