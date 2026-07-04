import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate, useInView } from 'framer-motion';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import MainLayout from '../layouts/MainLayout';

const ease = [0.25, 1, 0.5, 1];

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: 'DSA Progress Tracker',
    description: 'Log and track your Data Structures & Algorithms practice across topics, difficulty levels, and problem status with visual analytics.',
    color: '#8B7CFF', bg: 'rgba(108,92,255,0.09)', border: 'rgba(108,92,255,0.28)', glow: 'rgba(108,92,255,0.18)', ring: 'rgba(108,92,255,0.07)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
  },
  {
    title: 'ATS Resume Builder',
    description: 'Build ATS-optimized resumes with AI-driven suggestions, real-time compatibility scoring, and one-click PDF export.',
    color: '#4ade80', bg: 'rgba(34,197,94,0.09)', border: 'rgba(34,197,94,0.26)', glow: 'rgba(34,197,94,0.15)', ring: 'rgba(34,197,94,0.06)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  },
  {
    title: 'AI Mock Interviews',
    description: 'Simulate technical and behavioral interviews with AI-powered feedback, scoring, and improvement tips for every answer.',
    color: '#c084fc', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.26)', glow: 'rgba(167,139,250,0.15)', ring: 'rgba(167,139,250,0.06)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
  },
  {
    title: 'Job Application Pipeline',
    description: 'Track every application, status, and deadline. Stay organized from applied to offer — no spreadsheet needed.',
    color: '#fbbf24', bg: 'rgba(245,158,11,0.09)', border: 'rgba(245,158,11,0.26)', glow: 'rgba(245,158,11,0.15)', ring: 'rgba(245,158,11,0.06)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />,
  },
  {
    title: 'Analytics & Insights',
    description: 'Visualize streaks, topic coverage, weak areas, and preparation progress over time with beautiful interactive charts.',
    color: '#22d3ee', bg: 'rgba(6,182,212,0.09)', border: 'rgba(6,182,212,0.26)', glow: 'rgba(6,182,212,0.15)', ring: 'rgba(6,182,212,0.06)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  },
  {
    title: 'AI Career Coach',
    description: 'Get personalized career advice, placement roadmaps, and interview tips from an AI coach powered by GPT-4o.',
    color: '#f472b6', bg: 'rgba(236,72,153,0.09)', border: 'rgba(236,72,153,0.26)', glow: 'rgba(236,72,153,0.15)', ring: 'rgba(236,72,153,0.06)',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />,
  },
];

const STATS = [
  { value: '10K+', label: 'Students Preparing',    color: '#8B7CFF' },
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
    grad: 'linear-gradient(135deg, #6C5CFF, #4f46e5)',
    quote: 'SkillSync AI completely transformed how I prepared. The DSA tracker and mock interviews helped me clear Google\'s interview in just 3 months.',
  },
  {
    name: 'Arjun Mehta', role: 'SDE @ Amazon', avatar: 'A',
    grad: 'linear-gradient(135deg, #22c55e, #16a34a)',
    quote: 'The AI Career Coach gave me a personalized roadmap that actually worked. Got my first offer 2 weeks after following the plan. Can\'t recommend this enough.',
  },
  {
    name: 'Sneha Patel', role: 'Product @ Microsoft', avatar: 'S',
    grad: 'linear-gradient(135deg, #A855F7, #7c3aed)',
    quote: 'The resume builder alone is worth it. My ATS score went from 42% to 91% after using SkillSync AI. Got 3x more interview calls immediately.',
  },
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease } },
};
const staggerGrid = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease } },
};
const sectionFade = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease } },
};

// ─── Design tokens ────────────────────────────────────────────────────────────
const pageBg      = 'rgba(9,9,15,1)';
const surfaceBg   = 'rgba(20,20,28,';
const primaryC    = 'rgba(108,92,255,';
const accentC     = 'rgba(168,85,247,';

