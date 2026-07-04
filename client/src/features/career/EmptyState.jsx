import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../motion/variants';

const CHIPS = [
  { label: 'Improve my Resume',   icon: '📄', bg: 'rgba(59,130,246,0.12)' },
  { label: 'Career Roadmap',      icon: '🗺️', bg: 'rgba(16,185,129,0.12)' },
  { label: 'DSA Roadmap',         icon: '🧮', bg: 'rgba(139,92,246,0.12)' },
  { label: 'HR Interview Tips',   icon: '🎯', bg: 'rgba(239,68,68,0.12)'  },
  { label: 'Skills to Build',     icon: '🛠️', bg: 'rgba(245,158,11,0.12)' },
  { label: 'Resume Review',       icon: '🔍', bg: 'rgba(6,182,212,0.12)'  },
  { label: 'Mock Interview',      icon: '🎤', bg: 'rgba(236,72,153,0.12)' },
  { label: 'Product Companies',   icon: '🏢', bg: 'rgba(99,102,241,0.12)' },
  { label: 'Service Companies',   icon: '💼', bg: 'rgba(20,184,166,0.12)' },
  { label: 'Placement Plan',      icon: '✨', bg: 'rgba(99,102,241,0.18)' },
];

export default function EmptyState({ onChipClick }) {
  return (
    <div className="relative overflow-hidden min-h-full flex flex-col items-center justify-center px-8 py-14 text-center select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
        />
      </div>

      {/* Icon */}
      <motion.div
        className="relative mb-7"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22, delay: 0 }}
      >
        <div className="w-24 h-24 rounded-3xl gradient-brand flex items-center justify-center shadow-glow">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        </div>
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-success-500 border-2 border-neutral-50 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        </span>
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-neutral-900 mb-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
      >
        Your{' '}
        <span className="text-gradient-brand">AI Career Coach</span>
      </motion.h2>
      <motion.p
        className="text-sm text-neutral-500 max-w-sm mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1], delay: 0.13 }}
      >
        Ask anything about placements, resumes, interviews, skills, and career goals. I'm here to help.
      </motion.p>

      {/* Suggestion chips */}
      <motion.div
        className="flex flex-wrap gap-2 justify-center max-w-[640px]"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {CHIPS.map(({ label, icon, bg }) => (
          <motion.button
            key={label}
            type="button"
            onClick={() => onChipClick(label)}
            variants={staggerItem}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-2xl glass-surface border border-white/10 text-neutral-700 hover:border-brand-500/30 hover:text-brand-400 hover:shadow-glow-sm transition-colors duration-200"
          >
            <span
              className="w-5 h-5 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: bg }}
            >
              {icon}
            </span>
            {label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
