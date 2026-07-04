import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../services/authService';

const menuVar = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.96, y: 6,  transition: { duration: 0.13, ease: [0.4, 0, 1, 1] } },
};

function MenuItem({ onClick, icon, label, sublabel, danger = false, disabled = false }) {
  if (disabled) {
    return (
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl select-none"
        style={{ cursor: 'default', opacity: 1 }}
        aria-disabled="true"
      >
        <span
          className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium" style={{ color: '#52525b' }}>{label}</span>
          {sublabel && (
            <span className="block text-[11px] mt-0.5" style={{ color: '#3f3f46' }}>{sublabel}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 group"
      style={{ background: 'transparent' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      onMouseDown={e => {
        e.currentTarget.style.background = danger
          ? 'rgba(239,68,68,0.14)'
          : 'rgba(255,255,255,0.09)';
        e.currentTarget.style.transform = 'scale(0.99)';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-150"
        style={{
          background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
          border: danger ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.07)',
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0 text-left">
        <span
          className="block text-sm font-medium transition-colors duration-150"
          style={{ color: danger ? '#f87171' : '#d4d4d8' }}
        >
          {label}
        </span>
        {sublabel && (
          <span className="block text-[11px] mt-0.5" style={{ color: '#52525b' }}>{sublabel}</span>
        )}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="my-1 mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />;
}

export default function ProfileDropdown({ anchorRef, open, onClose }) {
  const navigate  = useNavigate();
  const panelRef  = useRef(null);
  const firstItemRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
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
    const handler = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Focus first item on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstItemRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const getPosition = () => {
    if (!anchorRef.current) return { bottom: 80, left: 12, width: 270 };
    const rect = anchorRef.current.getBoundingClientRect();
    return {
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      width: rect.width,
    };
  };

  const pos = open ? getPosition() : { bottom: 80, left: 12, width: 270 };

  const handleNavigate = (path) => { onClose(); navigate(path); };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login', { replace: true });
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="menu"
          aria-label="Account menu"
          variants={menuVar}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: 'fixed',
            bottom: pos.bottom,
            left: pos.left,
            width: pos.width,
            zIndex: 9990,
            background: 'rgba(11,11,13,0.97)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '6px',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.04)',
              '0 -4px 24px rgba(0,0,0,0.5)',
              '0 -16px 48px rgba(0,0,0,0.4)',
              '0 0 32px rgba(99,102,241,0.06)',
            ].join(', '),
          }}
        >
          {/* My Profile */}
          <div ref={firstItemRef} tabIndex={-1} style={{ outline: 'none' }}>
            <MenuItem
              onClick={() => handleNavigate('/profile')}
              label="My Profile"
              sublabel="View and edit your details"
              icon={
                <svg style={{ width: 14, height: 14, color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />
          </div>

          {/* Dark Theme — disabled informational */}
          <MenuItem
            disabled
            label="Dark Theme"
            sublabel="Always enabled"
            icon={
              <svg style={{ width: 14, height: 14, color: '#3f3f46' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            }
          />

          <Divider />

          {/* Logout */}
          <MenuItem
            onClick={handleLogout}
            danger
            label="Log out"
            icon={
              <svg style={{ width: 14, height: 14, color: '#f87171' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
