import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'dsa',
    title: 'Daily DSA streak',
    body: 'You solved 3 problems today. Keep it up!',
    time: '2 min ago',
    read: false,
    iconPath: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
    iconColor: '#818cf8',
    iconBg: 'rgba(99,102,241,0.12)',
  },
  {
    id: 2,
    type: 'interview',
    title: 'Interview score updated',
    body: 'Your mock interview scored 82/100. View feedback.',
    time: '1 hr ago',
    read: false,
    iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    iconColor: '#4ade80',
    iconBg: 'rgba(34,197,94,0.10)',
  },
  {
    id: 3,
    type: 'resume',
    title: 'Resume tip',
    body: 'Add quantifiable achievements to strengthen your resume.',
    time: '3 hr ago',
    read: false,
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconColor: '#fbbf24',
    iconBg: 'rgba(245,158,11,0.10)',
  },
  {
    id: 4,
    type: 'jobs',
    title: 'Application status',
    body: 'Google SWE application moved to "Interview" stage.',
    time: 'Yesterday',
    read: true,
    iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconColor: '#f87171',
    iconBg: 'rgba(239,68,68,0.10)',
  },
  {
    id: 5,
    type: 'career',
    title: 'Roadmap ready',
    body: 'Your AI-generated career roadmap for SDE-2 is ready.',
    time: '2 days ago',
    read: true,
    iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
    iconColor: '#818cf8',
    iconBg: 'rgba(99,102,241,0.12)',
  },
];

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.13 } },
};

export default function NotificationDropdown({ anchorRef, open, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Position panel under the anchor button
  const getPosition = () => {
    if (!anchorRef.current) return { top: 0, right: 0 };
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  const pos = open ? getPosition() : { top: 0, right: 0 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
          variants={dropdownVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: 'fixed',
            top: pos.top,
            right: pos.right,
            zIndex: 9990,
            width: '360px',
            background: 'rgba(13,13,15,0.98)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '1rem',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.65)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: '#e4e4e7' }}>Notifications</span>
              {unreadCount > 0 && (
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                  style={{ background: '#6366f1', color: '#fff' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-medium transition-colors duration-150"
                style={{ color: '#818cf8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div
            className="overflow-y-auto scrollbar-hidden"
            style={{ maxHeight: '380px' }}
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="w-8 h-8 mb-3"
                  style={{ color: '#27272a' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#3f3f46' }}>No notifications</p>
              </div>
            ) : (
              <ul className="py-1">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100 focus:outline-none"
                      style={{
                        background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(99,102,241,0.04)'}
                    >
                      {/* Icon */}
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: n.iconBg }}
                        aria-hidden="true"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: n.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={n.iconPath} />
                        </svg>
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold leading-snug" style={{ color: n.read ? '#71717a' : '#e4e4e7' }}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" aria-hidden="true" />
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: '#52525b' }}>{n.body}</p>
                        <p className="text-[10px] mt-1" style={{ color: '#3f3f46' }}>{n.time}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 flex items-center justify-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-[11px]" style={{ color: '#3f3f46' }}>
              {unreadCount === 0 ? 'All caught up' : `${unreadCount} unread`}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
