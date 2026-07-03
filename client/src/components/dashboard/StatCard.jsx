import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const icons = {
  code: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  briefcase: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

export default function StatCard({ label, value, delta, positive = true, icon = 'code', to }) {
  const inner = (
    <Card className={to ? 'cursor-pointer hover:-translate-y-0.5 transition-transform duration-200' : ''}>
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-brand-50 text-brand-400">
          {icons[icon]}
        </div>
        <span
          className={[
            'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            positive ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700',
          ].join(' ')}
        >
          {positive ? '↑' : '↓'} {delta}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-neutral-900 leading-none">{value}</p>
        <p className="text-sm text-neutral-500 mt-2">{label}</p>
      </div>
    </Card>
  );

  if (to) return <Link to={to} className="block">{inner}</Link>;
  return inner;
}
