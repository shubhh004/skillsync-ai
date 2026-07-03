const checks = [
  { label: 'Summary section included',           pass: true  },
  { label: 'Skills section is comprehensive',    pass: true  },
  { label: 'Contact details complete',           pass: true  },
  { label: 'Quantify achievements with numbers', pass: false },
  { label: 'Add more role-specific keywords',    pass: false },
];

const SCORE = 78;
const R     = 28;
const CIRC  = 2 * Math.PI * R;

export default function AtsScoreCard() {
  return (
    <div className="card p-4 flex flex-col gap-3">
      {/* Score row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-neutral-500 mb-0.5">ATS Score</p>
          <p className="text-[11px] text-neutral-500 leading-none">Good standing</p>
        </div>
        {/* Mini ring */}
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <circle
              cx="32" cy="32" r={R}
              fill="none"
              stroke="#6366f1"
              strokeWidth="7"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - (SCORE / 100) * CIRC}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-400 rotate-0">
            {SCORE}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${SCORE}%`, background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }}
        />
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5">
        {checks.map(({ label, pass }) => (
          <li key={label} className="flex items-start gap-2">
            <span
              className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                pass
                  ? 'text-success-500'
                  : 'text-warning-500'
              }`}
              style={{ background: pass ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)' }}
            >
              {pass ? '✓' : '!'}
            </span>
            <span className={`text-[11px] leading-relaxed ${pass ? 'text-neutral-600' : 'text-neutral-700'}`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