// ─── SectionEdgeFade ──────────────────────────────────────────────────────────
function SectionEdgeFade({ pos = 'top', height = 60 }) {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      aria-hidden="true"
      style={{
        [pos]: 0, height,
        background: `linear-gradient(to ${pos === 'top' ? 'bottom' : 'top'}, ${pageBg}, transparent)`,
        zIndex: 2,
      }}
    />
  );
}

// ─── Shimmer section divider ──────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="relative h-px" aria-hidden="true">
      {/* bloom glow behind the line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: -18, width: 480, height: 36,
          background: `radial-gradient(ellipse at center, ${primaryC}0.18) 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
      <div
        className="absolute inset-0 max-w-2xl mx-auto"
        style={{ background: `linear-gradient(90deg, transparent, ${primaryC}0.28), ${accentC}0.22), transparent)` }}
      />
    </div>
  );
}

// ─── CounterStat ──────────────────────────────────────────────────────────────
function CounterStat({ value, label, color }) {
  const ref    = useRef(null);
  const numRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match || !numRef.current) return;
    const num    = parseFloat(match[1]);
    const suffix = match[2];
    const ctrl   = animate(0, num, {
      duration: 2.2,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        if (numRef.current)
          numRef.current.textContent = (Number.isInteger(num) ? Math.round(v) : v.toFixed(0)) + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6, transition: { duration: 0.2, ease } }}
      className="flex flex-col items-center justify-center gap-3 py-12 px-6 rounded-3xl relative overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(160deg, ${surfaceBg}0.97) 0%, rgba(12,12,20,0.99) 100%)`,
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 2px 16px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
        transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}3a`;
        e.currentTarget.style.boxShadow = `0 2px 16px rgba(0,0,0,0.5), 0 16px 52px rgba(0,0,0,0.55), 0 0 44px ${color}1c, inset 0 1px 0 rgba(255,255,255,0.07)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)';
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 15%, ${color}16 0%, transparent 65%)` }} />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 48, height: 1, background: `linear-gradient(90deg, transparent, ${color}cc, transparent)`, boxShadow: `0 0 10px ${color}66` }}
      />
      <span
        ref={numRef}
        className="relative text-4xl sm:text-5xl font-bold tabular-nums leading-none"
        style={{ color, letterSpacing: '-0.035em' }}
      >
        {value}
      </span>
      <span className="relative text-[11px] text-center leading-snug tracking-wide uppercase" style={{ color: '#48485a' }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars() {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map((i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 3px rgba(245,158,11,0.4))' }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[11px] font-semibold uppercase tracking-widest cursor-default select-none"
      style={{ background: `${primaryC}0.07)`, border: `1px solid ${primaryC}0.28)`, color: '#9d8fff' }}
      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8B7CFF', display: 'inline-block', flexShrink: 0, boxShadow: '0 0 8px rgba(139,124,255,0.9)' }} />
      {children}
    </motion.div>
  );
}

// ─── CheckIcon ────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <MainLayout>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.048) 1px, transparent 1px)`,
            backgroundSize: '38px 38px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 70%)',
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'%2F%3E%3C%2Ffilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'%2F%3E%3C%2Fsvg%3E")`,
            opacity: 0.022,
            mixBlendMode: 'overlay',
            zIndex: 3,
          }}
        />

        {/* Atmospheric lighting — 6 static layers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div style={{ position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)', width: '140%', height: '110%', background: `radial-gradient(ellipse at 50% 0%, ${primaryC}0.32) 0%, ${primaryC}0.14) 32%, ${primaryC}0.04) 55%, transparent 68%)` }} />
          <div style={{ position: 'absolute', top: '0%', left: '50%', transform: 'translateX(-50%)', width: '78%', height: '80%', background: `radial-gradient(ellipse at 50% 20%, ${accentC}0.2) 0%, transparent 54%)`, filter: 'blur(44px)' }} />
          <div style={{ position: 'absolute', top: '-10%', bottom: '-10%', left: '-20%', width: '65%', background: `radial-gradient(ellipse at 5% 38%, ${primaryC}0.14) 0%, transparent 68%)`, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '-10%', bottom: '-10%', right: '-20%', width: '65%', background: `radial-gradient(ellipse at 95% 38%, ${accentC}0.11) 0%, transparent 68%)`, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-5%', left: '50%', transform: 'translateX(-50%)', width: '85%', height: '55%', background: `radial-gradient(ellipse at 50% 95%, ${primaryC}0.1) 0%, transparent 62%)`, filter: 'blur(48px)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 130% 110% at 50% 45%, transparent 18%, rgba(9,9,15,0.28) 50%, rgba(9,9,15,0.68) 78%, rgba(9,9,15,0.95) 100%)' }} />
        </div>

        {/* Bottom fade — two layers for a gradual dissolve */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none" aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,15,0.55) 55%, rgba(9,9,15,0.95) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(9,9,15,1))' }} />

        <Container className="relative w-full py-24 sm:py-32" style={{ zIndex: 4 }}>
          <motion.div className="max-w-4xl mx-auto text-center" variants={heroContainer} initial="hidden" animate="show">

            {/* Badge */}
            <motion.div variants={heroItem} className="mb-10">
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-medium"
                style={{ background: `linear-gradient(135deg, ${primaryC}0.1), ${accentC}0.07))`, border: `1px solid ${primaryC}0.32)`, color: '#b4a8ff', boxShadow: `0 0 36px ${primaryC}0.14), inset 0 1px 0 rgba(255,255,255,0.08)`, backdropFilter: 'blur(12px)' }}
              >
                <span className="relative flex-shrink-0" style={{ width: 7, height: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background: '#8B7CFF' }} />
                  <span className="relative inline-flex rounded-full" style={{ width: 7, height: 7, background: '#8B7CFF' }} />
                </span>
                <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI-Powered Placement Preparation
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={heroItem} className="text-display mb-8" style={{ lineHeight: 1.02, letterSpacing: '-0.045em' }}>
              Ace your placement{' '}
              <span style={{ background: 'linear-gradient(135deg, #A855F7 0%, #8B7CFF 45%, #6C5CFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                with AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={heroItem} className="text-lg font-light leading-[1.75] max-w-xl mx-auto mb-12" style={{ color: '#a1a1aa' }}>
              SkillSync AI is your all-in-one placement toolkit — DSA tracking, resume building,
              mock interviews, and job management in one focused platform.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
                style={{ background: `radial-gradient(ellipse at center, ${primaryC}0.15) 0%, transparent 60%)`, filter: 'blur(32px)' }} />
              <Link to="/signup" className="relative"><Button size="lg" className="group">Get Started Free <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></Button></Link>
              <a href="#how-it-works" className="relative"><Button variant="outline" size="lg">See how it works</Button></a>
            </motion.div>

            {/* Trust row */}
            <motion.div variants={heroItem} className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              {['No credit card required', 'Free forever plan', '10K+ students'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: '#52525b' }}>
                  <CheckIcon />{t}
                </span>
              ))}
            </motion.div>

          </motion.div>
        </Container>
      </section>

      {/* ═════════════════════════════ STATS ════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <SectionEdgeFade pos="top" height={72} />
        <SectionEdgeFade pos="bottom" height={60} />
        {/* Ambient wash behind stats */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 100% 80% at 50% 55%, ${primaryC}0.065) 0%, transparent 100%)` }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 60% 50% at 20% 70%, rgba(79,141,255,0.04) 0%, transparent 100%)` }} />
        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {STATS.map(({ value, label, color }) => (
              <motion.div key={label} variants={cardItem}>
                <CounterStat value={value} label={label} color={color} />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <SectionDivider />

      {/* ════════════════════════════ FEATURES ══════════════════════════════ */}
      <section id="features" className="relative py-32 sm:py-44 overflow-hidden">
        {/* Section ambient — soft glow from top-left */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 70% 65% at 8% 35%, ${primaryC}0.07) 0%, transparent 100%)` }} />
        {/* Blue accent from bottom-right */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 55% 50% at 92% 72%, rgba(79,141,255,0.04) 0%, transparent 100%)` }} />

        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            className="max-w-xl mx-auto text-center mb-16"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-h2 mb-4">Everything you need to get placed</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Six focused AI-powered tools. One goal: your offer letter.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURES.map(({ title, description, icon, color, bg, border, glow, ring }) => (
              <motion.div
                key={title}
                variants={cardItem}
                whileHover={{ y: -7, scale: 1.018, transition: { duration: 0.22, ease } }}
                className="group relative flex flex-col gap-5 p-7 rounded-3xl cursor-default overflow-hidden"
                style={{
                  background: `linear-gradient(155deg, ${surfaceBg}0.96) 0%, rgba(13,13,21,0.99) 100%)`,
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'border-color 0.24s ease, box-shadow 0.24s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${border}, 0 8px 32px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.45), 0 0 52px ${glow}, inset 0 1px 0 rgba(255,255,255,0.09)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)';
                }}
              >
                {/* Top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent 5%, ${border} 50%, transparent 95%)` }} />

                {/* Icon — circular premium container */}
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.12, transition: { duration: 0.15 } }}
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${glow.replace(/[\d.]+\)$/, '0.35)')}, ${bg})`,
                    border: `1px solid ${border}`,
                    boxShadow: `0 0 0 6px ${ring}, 0 0 26px ${glow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.7}>
                    {icon}
                  </svg>
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-2.5 leading-snug" style={{ color: '#eeeef5' }}>{title}</h3>
                  <p className="text-xs leading-[1.75]" style={{ color: '#5f5f72' }}>{description}</p>
                </div>

                {/* Corner hover glow */}
                <div
                  className="absolute top-0 right-0 w-44 h-44 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 62%)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <SectionDivider />

      {/* ══════════════════════════ HOW IT WORKS ════════════════════════════ */}
      <section id="how-it-works" className="relative py-32 sm:py-44 overflow-hidden">
        <SectionEdgeFade pos="top" height={64} />
        <SectionEdgeFade pos="bottom" height={64} />

        {/* Section bg tint */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'rgba(255,255,255,0.011)' }} />
        {/* Section ambient — soft glow from top-right */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 65% 60% at 92% 30%, ${accentC}0.055) 0%, transparent 100%)` }} />
        {/* Horizontal sweep across mid section */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 160% 22% at 50% 55%, ${primaryC}0.055) 0%, transparent 100%)` }} />

        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            className="max-w-xl mx-auto text-center mb-16"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-h2 mb-4">From zero to offer in 4 steps</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              SkillSync AI guides you through every step of your placement journey.
            </p>
          </motion.div>

          <div className="relative">
            {/* Animated connector line — desktop */}
            <motion.div
              className="hidden lg:block absolute h-px"
              style={{
                top: 40, left: '14%', right: '14%',
                background: `linear-gradient(90deg, transparent 0%, ${primaryC}0.18) 12%, ${primaryC}0.5) 50%, ${primaryC}0.18) 88%, transparent 100%)`,
                transformOrigin: 'left center',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.25 }}
              viewport={{ once: true }}
            />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
              variants={staggerGrid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {STEPS.map(({ num, title, desc, icon }, i) => (
                <motion.div
                  key={num}
                  variants={cardItem}
                  className="flex flex-col items-center text-center gap-6"
                >
                  <div className="relative z-10">
                    <motion.div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease, delay: i * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.09, y: -4, transition: { duration: 0.2, ease } }}
                      viewport={{ once: true }}
                      style={{
                        background: `linear-gradient(145deg, ${primaryC}0.12), ${primaryC}0.06))`,
                        border: `1px solid ${primaryC}0.28)`,
                        boxShadow: `0 0 32px ${primaryC}0.14), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)`,
                        transition: 'box-shadow 0.22s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 52px ${primaryC}0.3), 0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 32px ${primaryC}0.14), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)`; }}
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#8B7CFF" strokeWidth={1.5}>
                        {icon}
                      </svg>
                    </motion.div>
                    {/* Step badge */}
                    <div
                      className="absolute -bottom-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: `linear-gradient(135deg, #8B7CFF, #6C5CFF)`,
                        border: '2px solid rgba(9,9,15,0.9)',
                        color: '#fff',
                        boxShadow: `0 0 14px ${primaryC}0.55)`,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {num}
                    </div>
                  </div>

                  <div className="max-w-[200px]">
                    <h3 className="text-sm font-semibold mb-2.5 leading-snug" style={{ color: '#eeeef5' }}>{title}</h3>
                    <p className="text-xs leading-[1.75]" style={{ color: '#5f5f72' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-16">
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

      <SectionDivider />

      {/* ═══════════════════════════ WHY US ═════════════════════════════════ */}
      <section className="relative py-32 sm:py-44 overflow-hidden">
        {/* Left — red ambient (complements the "without" card) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 55% 60% at 12% 55%, rgba(239,68,68,0.04) 0%, transparent 100%)` }} />
        {/* Right — purple ambient (complements the "with" card) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 55% 60% at 88% 55%, ${primaryC}0.055) 0%, transparent 100%)` }} />
        {/* Bottom ambient depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 75% 40% at 50% 95%, ${primaryC}0.04) 0%, transparent 100%)` }} />

        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            className="max-w-xl mx-auto text-center mb-16"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <SectionLabel>Why SkillSync AI</SectionLabel>
            <h2 className="text-h2 mb-4">One platform. Complete preparation.</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Stop juggling five different tools. Everything you need is here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">

            {/* Without */}
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease }}
              whileHover={{ y: -6, transition: { duration: 0.22, ease } }}
              className="p-9 rounded-3xl relative overflow-hidden"
              style={{
                background: `linear-gradient(150deg, rgba(239,68,68,0.05) 0%, ${surfaceBg}0.7) 100%)`,
                border: '1px solid rgba(239,68,68,0.14)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)',
                transition: 'border-color 0.24s ease, box-shadow 0.24s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.26)';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(239,68,68,0.18), 0 8px 32px rgba(0,0,0,0.55), 0 24px 56px rgba(0,0,0,0.4), 0 0 40px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.14)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)';
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 12%, rgba(239,68,68,0.4) 50%, transparent 88%)' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-9" style={{ color: '#f87171' }}>
                Without SkillSync AI
              </p>
              <ul className="space-y-4">
                {['Spreadsheets for DSA tracking','Generic resume templates','No interview practice','Scattered job applications','No personalized roadmap','Placement anxiety'].map((item) => (
                  <li key={item} className="flex items-center gap-3.5">
                    <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.24)' }}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-sm" style={{ color: '#62626e' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* With */}
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease, delay: 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.22, ease } }}
              className="p-9 rounded-3xl relative overflow-hidden"
              style={{
                background: `linear-gradient(150deg, ${primaryC}0.1) 0%, ${surfaceBg}0.8) 100%)`,
                border: `1px solid ${primaryC}0.28)`,
                boxShadow: `0 0 52px ${primaryC}0.12), 0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
                transition: 'border-color 0.24s ease, box-shadow 0.24s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${primaryC}0.42)`;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryC}0.28), 0 8px 32px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.45), 0 0 72px ${primaryC}0.22), inset 0 1px 0 rgba(255,255,255,0.09)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${primaryC}0.28)`;
                e.currentTarget.style.boxShadow = `0 0 52px ${primaryC}0.12), 0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`;
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent 8%, ${primaryC}0.7) 50%, transparent 92%)` }} />
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${primaryC}0.14), transparent 58%)` }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-9" style={{ color: '#9d8fff' }}>
                With SkillSync AI ✦
              </p>
              <ul className="space-y-4">
                {['Visual DSA tracker with analytics','AI-optimized ATS resume builder','Mock interviews with AI feedback','Job application pipeline','Personalized AI placement roadmap','Placement confidence'].map((item) => (
                  <li key={item} className="flex items-center gap-3.5">
                    <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.26)' }}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm" style={{ color: '#b0b0bc' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ══════════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section id="testimonials" className="relative py-32 sm:py-44 overflow-hidden">
        <SectionEdgeFade pos="top" height={64} />
        <SectionEdgeFade pos="bottom" height={64} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'rgba(255,255,255,0.011)' }} />
        {/* Warm centered spotlight */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 75% 80% at 50% 45%, ${primaryC}0.065) 0%, ${accentC}0.03) 55%, transparent 100%)` }} />

        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            className="max-w-xl mx-auto text-center mb-16"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-h2 mb-4">Students are getting placed</h2>
            <p className="text-body-lg" style={{ color: '#71717a' }}>
              Real stories from students who used SkillSync AI to land their dream roles.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {TESTIMONIALS.map(({ name, role, quote, avatar, grad }) => (
              <motion.div
                key={name}
                variants={cardItem}
                whileHover={{ y: -7, scale: 1.012, transition: { duration: 0.22, ease } }}
                className="group flex flex-col p-7 rounded-3xl overflow-hidden relative"
                style={{
                  background: `linear-gradient(155deg, ${surfaceBg}0.97) 0%, rgba(13,13,21,0.99) 100%)`,
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'border-color 0.24s ease, box-shadow 0.24s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${primaryC}0.3)`;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryC}0.22), 0 8px 32px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.45), 0 0 40px ${primaryC}0.12), inset 0 1px 0 rgba(255,255,255,0.07)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5), 0 8px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)';
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.09) 50%, transparent 90%)' }} />

                {/* Editorial quote mark */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: '6rem',
                    lineHeight: '0.65',
                    color: `${primaryC}0.2)`,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    marginBottom: -6,
                    marginLeft: -3,
                  }}
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="mb-4"><Stars /></div>

                <p className="text-sm leading-[1.8] flex-1 mb-6" style={{ color: '#9292a5' }}>
                  {quote}
                </p>

                <div className="flex items-center gap-4 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                      background: grad,
                      boxShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 12px rgba(108,92,255,0.18)',
                    }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: '#eeeef5' }}>{name}</p>
                    <p className="text-[11px] mt-0.5 tracking-wide" style={{ color: '#46465a' }}>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════════════ FINAL CTA ══════════════════════════════ */}
      <section className="relative py-36 sm:py-48 overflow-hidden">
        {/* Section-level bloom — brightens the space around the CTA card */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 85% 90% at 50% 50%, ${primaryC}0.08) 0%, transparent 100%)` }} />
        <Container className="relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
            className="relative max-w-3xl mx-auto text-center overflow-hidden rounded-3xl px-8 py-24 sm:px-16 sm:py-32"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${primaryC}0.34) 0%, ${accentC}0.08) 42%, rgba(15,15,23,0.99) 68%)`,
              border: `1px solid ${primaryC}0.3)`,
              boxShadow: [
                `0 0 0 1px ${primaryC}0.15)`,
                `0 0 180px ${primaryC}0.26)`,
                `0 0 80px ${accentC}0.13)`,
                '0 40px 100px rgba(0,0,0,0.7)',
                'inset 0 1px 0 rgba(255,255,255,0.09)',
              ].join(', '),
            }}
          >
            {/* Top beam glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: 560, height: 200, background: `radial-gradient(ellipse at top, ${primaryC}0.52), transparent 68%)`, filter: 'blur(28px)' }} />
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent 5%, ${primaryC}0.75) 50%, transparent 95%)` }} />
            {/* Corner ambients */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentC}0.2) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${primaryC}0.13) 0%, transparent 65%)`, filter: 'blur(36px)' }} />

            <div className="relative">
              <SectionLabel>Get started today</SectionLabel>
              <h2 className="text-h2 mb-5" style={{ letterSpacing: '-0.028em' }}>
                Ready to land your dream offer?
              </h2>
              <p className="text-body-lg mb-12 max-w-md mx-auto" style={{ color: '#71717a' }}>
                Join 10,000+ students turning placement anxiety into placement offers.
                Free forever plan — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg">
                    Create Free Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Log in to existing account</Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
                {['No credit card', 'Free plan available', '2 min setup'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: '#52525b' }}>
                    <CheckIcon />{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

    </MainLayout>
  );
}
