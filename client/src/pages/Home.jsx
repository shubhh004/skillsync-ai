import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import MainLayout from '../layouts/MainLayout';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: 'DSA Progress Tracker',
    description: 'Log and track your Data Structures & Algorithms practice across topics, difficulty levels, and problem status with visual analytics.',
    color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.22)', glow: 'rgba(99,102,241,0.12)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
  },
  {
    title: 'ATS Resume Builder',
    description: 'Build ATS-optimized resumes with AI-driven suggestions, real-time compatibility scoring, and one-click PDF export.',
    color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.22)', glow: 'rgba(34,197,94,0.1)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  },
  {
    title: 'AI Mock Interviews',
    description: 'Simulate technical and behavioral interviews with AI-powered feedback, scoring, and improvement tips for every answer.',
    color: '#c084fc', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.22)', glow: 'rgba(167,139,250,0.1)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
  },
  {
    title: 'Job Application Pipeline',
    description: 'Track every application, status, and deadline. Stay organized from applied to offer — no spreadsheet needed.',
    color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.22)', glow: 'rgba(245,158,11,0.1)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />,
  },
  {
    title: 'Analytics & Insights',
    description: 'Visualize streaks, topic coverage, weak areas, and preparation progress over time with beautiful interactive charts.',
    color: '#22d3ee', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.22)', glow: 'rgba(6,182,212,0.1)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  },
  {
    title: 'AI Career Coach',
    description: 'Get personalized career advice, placement roadmaps, and interview tips from an AI coach powered by GPT-4o.',
    color: '#f472b6', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.22)', glow: 'rgba(236,72,153,0.1)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />,
  },
];

const STATS = [
  { value: '10K+', label: 'Students Preparing',   color: '#818cf8' },
  { value: '95%',  label: 'Interview Success Rate', color: '#4ade80' },
  { value: '6',    label: 'AI-Powered Tools',       color: '#fbbf24' },
  { value: '500+', label: 'Companies Targeted',     color: '#c084fc' },
];

