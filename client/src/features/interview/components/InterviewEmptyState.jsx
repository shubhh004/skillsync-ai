import { motion } from 'framer-motion';
import { fadeUp } from '../../../motion/variants';
import Button from '../../../components/ui/Button';

export default function InterviewEmptyState({ onAdd }) {
  return (
    <motion.div
      className="card py-20 relative overflow-hidden"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      style={{ minHeight: 300 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative text-center max-w-sm mx-auto">
        {/* Gradient icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 32px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="url(#ivEmptyGrad)" strokeWidth={1.4}>
            <defs>
              <linearGradient id="ivEmptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h3 className="text-base font-bold mb-2" style={{ color: '#e4e4e7' }}>
          No interviews yet
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>
          Create your first mock interview to start practising with AI-powered feedback and scoring.
        </p>

        <div className="mt-7">
          <Button onClick={onAdd}>Create First Interview</Button>
        </div>
      </div>
    </motion.div>
  );
}
