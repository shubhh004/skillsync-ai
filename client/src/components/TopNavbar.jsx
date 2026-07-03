import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { useUser } from '../context/UserContext';
import UserAvatar from './ui/UserAvatar';

export default function TopNavbar({ title, onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors duration-150"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors duration-150"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar — links to profile */}
        <Link
          to="/profile"
          aria-label="Your profile"
          className="ml-1 rounded-full ring-2 ring-transparent hover:ring-brand-500/50 transition-all duration-150 cursor-pointer"
          title="View profile"
        >
          <UserAvatar src={user?.avatar} name={user?.name} size="sm" />
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="ml-1 p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-danger-500 transition-colors duration-150"
          title="Log out"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </header>
  );
}
