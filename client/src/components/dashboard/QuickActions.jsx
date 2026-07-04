import { Link } from 'react-router-dom';

const actions = [
  {
    label:       'Add DSA Problem',
    description: 'Log a new practice problem',
    path:        '/dsa',
    iconStyle:   { background: 'rgba(108,92,255,0.12)', border: '1px solid rgba(108,92,255,0.22)' },
    iconColor:   '#a78bfa',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label:       'Update Resume',
    description: 'Edit your latest resume draft',
    path:        '/resume',
    iconStyle:   { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' },
    iconColor:   '#86efac',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label:       'Add Job Application',
    description: 'Track a new application',
    path:        '/jobs',
    iconStyle:   { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' },
    iconColor:   '#fcd34d',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label:       'Start Mock Interview',
    description: 'Practice with AI-powered feedback',
    path:        '/interview',
    iconStyle:   { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' },
    iconColor:   '#d8b4fe',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">Quick Actions</h3>
      </div>

      {/* 2×2 action grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {actions.map(({ label, description, path, icon, iconStyle, iconColor }, i) => (
          <Link
            key={path}
            to={path}
            className="flex items-start gap-4 p-5 bg-transparent hover:bg-white/5 transition-all duration-200 group"
            style={{
              borderBottom: i < actions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : undefined,
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={iconStyle}>
              <span style={{ color: iconColor }}>{icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-800 group-hover:text-brand-400 transition-colors duration-200">
                {label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
