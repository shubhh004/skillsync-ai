import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div
      className="card-interactive p-6 group"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl gradient-brand-subtle flex items-center justify-center flex-shrink-0 border border-brand-200/30">
          <span className="text-brand-400">{icons[icon]}</span>
        </div>

        {/* Delta badge */}
        {delta !== undefined && (
          <span className={[
            'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
            positive
              ? 'bg-success-100/60 text-success-700 border border-success-500/20'
              : 'bg-danger-100/60  text-danger-700  border border-danger-500/20',
          ].join(' ')}>
            {positive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-neutral-900 leading-none tracking-tight">{value}</p>
        <p className="text-sm text-neutral-500 mt-1.5 group-hover:text-neutral-600 transition-colors duration-200">
          {label}
        </p>
      </div>
    </motion.div>
  );

  if (to) return <Link to={to} className="block">{inner}</Link>;
  return inner;
}
