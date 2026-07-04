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
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{
        backgroundColor: '#09090F',
        backgroundImage: 'radial-gradient(ellipse 110% 50% at 50% 0%, rgba(108,92,255,0.20) 0%, transparent 55%)',
      }}
    >

      {/* ── Fixed ambient background (stays in viewport as you scroll) ────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
        {/* Layer 2: Subtle blue radial — top-right */}
        <div style={{
          position: 'absolute',
          top: '-5vh', right: '-10vw',
          width: '60vw', height: '60vh',
          background: 'radial-gradient(ellipse at 70% 30%, rgba(79,141,255,0.05) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
        {/* Layer 3: Large purple centered bloom */}
        <div style={{
          position: 'absolute',
          top: '-20vh', left: '5vw',
          width: '90vw', height: '90vh',
          background: 'radial-gradient(ellipse at 50% 35%, rgba(108,92,255,0.16) 0%, transparent 58%)',
          filter: 'blur(36px)',
        }} />
        {/* Layer 4: Violet lower-left offset */}
        <div style={{
          position: 'absolute',
          top: '30vh', left: '-8vw',
          width: '50vw', height: '70vh',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.08) 0%, transparent 62%)',
          filter: 'blur(72px)',
        }} />
      </div>

      {/* Layer 5: Grain/noise overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          pointerEvents: 'none',
          opacity: 0.022,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Layer 6: Edge vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 51,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 45%, rgba(8,8,12,0.18) 60%, rgba(8,8,12,0.45) 78%, rgba(8,8,12,0.80) 100%)',
        }}
      />

      {/* ── Content (sits above fixed background) ──────────────────────────── */}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>

        {/* ── Floating glass navbar ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pointer-events-none">
          <div className="max-w-6xl mx-auto pointer-events-auto">

            {/* Main bar */}
            <header
              className="flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl"
              style={{
                background:    'rgba(11,11,14,0.88)',
                backdropFilter:'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border:    '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 16px 48px rgba(108,92,255,0.06)',
              }}
            >
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
                <div
                  className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 18px rgba(108,92,255,0.65)' }}
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
                    onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
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
                  onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
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
                  background:    'rgba(11,11,14,0.97)',
                  backdropFilter:'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border:    '1px solid rgba(255,255,255,0.09)',
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
                    onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {label}
                  </a>
                ))}
                <div className="h-px mx-2 my-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
                  style={{ color: '#a1a1aa' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
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

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="relative pt-24 pb-12 overflow-hidden">
          {/* Top divider bloom */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"
            style={{ width: 560, height: 40, background: 'radial-gradient(ellipse at top, rgba(108,92,255,0.22), transparent 70%)', filter: 'blur(14px)', transform: 'translateX(-50%) translateY(-50%)' }} />
          {/* Top gradient divider */}
          <div className="absolute top-0 left-0 right-0 h-px" aria-hidden="true"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(108,92,255,0.32) 30%, rgba(168,85,247,0.26) 70%, transparent)' }} />
          {/* Footer ambient — primary centered bloom */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"
            style={{ width: 820, height: 220, background: 'radial-gradient(ellipse at top, rgba(108,92,255,0.11), transparent 65%)', filter: 'blur(28px)' }} />
          {/* Footer ambient — secondary violet pull */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"
            style={{ width: 440, height: 120, background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.06), transparent 70%)', filter: 'blur(20px)' }} />

          <Container className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-14 mb-16">

              {/* Brand */}
              <div className="sm:col-span-6 lg:col-span-7">
                <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                  <div
                    className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 transition-shadow duration-300 group-hover:shadow-glow-sm"
                    style={{ boxShadow: '0 0 20px rgba(108,92,255,0.5)' }}
                  >
                    <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '1.05rem', height: '1.05rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold tracking-tight">
                    <span className="text-neutral-900">SkillSync</span>
                    <span className="text-gradient-brand"> AI</span>
                  </span>
                </Link>
                <p className="text-sm leading-[1.8] max-w-sm mb-7" style={{ color: '#48485a' }}>
                  Your all-in-one AI-powered placement preparation platform. From your first solved problem to your offer letter.
                </p>
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(108,92,255,0.08)', border: '1px solid rgba(108,92,255,0.22)', color: '#9d8fff' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
                  Built for placement season
                </span>
              </div>

              {/* Product */}
              <div className="sm:col-span-3 lg:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-6" style={{ color: '#38384a' }}>Product</p>
                <ul className="space-y-4">
                  {NAV_LINKS.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: '#48485a' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#c4c4d4'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#48485a'; }}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account */}
              <div className="sm:col-span-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-6" style={{ color: '#38384a' }}>Account</p>
                <ul className="space-y-4">
                  {[['Log in', '/login'], ['Sign up free', '/signup']].map(([label, to]) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-sm transition-colors duration-200"
                        style={{ color: '#48485a' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#c4c4d4'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#48485a'; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-xs" style={{ color: '#2e2e3e' }}>
                © {new Date().getFullYear()} SkillSync AI. All rights reserved.
              </p>
              <p className="text-xs" style={{ color: '#2e2e3e' }}>
                Built for placement season
              </p>
            </div>
          </Container>
        </footer>

      </div>{/* end relative content wrapper */}
    </div>
  );
}
