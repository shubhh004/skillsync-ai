import { motion } from 'framer-motion';
import { fadeUp } from '../../../motion/variants';
import Button from '../../../components/ui/Button';

export default function JobEmptyState({ hasFilters, onClear, onAdd }) {
  return (
    <motion.div
      className="card py-20 relative overflow-hidden"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      style={{ minHeight: 280 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(99,102,241,0.07) 0%, transparent 70%)',
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
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="url(#jobEmptyGrad)" strokeWidth={1.4}>
            <defs>
              <linearGradient id="jobEmptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-base font-bold mb-2" style={{ color: '#e4e4e7' }}>
          {hasFilters ? 'No applications match' : 'No applications yet'}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>
          {hasFilters
            ? 'Try adjusting your search or clearing the active filters.'
            : 'Start tracking your job hunt by adding your first application.'}
        </p>

        <div className="mt-7">
          {hasFilters ? (
            <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          ) : (
            <Button onClick={onAdd}>Add First Application</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
