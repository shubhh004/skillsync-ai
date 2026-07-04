import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

const NAV_LINKS = [
  ['Features',      '#features'],
  ['How it works',  '#how-it-works'],
  ['Reviews',       '#testimonials'],
];

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* ── Floating glass navbar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">

          {/* Main bar */}
          <header
            className="flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl"
            style={{
              background:    'rgba(17,24,39,0.88)',
              backdropFilter:'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border:    '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div
                className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 0 16px rgba(99,102,241,0.55)' }}
              >
                <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '0.875rem', height: '0.875rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight">
                <span className="text-neutral-900">SkillSync</span>
                <span className="text-gradient-brand"> AI</span>
              </span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150"
                  style={{ color: '#71717a' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
              {/* Hamburger — mobile only */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-xl transition-all duration-150"
                style={{ color: '#71717a' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              className="mt-2 rounded-2xl p-2 animate-fade-slide-down"
              style={{
                background:    'rgba(17,24,39,0.96)',
                backdropFilter:'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border:    '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            >
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
                  style={{ color: '#a1a1aa' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </a>
              ))}
              <div className="h-px mx-2 my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{ color: '#a1a1aa' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium mt-0.5 transition-all duration-150"
                style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
              >
                Get Started Free →
              </Link>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1">{children}</main>

      {/* ── Premium footer ────────────────────────────────────────────────── */}
      <footer className="pt-16 pb-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                <div
                  className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
                >
                  <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '0.875rem', height: '0.875rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold tracking-tight">
                  <span className="text-neutral-900">SkillSync</span>
                  <span className="text-gradient-brand"> AI</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#71717a' }}>
                Your all-in-one AI-powered placement preparation platform. From your first solved problem to your offer letter.
              </p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}
              >
                <span style={{ color: '#22c55e' }}>●</span>
                Built for placement season
              </span>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-5" style={{ color: '#52525b' }}>Product</p>
              <ul className="space-y-3">
                {NAV_LINKS.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: '#71717a' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                      onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-5" style={{ color: '#52525b' }}>Account</p>
              <ul className="space-y-3">
                {[['Log in', '/login'], ['Sign up free', '/signup']].map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm transition-colors duration-150"
                      style={{ color: '#71717a' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                      onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: '#52525b' }}>
              © {new Date().getFullYear()} SkillSync AI. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: '#52525b' }}>
              Built for placement season 🚀
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
