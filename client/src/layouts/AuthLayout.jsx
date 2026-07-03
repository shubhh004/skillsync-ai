import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.25, 1, 0.5, 1];

const LEFT_FEATURES = [
  {
    color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.2)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
    text: 'DSA progress tracker with analytics',
  },
  {
    color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
    text: 'ATS resume builder with AI scoring',
  },
  {
    color: '#c084fc', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
    text: 'AI mock interviews with real-time feedback',
  },
  {
    color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />,
    text: 'Job application pipeline & tracking',
  },
];

const TRUST = [
  { value: '10K+', label: 'students',     color: '#818cf8' },
  null,
  { value: '95%',  label: 'success rate', color: '#4ade80' },
  null,
  { value: 'Free', label: 'to start',     color: '#fbbf24' },
];

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0"
        style={{ boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
      >
        <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          style={{ width: '1rem', height: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span className="text-base font-bold tracking-tight">
        <span style={{ color: '#f4f4f5' }}>SkillSync</span>
        <span className="text-gradient-brand"> AI</span>
      </span>
    </Link>
  );
}

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen gradient-mesh flex overflow-x-hidden relative">

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-[65%] h-[65%] rounded-full blur-3xl"
          animate={{ opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 65%)' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] rounded-full blur-3xl"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 65%)' }}
        />
      </div>

      {/* ── LEFT PANEL — desktop only ──────────────────────────────────────── */}
      <div className="hidden lg:flex w-[55%] xl:w-[52%] flex-col justify-between px-14 xl:px-20 py-12 relative z-10">

        <Logo />

        <div>
          <h1
            className="font-bold leading-[1.07] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', color: '#f4f4f5' }}
          >
            Ace your<br />
            placement{' '}
            <span className="text-gradient-brand">with AI</span>
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#71717a', maxWidth: '18rem' }}>
            Your all-in-one preparation platform. From your first solved problem to your offer letter.
          </p>

          <ul className="space-y-3.5">
            {LEFT_FEATURES.map(({ color, bg, border, icon, text }) => (
              <li key={text} className="flex items-center gap-3.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.6}>
                    {icon}
                  </svg>
                </div>
                <span className="text-sm" style={{ color: '#a1a1aa' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust stats */}
        <div className="flex items-center">
          {TRUST.map((item, i) =>
            item === null ? (
              <div key={i} className="mx-5 w-px h-7 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)' }} />
            ) : (
              <div key={item.label}>
                <div className="text-xl font-bold tabular-nums" style={{ color: item.color }}>{item.value}</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#52525b' }}>{item.label}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div
        className="hidden lg:block w-px flex-shrink-0 self-stretch relative z-10"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)' }}
      />

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-[420px]"
        >
          {/* Glass card */}
          <div
            className="glass-heavy rounded-3xl px-8 py-9"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.5), 0 0 50px rgba(99,102,241,0.07)',
            }}
          >
            {(title || subtitle) && (
              <div className="mb-8">
                {title   && <h2 className="text-xl font-bold tracking-tight" style={{ color: '#f4f4f5' }}>{title}</h2>}
                {subtitle && <p className="mt-1 text-sm" style={{ color: '#71717a' }}>{subtitle}</p>}
              </div>
            )}
            {children}
          </div>

          <p className="mt-5 text-center text-[11px]" style={{ color: '#3f3f46' }}>
            © {new Date().getFullYear()} SkillSync AI · All rights reserved
          </p>
        </motion.div>
      </div>
    </div>
  );
}
