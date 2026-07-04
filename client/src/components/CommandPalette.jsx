import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'DSA Tracker',
    path: '/dsa',
    iconPath: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  },
  {
    label: 'Resume Builder',
    path: '/resume',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    label: 'Job Applications',
    path: '/jobs',
    iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'AI Interviews',
    path: '/interview',
    iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    label: 'AI Career Coach',
    path: '/career',
    iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  },
  {
    label: 'Profile',
    path: '/profile',
    iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  },
];

// ── Framer Motion variants ─────────────────────────────────────────────────────

const backdropVar = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.18 } },
  exit:   { opacity: 0, transition: { duration: 0.14 } },
};

// No y-shift — just clean scale + fade, matching Raycast / Linear
const panelVar = {
  hidden: { opacity: 0, scale: 0.98 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.13, ease: [0.4, 0, 1, 1] } },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CommandPalette({ open, onClose }) {
  const navigate               = useNavigate();
  const inputRef               = useRef(null);
  const [query, setQuery]      = useState('');
  const [highlighted, setHighlighted] = useState(0);

  // Reset on open + immediate autofocus
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlighted(0);
    const t = setTimeout(() => inputRef.current?.focus(), 16);
    return () => clearTimeout(t);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter(item => item.label.toLowerCase().includes(q));
  }, [query]);

  // Keep highlighted index in bounds when list shrinks
  useEffect(() => {
    setHighlighted(h => Math.min(h, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Keyboard navigation — unchanged logic, added Tab focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setHighlighted(h => (h + 1) % Math.max(filtered.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlighted(h => (h - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
          break;
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            setHighlighted(h => (h - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
          } else {
            setHighlighted(h => (h + 1) % Math.max(filtered.length, 1));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[highlighted]) {
            navigate(filtered[highlighted].path);
            onClose();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, highlighted, navigate, onClose]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  const clearQuery = () => {
    setQuery('');
    setHighlighted(0);
    inputRef.current?.focus();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="cp-backdrop"
            className="fixed inset-0"
            style={{
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 9998,
            }}
            variants={backdropVar}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Panel ── */}
          <motion.div
            key="cp-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette — search pages"
            className="fixed left-1/2 -translate-x-1/2 w-full"
            style={{
              top: '16vh',
              maxWidth: '740px',
              margin: '0 1rem',
              zIndex: 9999,
              background: 'rgba(11,11,13,0.97)',
              backdropFilter: 'blur(48px) saturate(200%)',
              WebkitBackdropFilter: 'blur(48px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: [
                '0 0 0 1px rgba(255,255,255,0.05)',
                '0 32px 80px rgba(0,0,0,0.85)',
                '0 8px 32px rgba(0,0,0,0.6)',
                '0 0 64px rgba(99,102,241,0.08)',
              ].join(', '),
            }}
            variants={panelVar}
            initial="hidden"
            animate="show"
            exit="exit"
          >

            {/* ── Search row ── */}
            <div
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Search icon — slightly larger and brighter */}
              <svg
                style={{ width: 18, height: 18, flexShrink: 0, color: '#71717a' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#f4f4f5',
                  caretColor: '#6366f1',
                }}
                aria-label="Search pages"
                aria-controls="cp-results"
                aria-activedescendant={filtered[highlighted] ? `cp-item-${highlighted}` : undefined}
                autoComplete="off"
                spellCheck="false"
              />

              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label="Clear search"
                  className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                  style={{ color: '#52525b', background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Esc badge — only show when no query */}
              {!query && (
                <kbd
                  className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-medium"
                  style={{
                    color: '#52525b',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    letterSpacing: '0.01em',
                  }}
                >
                  Esc
                </kbd>
              )}
            </div>

            {/* ── Results ── */}
            <div
              id="cp-results"
              className="overflow-y-auto scrollbar-hidden"
              style={{ maxHeight: '360px' }}
              role="listbox"
              aria-label="Page navigation results"
            >
              {filtered.length === 0 ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      style={{ width: 20, height: 20, color: '#3f3f46' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#52525b' }}>No results for</p>
                  <p
                    className="text-sm font-semibold mt-0.5 px-3 max-w-[240px] truncate"
                    style={{ color: '#71717a' }}
                  >
                    &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                <ul className="p-2 space-y-0.5" role="group">
                  {/* Section header — shown only when not filtering */}
                  {!query && (
                    <li aria-hidden="true">
                      <p
                        className="px-3 pt-2.5 pb-2 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: '#3f3f46', letterSpacing: '0.1em' }}
                      >
                        Navigate to
                      </p>
                    </li>
                  )}

                  {filtered.map((item, i) => {
                    const isActive = i === highlighted;
                    return (
                      <li
                        key={item.path}
                        id={`cp-item-${i}`}
                        role="option"
                        aria-selected={isActive}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setHighlighted(i)}
                          className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                          style={{
                            background: isActive
                              ? 'rgba(99,102,241,0.1)'
                              : 'transparent',
                            color: isActive ? '#c7d2fe' : '#a1a1aa',
                            transition: 'background 100ms ease, color 100ms ease',
                            boxShadow: isActive
                              ? '0 0 0 1px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.04)'
                              : 'none',
                          }}
                        >
                          {/* Icon badge */}
                          <span
                            className="flex items-center justify-center flex-shrink-0 rounded-lg"
                            style={{
                              width: 32,
                              height: 32,
                              background: isActive
                                ? 'rgba(99,102,241,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              border: isActive
                                ? '1px solid rgba(99,102,241,0.28)'
                                : '1px solid rgba(255,255,255,0.08)',
                              transition: 'background 100ms ease, border-color 100ms ease',
                            }}
                            aria-hidden="true"
                          >
                            <svg
                              style={{
                                width: 15,
                                height: 15,
                                color: isActive ? '#818cf8' : '#52525b',
                                transition: 'color 100ms ease',
                              }}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                            </svg>
                          </span>

                          {/* Label */}
                          <span className="flex-1 font-medium" style={{ fontSize: '14px', letterSpacing: '0.005em' }}>
                            {item.label}
                          </span>

                          {/* Return indicator — only on active row */}
                          {isActive && (
                            <span
                              className="flex-shrink-0 flex items-center justify-center rounded"
                              style={{
                                width: 22,
                                height: 22,
                                background: 'rgba(99,102,241,0.12)',
                                border: '1px solid rgba(99,102,241,0.22)',
                                color: '#818cf8',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                              aria-hidden="true"
                            >
                              ↵
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* ── Footer keyboard hints ── */}
            <div
              className="flex items-center gap-1 px-5 py-3"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
              }}
              aria-hidden="true"
            >
              {[
                { keys: ['↑', '↓'], label: 'Navigate' },
                { keys: ['↵'],       label: 'Select'   },
                { keys: ['Esc'],     label: 'Close'    },
              ].map(({ keys, label }, idx) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5"
                  style={{
                    fontSize: '11px',
                    color: '#3f3f46',
                    marginRight: idx < 2 ? '12px' : 0,
                  }}
                >
                  <span className="flex items-center gap-0.5">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: k === '↑↓' ? 'auto' : 22,
                          height: 18,
                          padding: '0 5px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '5px',
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          color: '#52525b',
                          letterSpacing: 0,
                          lineHeight: 1,
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                  <span>{label}</span>
                </span>
              ))}

              {/* Spacer + branding */}
              <span className="flex-1" />
              <span style={{ fontSize: '10px', color: '#27272a', letterSpacing: '0.04em' }}>
                SkillSync
              </span>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
