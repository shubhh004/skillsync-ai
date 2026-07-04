import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard',        subtitle: 'Track your placement journey'     },
  '/dsa':       { title: 'DSA Tracker',       subtitle: 'Practice coding problems'          },
  '/resume':    { title: 'Resume Builder',    subtitle: 'Build an ATS-friendly resume'      },
  '/jobs':      { title: 'Job Applications',  subtitle: 'Manage your applications'          },
  '/interview': { title: 'AI Interviews',     subtitle: 'Prepare with mock interviews'      },
  '/career':    { title: 'AI Career Coach',   subtitle: 'AI-powered guidance'               },
  '/profile':   { title: 'Profile',           subtitle: 'Manage your personal information'  },
};

function usePageMeta() {
  const { pathname } = useLocation();
  const entry = Object.entries(PAGE_META).find(
    ([path]) => pathname === path || pathname.startsWith(path + '/')
  );
  return entry?.[1] ?? { title: 'SkillSync AI', subtitle: 'AI-powered placement platform' };
}

export default function TopNavbar({ onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef(null);
  const meta    = usePageMeta();

  return (
    <>
      <header className="glass-surface rounded-2xl px-4 flex items-center gap-3 flex-shrink-0 h-14">

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-white/10 hover:text-neutral-700 transition-all duration-200 flex-shrink-0 focus-ring"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title + subtitle */}
        <div className="hidden sm:block min-w-0 flex-1">
          <p
            className="text-sm font-semibold leading-tight truncate"
            style={{ color: '#f1f1f3' }}
          >
            {meta.title}
          </p>
          <p
            className="text-[11px] leading-tight mt-0.5 truncate"
            style={{ color: '#52525b' }}
          >
            {meta.subtitle}
          </p>
        </div>

        {/* On mobile the title is hidden — spacer still pushes bell right */}
        <div className="sm:hidden flex-1" />

        {/* Notifications */}
        <button
          ref={bellRef}
          type="button"
          aria-label="Notifications"
          aria-expanded={notifOpen}
          aria-haspopup="dialog"
          onClick={() => setNotifOpen((o) => !o)}
          className="relative p-2 rounded-lg text-neutral-500 hover:bg-white/10 hover:text-neutral-700 transition-all duration-200 focus-ring flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full"
          />
        </button>
      </header>

      <NotificationDropdown
        anchorRef={bellRef}
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </>
  );
}
