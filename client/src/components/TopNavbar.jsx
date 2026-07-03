import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { useUser } from '../context/UserContext';
import UserAvatar from './ui/UserAvatar';

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
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

      {/* Search bar — command palette style */}
      <div className="relative hidden sm:block" style={{ width: '18rem' }}>
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          placeholder="Search anything..."
          readOnly
          aria-label="Search"
          className={[
            'w-full h-8 pl-8 pr-16 rounded-full text-sm',
            'glass border-0',
            'text-neutral-700 placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/40',
            'transition-all duration-200 cursor-pointer',
          ].join(' ')}
        />

        {/* ⌘K badge */}
        <kbd
          aria-label="Keyboard shortcut: Control K"
          className={[
            'absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none',
            'flex items-center gap-0.5 px-1.5 py-px',
            'text-[10px] font-medium text-neutral-500',
            'bg-neutral-200/30 border border-neutral-300/20 rounded-md',
          ].join(' ')}
        >
          <span>⌘</span><span>K</span>
        </kbd>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-neutral-500 hover:bg-white/10 hover:text-neutral-700 transition-all duration-200 focus-ring"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Unread dot */}
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full"
          />
        </button>

        {/* Profile avatar */}
        <Link
          to="/profile"
          aria-label="Your profile"
          className="ml-1 rounded-full ring-2 ring-transparent hover:ring-brand-500/50 transition-all duration-200 focus-ring"
        >
          <UserAvatar src={user?.avatar} name={user?.name} size="sm" />
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="ml-1 p-2 rounded-lg text-neutral-500 hover:bg-white/10 hover:text-danger-500 transition-all duration-200 focus-ring"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </header>
  );
}
