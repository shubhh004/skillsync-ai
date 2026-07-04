import { motion } from 'framer-motion';
import { fadeUp } from '../../../motion/variants';
import Button from '../../../components/ui/Button';

export default function DsaEmptyState({ hasFilters, onClear, onAdd }) {
  return (
    <motion.div className="card py-20" variants={fadeUp} initial="hidden" animate="show">
      <div className="text-center max-w-sm mx-auto">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand-subtle border border-brand-200/20 mb-5">
          <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 mb-2">
          {hasFilters ? 'No problems match your filters' : 'No problems logged yet'}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          {hasFilters
            ? "Try adjusting your search or filters to find what you're looking for."
            : 'Start tracking your DSA practice by adding your first problem.'}
        </p>

        <div className="mt-7">
          {hasFilters ? (
            <Button variant="outline" onClick={onClear}>Clear Filters</Button>
          ) : (
            <Button onClick={onAdd}>Add First Problem</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
