import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const actions = [
  {
    label: 'Add DSA Problem',
    description: 'Log a new practice problem',
    path: '/dsa',
    iconAccent: 'text-brand-400 bg-brand-50',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: 'Update Resume',
    description: 'Edit your latest resume draft',
    path: '/resume',
    iconAccent: 'text-success-700 bg-success-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Add Job Application',
    description: 'Track a new application',
    path: '/jobs',
    iconAccent: 'text-warning-700 bg-warning-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Start Mock Interview',
    description: 'Practice with AI-powered feedback',
    path: '/interview',
    iconAccent: 'text-danger-700 bg-danger-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <Card padding={false}>
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-200">
        {actions.map(({ label, description, path, icon, iconAccent }) => (
          <Link
            key={path}
            to={path}
            className="flex items-start gap-4 p-5 bg-neutral-0 hover:bg-neutral-100 transition-colors group"
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${iconAccent}`}>{icon}</div>
            <div>
              <p className="text-sm font-medium text-neutral-900 group-hover:text-brand-400 transition-colors">
                {label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
