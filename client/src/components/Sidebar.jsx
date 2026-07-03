import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import UserAvatar from './ui/UserAvatar';

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'DSA Tracker',
    path: '/dsa',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: 'Resume Builder',
    path: '/resume',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Job Applications',
    path: '/jobs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'AI Interviews',
    path: '/interview',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'AI Career Coach',
    path: '/career',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.711-1.379 2.711H4.177c-1.41 0-2.38-1.71-1.38-2.71L4 15.3" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 w-64 bg-neutral-100 border-r border-neutral-200 flex flex-col',
        'transform transition-transform duration-200 ease-in-out',
        'md:relative md:translate-x-0 md:inset-auto md:z-auto',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 flex-shrink-0">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="text-xl font-bold tracking-tight"
        >
          <span className="text-brand-500">SkillSync</span>
          <span className="text-neutral-700"> AI</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ label, path, icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-brand-50 text-brand-400'
                  : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900',
              ].join(' ')}
            >
              <span className={active ? 'text-brand-500' : 'text-neutral-400'}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="px-3 py-3 border-t border-neutral-200 flex-shrink-0">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors duration-150 group"
        >
          <UserAvatar src={user?.avatar} name={user?.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-brand-400 transition-colors duration-150">
              {user?.name || '—'}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user?.email || '—'}
            </p>
          </div>
          <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 group-hover:text-brand-400 transition-colors duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
