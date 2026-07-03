import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const DIFF_CONFIG = {
  Easy:   { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',  text: '#22c55e' },
  Medium: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  Hard:   { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',  text: '#f87171' },
};

const STATUS_CONFIG = {
  Scheduled:     { dot: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  text: '#818cf8' },
  'In Progress': { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  Completed:     { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',  text: '#4ade80' },
};

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #22c55e, #16a34a)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
];

const avatarGradient = (name) =>
  AVATAR_GRADIENTS[(name || '?').charCodeAt(0) % AVATAR_GRADIENTS.length];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function computeDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const mins = Math.round((new Date(completedAt) - new Date(startedAt)) / 60000);
  return mins > 0 ? `${mins} min` : null;
}

function ScoreRing({ score }) {
  const size  = 52;
  const r     = (size - 8) / 2;
  const circ  = 2 * Math.PI * r;
  const pct   = Math.min((score || 0) / 100, 1);
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 4px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold leading-none tabular-nums" style={{ color }}>{score ?? 0}</span>
        <span className="text-[8px] leading-none mt-0.5" style={{ color: '#3f3f46' }}>/100</span>
      </div>
    </div>
  );
}

function DiffBadge({ label }) {
  const c = DIFF_CONFIG[label] ?? DIFF_CONFIG.Medium;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const c = STATUS_CONFIG[label] ?? STATUS_CONFIG.Scheduled;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

export default function InterviewCard({ interview, onEdit, onDelete, onView }) {
  const navigate  = useNavigate();
  const duration  = computeDuration(interview.startedAt, interview.completedAt);
  const qCount    = interview.questions?.length || 0;
  const seedName  = interview.company || interview.role || 'I';

  const handleStart = (e) => {
    e.stopPropagation();
    navigate('/interview/session', {
      state: {
        role:        interview.role,
        difficulty:  interview.difficulty,
        interviewId: interview._id,
      },
    });
  };

  return (
    <div
      className="group relative flex flex-col gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-ring"
      role="button"
      tabIndex={0}
      onClick={() => onView(interview)}
      onKeyDown={(e) => e.key === 'Enter' && onView(interview)}
      style={{
        background: 'rgba(24,24,27,0.65)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.08)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: avatarGradient(seedName), boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            {seedName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate leading-tight" style={{ color: '#e4e4e7' }}>
              {interview.role || '—'}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: '#71717a' }}>
              {interview.company || 'No company'}
            </p>
          </div>
        </div>

        {/* Actions — fade in on hover */}
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            aria-label="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(interview); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: '#52525b', border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#52525b'; e.currentTarget.style.border = '1px solid transparent'; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(interview); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: '#52525b', border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#52525b'; e.currentTarget.style.border = '1px solid transparent'; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Badges + Score ring */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {interview.difficulty && <DiffBadge label={interview.difficulty} />}
          {interview.status && <StatusBadge label={interview.status} />}
        </div>
        <ScoreRing score={interview.score ?? 0} />
      </div>

      {/* Meta chips */}
      <div className="flex items-center gap-3 flex-wrap" style={{ color: '#52525b', fontSize: 11 }}>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {formatDate(interview.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          {qCount} Q
        </span>
        {duration && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Button size="sm" fullWidth onClick={handleStart}>
          Start Interview
        </Button>
      </div>
    </div>
  );
}