const STEPS = [
  {
    num: '01', title: 'Sign up free',
    desc: 'Create your account in seconds. No credit card required. Start free and upgrade whenever you\'re ready.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
  },
  {
    num: '02', title: 'Build your roadmap',
    desc: 'Set your target companies, roles, and timeline. The AI Career Coach generates a personalized placement plan.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
  },
  {
    num: '03', title: 'Prepare & track',
    desc: 'Solve DSA problems, practice mock interviews, build your ATS resume, and track every job application.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  },
  {
    num: '04', title: 'Land the offer',
    desc: 'Arrive at every interview fully prepared. Let SkillSync AI turn preparation into your offer letter.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'SWE @ Google', avatar: 'P',
    grad: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    quote: 'SkillSync AI completely transformed how I prepared. The DSA tracker and mock interviews helped me clear Google\'s interview in just 3 months.',
  },
  {
    name: 'Arjun Mehta', role: 'SDE @ Amazon', avatar: 'A',
    grad: 'linear-gradient(135deg, #22c55e, #16a34a)',
    quote: 'The AI Career Coach gave me a personalized roadmap that actually worked. Got my first offer 2 weeks after following the plan. Can\'t recommend this enough.',
  },
  {
    name: 'Sneha Patel', role: 'Product @ Microsoft', avatar: 'S',
    grad: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    quote: 'The resume builder alone is worth it. My ATS score went from 42% to 91% after using SkillSync AI. Got 3x more interview calls immediately.',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map((i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#f59e0b">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest"
      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: '#818cf8' }}>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <MainLayout>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative overflow-hidden pt-14 pb-24 sm:pt-20 sm:pb-32">

        {/* Ambient radial lighting */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse at center top, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.1) 40%, transparent 65%)' }}
          />
          <div
            className="absolute top-24 -right-16 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)' }}
          />
          <div
            className="absolute bottom-0 -left-16 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)' }}
          />
        </div>

        <Container>
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold animate-fade-slide-down"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.22)', color: '#a5b4fc' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              AI-Powered Placement Preparation
            </div>

            {/* Headline */}
            <h1
              className="text-display mb-6 animate-fade-slide-up"
              style={{ animationDelay: '60ms' }}
            >
              Ace your placement{' '}
              <span className="text-gradient-brand">with AI</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto animate-fade-slide-up"
              style={{ color: '#71717a', animationDelay: '120ms' }}
            >
              SkillSync AI is your all-in-one placement toolkit — DSA tracking, resume building,
              mock interviews, and job management in one focused platform.
            </p>

            {/* CTAs */}
            <div
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              <Link to="/signup">
                <Button size="lg">
                  Get Started Free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  See how it works
                </Button>
              </a>
            </div>

            {/* Trust row */}
            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              {['No credit card required', 'Free forever plan', '10K+ students'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: '#52525b' }}>
                  <CheckIcon />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═════════════════════════════ STATS BAR ════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: '1px', background: 'rgba(255,255,255,0.04)', borderRadius: '0' }}
          >
            {STATS.map(({ value, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1.5 py-10 px-4 transition-all duration-200"
                style={{ background: 'rgba(9,9,11,0.95)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,18,22,0.95)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(9,9,11,0.95)'}
              >
                <span className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight leading-none" style={{ color }}>
                  {value}
                </span>
                <span className="text-xs text-center leading-tight" style={{ color: '#52525b' }}>{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════ FEATURES ══════════════════════════════ */}
      <section id="features" className="py-24 sm:py-28">
        <Container>
          <div className="max-w-xl mx-auto text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-h2 mb-4">Everything you need to get placed</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Six focused AI-powered tools. One goal: your offer letter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ title, description, icon, color, bg, border, glow }, i) => (
              <div
                key={title}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl cursor-default transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:    'rgba(24,24,27,0.65)',
                  border:        '1px solid rgba(255,255,255,0.08)',
                  backdropFilter:'blur(20px)',
                  boxShadow:     '0 4px 16px rgba(0,0,0,0.25)',
                  animationFillMode: 'both',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${border}, 0 8px 32px rgba(0,0,0,0.4), 0 0 28px ${glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                }}
              >
                {/* Icon container */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.6}>
                    {icon}
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#e4e4e7' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>{description}</p>
                </div>

                {/* Hover glow corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 70%)` }}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ════════════════════════════ */}
      <section
        id="how-it-works"
        className="py-24 sm:py-28"
        style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Container>
          <div className="max-w-xl mx-auto text-center mb-16">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-h2 mb-4">From zero to offer in 4 steps</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              SkillSync AI guides you through every step of your placement journey.
            </p>
          </div>

          <div className="relative">
            {/* Connector line — desktop */}
            <div
              className="hidden lg:block absolute top-9 left-[14%] right-[14%] h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.15) 10%, rgba(99,102,241,0.4) 50%, rgba(99,102,241,0.15) 90%, transparent 100%)' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {STEPS.map(({ num, title, desc, icon }, i) => (
                <div key={num} className="flex flex-col items-center text-center gap-5">
                  {/* Step icon */}
                  <div
                    className="relative z-10 w-[72px] h-[72px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(99,102,241,0.08)',
                      border:     '1px solid rgba(99,102,241,0.22)',
                      boxShadow:  '0 0 24px rgba(99,102,241,0.1)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.1)'}
                  >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#818cf8" strokeWidth={1.5}>
                      {icon}
                    </svg>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold tracking-[0.2em] mb-1.5" style={{ color: '#4f46e5' }}>
                      STEP {num}
                    </div>
                    <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#e4e4e7' }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-14">
            <Link to="/signup">
              <Button size="lg">
                Start your journey
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ WHY US ══════════════════════════════ */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="max-w-xl mx-auto text-center mb-16">
            <SectionLabel>Why SkillSync AI</SectionLabel>
            <h2 className="text-h2 mb-4">One platform. Complete preparation.</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Stop juggling five different tools. Everything you need is here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Without SkillSync */}
            <div
              className="p-7 rounded-2xl"
              style={{
                background: 'rgba(239,68,68,0.04)',
                border: '1px solid rgba(239,68,68,0.14)',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: '#f87171' }}>
                Without SkillSync AI
              </p>
              <ul className="space-y-4">
                {[
                  'Spreadsheets for DSA tracking',
                  'Generic resume templates',
                  'No interview practice',
                  'Scattered job applications',
                  'No personalized roadmap',
                  'Placement anxiety',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm" style={{ color: '#71717a' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With SkillSync */}
            <div
              className="p-7 rounded-2xl relative overflow-hidden"
              style={{
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 0 32px rgba(99,102,241,0.08)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(99,102,241,0.12), transparent 60%)' }}
              />
              <p className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: '#818cf8' }}>
                With SkillSync AI ✦
              </p>
              <ul className="space-y-4">
                {[
                  'Visual DSA tracker with analytics',
                  'AI-optimized ATS resume builder',
                  'Mock interviews with AI feedback',
                  'Job application pipeline',
                  'Personalized AI placement roadmap',
                  'Placement confidence',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm" style={{ color: '#a1a1aa' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section
        id="testimonials"
        className="py-24 sm:py-28"
        style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Container>
          <div className="max-w-xl mx-auto text-center mb-16">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-h2 mb-4">Students are getting placed</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Real stories from students who used SkillSync AI to land their dream roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, quote, avatar, grad }) => (
              <div
                key={name}
                className="group flex flex-col gap-5 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1"
                style={{
                  background:    'rgba(24,24,27,0.65)',
                  border:        '1px solid rgba(255,255,255,0.08)',
                  backdropFilter:'blur(20px)',
                  boxShadow:     '0 4px 16px rgba(0,0,0,0.25)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                }}
              >
                <Stars />
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#a1a1aa' }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: grad, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight" style={{ color: '#e4e4e7' }}>{name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#52525b' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ FINAL CTA ══════════════════════════════ */}
      <section className="py-24 sm:py-28">
        <Container>
          <div
            className="relative max-w-2xl mx-auto text-center overflow-hidden rounded-3xl px-8 py-16 sm:px-14"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(24,24,27,0.97) 65%)',
              border:     '1px solid rgba(99,102,241,0.2)',
              boxShadow:  '0 0 80px rgba(99,102,241,0.12), 0 8px 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.35), transparent 70%)', filter: 'blur(12px)' }}
            />

            <div className="relative">
              <SectionLabel>Get started today</SectionLabel>
              <h2 className="text-h2 mb-4">Ready to land your dream offer?</h2>
              <p className="text-body-lg mb-10 max-w-md mx-auto" style={{ color: '#71717a' }}>
                Join 10,000+ students turning placement anxiety into placement offers.
                Free forever plan — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <Button size="lg">
                    Create Free Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Log in to existing account
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {['No credit card', 'Free plan available', '2 min setup'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: '#52525b' }}>
                    <CheckIcon />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

    </MainLayout>
  );
}
