import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import UserAvatar from './ui/UserAvatar';
import { sidebarNavContainer, sidebarNavItem } from '../motion/variants';

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'DSA Tracker',
    path: '/dsa',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: 'Resume Builder',
    path: '/resume',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Job Applications',
    path: '/jobs',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'AI Interviews',
    path: '/interview',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'AI Career Coach',
    path: '/career',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        'flex flex-col glass-surface rounded-3xl w-72 flex-shrink-0',
        'fixed inset-y-3 left-3 z-50',
        'md:static md:inset-auto md:z-auto',
        'transition-transform duration-300 ease-out-quart',
        open ? 'translate-x-0' : '-translate-x-[calc(100%+0.75rem)] md:translate-x-0',
      ].join(' ')}
    >
      {/* ── Brand area ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="px-5 pt-6 pb-5 flex-shrink-0"
      >
        <Link
          to="/dashboard"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl p-1 -m-1 focus-ring"
        >
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '1.125rem', height: '1.125rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-900 leading-tight tracking-tight">
              SkillSync{' '}
              <span className="text-gradient-brand">AI</span>
            </p>
            <p className="text-label-sm mt-0.5">AI Career Platform</p>
          </div>
        </Link>
      </motion.div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/5 flex-shrink-0" />

      {/* ── Navigation — staggered on mount ── */}
      <motion.nav
        variants={sidebarNavContainer}
        initial="hidden"
        animate="show"
        className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hidden space-y-0.5"
      >
        <p className="px-3 mb-2 text-label-sm">Navigation</p>

        {navItems.map(({ label, path, icon }) => {
          const active = pathname === path || pathname.startsWith(path + '/');
          return (
            <motion.div key={path} variants={sidebarNavItem}>
              <Link
                to={path}
                onClick={onClose}
                className={[
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-200 ease-smooth focus-ring',
                  active
                    ? 'glass-brand text-brand-400 shadow-glow-sm'
                    : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-700',
                ].join(' ')}
              >
                {/* Active left accent */}
                {active && (
                  <motion.span
                    layoutId="nav-accent"
                    aria-hidden="true"
                    className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-brand-500"
                    transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                  />
                )}

                <span className={[
                  'transition-colors duration-200',
                  active ? 'text-brand-400' : 'text-neutral-400',
                ].join(' ')}>
                  {icon}
                </span>

                {label}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/5 flex-shrink-0" />

      {/* ── Profile card ── */}
      <motion.div
        className="p-3 flex-shrink-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1], delay: 0.35 }}
      >
        <Link
          to="/profile"
          onClick={onClose}
          className="glass-card flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:shadow-card-hover hover:-translate-y-px group focus-ring"
        >
          <div className="relative flex-shrink-0">
            <UserAvatar src={user?.avatar} name={user?.name} size="md" />
            <span
              aria-label="Online"
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-neutral-0"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-brand-400 transition-colors duration-200">
              {user?.name || '—'}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user?.email || '—'}
            </p>
          </div>

          <svg
            className="w-4 h-4 text-neutral-400 flex-shrink-0 group-hover:text-brand-400 transition-colors duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </aside>
  );
}
