import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropTransition, springModal, dropdownTransition } from '../../motion/variants';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InterviewCard from './components/InterviewCard';
import InterviewModal from './components/InterviewModal';
import InterviewDeleteDialog from './components/InterviewDeleteDialog';
import InterviewEmptyState from './components/InterviewEmptyState';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../../services/interviewService';

// ─── Constants ────────────────────────────────────────────────────────────────
const DIFF_COLORS   = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const STATUS_COLORS = { Scheduled: '#6366f1', 'In Progress': '#f59e0b', Completed: '#22c55e' };

const STAT_PALETTE = {
  brand:   { color: '#818cf8', bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.2)'   },
  success: { color: '#4ade80', bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.2)'    },
  warning: { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)'   },
  danger:  { color: '#f87171', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.2)'    },
  neutral: { color: '#a1a1aa', bg: 'rgba(113,113,122,0.08)',  border: 'rgba(113,113,122,0.2)'  },
};

const DARK_TOOLTIP = {
  contentStyle: {
    background: 'rgba(15,15,17,0.96)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    fontSize: 11,
    color: '#d4d4d8',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#a1a1aa' },
  itemStyle:  { color: '#d4d4d8' },
  cursor:     { stroke: 'rgba(255,255,255,0.06)' },
};

const TICK_STYLE = { fontSize: 10, fill: '#52525b' };

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const shortDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

// ─── Analytics ────────────────────────────────────────────────────────────────
function computeAnalytics(interviews) {
  if (!interviews.length) return null;

  const completed = interviews.filter((i) => i.status === 'Completed');
  const scheduled = interviews.filter((i) => i.status === 'Scheduled');
  const scores    = interviews.map((i) => i.score || 0);
  const avgScore  = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highScore = Math.max(...scores);

  const trendData = [...interviews]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10)
    .map((iv, idx) => ({ label: shortDate(iv.createdAt), index: idx + 1, score: iv.score || 0 }));

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  interviews.forEach((iv) => { if (iv.difficulty) diffCounts[iv.difficulty]++; });
  const diffData = Object.entries(diffCounts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  const statusCounts = { Scheduled: 0, 'In Progress': 0, Completed: 0 };
  interviews.forEach((iv) => { if (iv.status) statusCounts[iv.status]++; });
  const statusData = Object.entries(statusCounts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  const completionPcts = interviews.map((iv) => {
    if (!iv.questions?.length) return 0;
    return Math.round((iv.questions.filter((q) => q.answer?.trim()).length / iv.questions.length) * 100);
  });
  const avgCompletion = Math.round(completionPcts.reduce((a, b) => a + b, 0) / completionPcts.length);

  const durations = completed
    .filter((iv) => iv.startedAt && iv.completedAt)
    .map((iv) => Math.round((new Date(iv.completedAt) - new Date(iv.startedAt)) / 60000))
    .filter((d) => d > 0);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;

  const diffScoreMap = {};
  interviews.forEach((iv) => {
    if (!iv.difficulty) return;
    if (!diffScoreMap[iv.difficulty]) diffScoreMap[iv.difficulty] = [];
    diffScoreMap[iv.difficulty].push(iv.score || 0);
  });
  const diffAvgs = Object.entries(diffScoreMap).map(([diff, s]) => ({
    diff, avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length),
  }));
  const strongest = diffAvgs.length ? diffAvgs.reduce((a, b) => (a.avg >= b.avg ? a : b)) : null;
  const weakest   = diffAvgs.length ? diffAvgs.reduce((a, b) => (a.avg <= b.avg ? a : b)) : null;

  return {
    total: interviews.length, avgScore, highScore,
    completedCount: completed.length, scheduledCount: scheduled.length,
    trendData, diffData, statusData, avgCompletion, avgDuration,
    strongestTopic: strongest?.diff || '—',
    weakestTopic:   weakest?.diff   || '—',
  };
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix = '', color = 'brand' }) {
  const c = STAT_PALETTE[color] || STAT_PALETTE.brand;
  return (
    <div className="card p-4 flex flex-col gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#52525b' }}>{label}</p>
      <p className="text-3xl font-bold leading-none tabular-nums" style={{ color: c.color }}>
        {value}
        {suffix && <span className="text-base font-normal ml-0.5" style={{ color: c.color, opacity: 0.6 }}>{suffix}</span>}
      </p>
    </div>
  );
}

// ─── Insight card ─────────────────────────────────────────────────────────────
function InsightCard({ label, value, color = 'brand' }) {
  const c = STAT_PALETTE[color] || STAT_PALETTE.brand;
  return (
    <div className="card p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#52525b' }}>{label}</p>
      <p className="text-sm font-bold truncate" style={{ color: c.color }}>{value}</p>
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function ScoreTrendChart({ data }) {
  if (!data.length) return <p className="text-xs py-8 text-center" style={{ color: '#3f3f46' }}>No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Tooltip {...DARK_TOOLTIP} formatter={(v) => [`${v}/100`, 'Score']} labelFormatter={(l) => `Date: ${l}`} />
        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2}
          dot={{ r: 3, fill: '#6366f1', stroke: 'rgba(99,102,241,0.4)', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: '#6366f1', stroke: '#a5b4fc', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DifficultyChart({ data }) {
  if (!data.length) return <p className="text-xs py-8 text-center" style={{ color: '#3f3f46' }}>No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Tooltip {...DARK_TOOLTIP} formatter={(v) => [v, 'Interviews']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={DIFF_COLORS[entry.name] || '#71717a'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function StatusChart({ data }) {
  if (!data.length) return <p className="text-xs py-8 text-center" style={{ color: '#3f3f46' }}>No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#71717a'} />
          ))}
        </Pie>
        <Tooltip {...DARK_TOOLTIP} formatter={(v, name) => [v, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Analytics section ────────────────────────────────────────────────────────
function AnalyticsSection({ analytics }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#52525b' }}>Analytics</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total"      value={analytics.total}          color="neutral" />
        <StatCard label="Avg Score"  value={analytics.avgScore}       color="brand"   suffix="/100" />
        <StatCard label="Best Score" value={analytics.highScore}      color="success" suffix="/100" />
        <StatCard label="Completed"  value={analytics.completedCount} color="success" />
        <StatCard label="Scheduled"  value={analytics.scheduledCount} color="brand"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { title: 'Score Trend (Last 10)', chart: <ScoreTrendChart data={analytics.trendData} /> },
          { title: 'Difficulty Distribution', chart: <DifficultyChart data={analytics.diffData} /> },
          { title: 'Status Distribution',     chart: <StatusChart data={analytics.statusData} /> },
        ].map(({ title, chart }) => (
          <div key={title} className="card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#52525b' }}>{title}</p>
            {chart}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InsightCard label="Strongest Topic"  value={analytics.strongestTopic} color="success" />
        <InsightCard label="Weakest Topic"    value={analytics.weakestTopic}   color="danger"  />
        <InsightCard label="Avg Completion"   value={`${analytics.avgCompletion}%`} color="brand" />
        <InsightCard label="Avg Duration"     value={analytics.avgDuration ? `${analytics.avgDuration} min` : '—'} color="neutral" />
      </div>
    </div>
  );
}

// ─── Premium FilterSelect (inline, no new file) ───────────────────────────────
function FilterSelect({ value, onChange, options, placeholder, minWidth = 148 }) {
  const [open, setOpen]               = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const select = (val) => { onChange(val); setOpen(false); };

  const handleKeyDown = (e) => {
    if (!open) { if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); setOpen(true); setHighlighted(0); } return; }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlighted((h) => Math.min(h + 1, options.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); break;
      case 'Enter':     e.preventDefault(); if (highlighted >= 0 && options[highlighted]) select(options[highlighted].value); break;
      case 'Escape':    setOpen(false); break;
      default: break;
    }
  };

  const active   = options.find((o) => o.value === value);
  const isActive = !!value;

  return (
    <div ref={containerRef} className="relative" style={{ minWidth }} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl text-xs font-medium transition-all duration-150 focus:outline-none"
        style={{
          background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(24,24,27,0.65)',
          border: isActive ? '1px solid rgba(99,102,241,0.35)' : open ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(16px)',
          color: isActive ? '#a5b4fc' : '#71717a',
          boxShadow: open ? '0 0 0 2px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {active?.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active.dot }} />}
          <span className="truncate">{active?.label ?? placeholder}</span>
        </span>
        <svg className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#52525b' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
      {open && (
        <motion.div
          className="absolute top-full left-0 mt-1.5 z-50 rounded-xl overflow-hidden"
          variants={dropdownTransition}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            minWidth: Math.max(minWidth, 160),
            background: 'rgba(15,15,17,0.96)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
          }}
          role="listbox"
        >
          <div className="py-1">
            <div role="option" aria-selected={!value} onClick={() => select('')}
              onMouseEnter={() => setHighlighted(-1)}
              className="flex items-center justify-between gap-2 mx-1 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-medium transition-colors duration-100"
              style={{ color: !value ? '#a5b4fc' : '#71717a', background: !value ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
              <span>{placeholder}</span>
              {!value && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
            </div>
            <div className="mx-2 my-1" style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
            {options.map((opt, i) => {
              const isSelected = value === opt.value;
              const isHovered  = highlighted === i;
              return (
                <div key={opt.value} role="option" aria-selected={isSelected}
                  onClick={() => select(opt.value)} onMouseEnter={() => setHighlighted(i)}
                  className="flex items-center gap-2 mx-1 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-medium transition-colors duration-100"
                  style={{
                    color: isSelected ? '#a5b4fc' : isHovered ? '#e4e4e7' : '#a1a1aa',
                    background: isSelected ? 'rgba(99,102,241,0.12)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}>
                  {opt.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opt.dot }} />}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
const DIFF_OPTIONS   = [{ value: 'Easy', label: 'Easy', dot: '#22c55e' }, { value: 'Medium', label: 'Medium', dot: '#f59e0b' }, { value: 'Hard', label: 'Hard', dot: '#ef4444' }];
const STATUS_OPTIONS = [{ value: 'Scheduled', label: 'Scheduled', dot: '#6366f1' }, { value: 'In Progress', label: 'In Progress', dot: '#f59e0b' }, { value: 'Completed', label: 'Completed', dot: '#22c55e' }];
const SORT_OPTIONS   = [{ value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }, { value: 'highest', label: 'Highest Score' }, { value: 'lowest', label: 'Lowest Score' }];

function FilterBar({ searchRole, searchCompany, filterDifficulty, filterStatus, sortBy, onChange }) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input
          placeholder="Search by role…"
          value={searchRole}
          onChange={(e) => onChange('searchRole', e.target.value)}
        />
        <Input
          placeholder="Filter by company…"
          value={searchCompany}
          onChange={(e) => onChange('searchCompany', e.target.value)}
        />
        <FilterSelect
          value={filterDifficulty}
          onChange={(v) => onChange('filterDifficulty', v)}
          options={DIFF_OPTIONS}
          placeholder="All Difficulties"
          minWidth={140}
        />
        <FilterSelect
          value={filterStatus}
          onChange={(v) => onChange('filterStatus', v)}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
          minWidth={132}
        />
        <FilterSelect
          value={sortBy}
          onChange={(v) => onChange('sortBy', v)}
          options={SORT_OPTIONS}
          placeholder="Newest First"
          minWidth={136}
        />
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────
const DIFF_CONFIG_DET = {
  Easy:   { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  text: '#22c55e' },
  Medium: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  Hard:   { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  text: '#f87171' },
};
const STATUS_CONFIG_DET = {
  Scheduled:     { dot: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  text: '#818cf8' },
  'In Progress': { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  Completed:     { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',  text: '#4ade80' },
};

function DetailBadge({ label, config }) {
  const c = config[label];
  if (!c || !label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

function DetailScoreRing({ score }) {
  const size  = 64;
  const r     = (size - 8) / 2;
  const circ  = 2 * Math.PI * r;
  const pct   = Math.min((score || 0) / 100, 1);
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative flex-shrink-0 mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}80)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none tabular-nums" style={{ color }}>{score ?? 0}</span>
        <span className="text-[9px] leading-none mt-0.5" style={{ color: '#3f3f46' }}>/100</span>
      </div>
    </div>
  );
}

function InterviewDetailModal({ interview, onClose }) {
  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
        variants={backdropTransition}
        initial="hidden"
        animate="show"
        exit="exit"
      />
      <motion.div
        className="modal-panel max-w-2xl"
        variants={springModal}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold truncate" style={{ color: '#e4e4e7' }}>
              {interview.role || 'Mock Interview'}
            </h2>
            {interview.company && (
              <p className="text-xs truncate mt-0.5" style={{ color: '#71717a' }}>{interview.company}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="modal-close flex-shrink-0" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <DetailBadge label={interview.difficulty} config={DIFF_CONFIG_DET} />
            <DetailBadge label={interview.status} config={STATUS_CONFIG_DET} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-4 flex flex-col items-center gap-2"
              style={{ background: 'rgba(24,24,27,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <DetailScoreRing score={interview.score ?? 0} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#52525b' }}>Score</p>
            </div>
            <div className="rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center"
              style={{ background: 'rgba(24,24,27,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold tabular-nums" style={{ color: '#d4d4d8' }}>{formatDate(interview.createdAt)}</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#52525b' }}>Created</p>
            </div>
            <div className="rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center"
              style={{ background: 'rgba(24,24,27,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold tabular-nums" style={{ color: interview.completedAt ? '#d4d4d8' : '#3f3f46' }}>
                {formatDate(interview.completedAt)}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#52525b' }}>Completed</p>
            </div>
          </div>

          {/* Feedback */}
          {interview.feedback && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#52525b' }}>Feedback</p>
              <p className="text-sm leading-relaxed rounded-xl p-4"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', color: '#c7d2fe' }}>
                {interview.feedback}
              </p>
            </div>
          )}

          {/* Questions */}
          {interview.questions && interview.questions.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#52525b' }}>
                Questions ({interview.questions.length})
              </p>
              {interview.questions.map((q, i) => {
                const sc     = q.score ?? 0;
                const scCol  = sc >= 70 ? '#22c55e' : sc >= 40 ? '#f59e0b' : '#ef4444';
                const scBg   = sc >= 70 ? 'rgba(34,197,94,0.08)'  : sc >= 40 ? 'rgba(245,158,11,0.08)'  : 'rgba(239,68,68,0.08)';
                const scBord = sc >= 70 ? 'rgba(34,197,94,0.25)'  : sc >= 40 ? 'rgba(245,158,11,0.25)'  : 'rgba(239,68,68,0.25)';
                return (
                  <div key={i} className="rounded-2xl p-4 space-y-3"
                    style={{ background: 'rgba(24,24,27,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                        Q{i + 1}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={{ background: scBg, border: `1px solid ${scBord}`, color: scCol }}>
                        {sc}/100
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#d4d4d8' }}>{q.question}</p>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#52525b' }}>Your Answer</p>
                      {q.answer
                        ? <p className="text-xs leading-relaxed rounded-xl p-3 whitespace-pre-wrap"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#a1a1aa' }}>
                            {q.answer}
                          </p>
                        : <p className="text-xs italic" style={{ color: '#3f3f46' }}>No answer provided.</p>
                      }
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#52525b' }}>Ideal Answer</p>
                      <p className="text-xs leading-relaxed rounded-xl p-3 whitespace-pre-wrap"
                        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', color: '#c7d2fe' }}>
                        {q.idealAnswer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Glass toast ──────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const isSuccess = toast?.type !== 'error';
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message + toast.type}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.15 } }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{
            background: isSuccess ? 'rgba(20,30,22,0.88)' : 'rgba(30,18,18,0.88)',
            backdropFilter: 'blur(20px)',
            border: isSuccess ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(239,68,68,0.28)',
            boxShadow: isSuccess
              ? '0 0 0 1px rgba(34,197,94,0.1), 0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(34,197,94,0.12)'
              : '0 0 0 1px rgba(239,68,68,0.1), 0 8px 32px rgba(0,0,0,0.45), 0 0 20px rgba(239,68,68,0.12)',
          }}
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
            style={{ background: isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: isSuccess ? '#22c55e' : '#ef4444' }}>
            {isSuccess ? '✓' : '✕'}
          </span>
          <span style={{ color: isSuccess ? '#86efac' : '#fca5a5' }}>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-20 skeleton-shimmer rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="card h-52 skeleton-shimmer rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="card h-52 skeleton-shimmer rounded-2xl" />)}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const [interviews,       setInterviews]       = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [modal,            setModal]            = useState(null);
  const [editTarget,       setEditTarget]       = useState(null);
  const [deleteTarget,     setDeleteTarget]     = useState(null);
  const [detailTarget,     setDetailTarget]     = useState(null);
  const [toast,            setToast]            = useState(null);

  const [searchRole,       setSearchRole]       = useState('');
  const [searchCompany,    setSearchCompany]    = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus,     setFilterStatus]     = useState('');
  const [sortBy,           setSortBy]           = useState('newest');

  const filterSetters = { searchRole: setSearchRole, searchCompany: setSearchCompany, filterDifficulty: setFilterDifficulty, filterStatus: setFilterStatus, sortBy: setSortBy };
  const handleFilterChange = useCallback((key, value) => filterSetters[key]?.(value), []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchInterviews = useCallback(() => {
    setLoading(true);
    getInterviews()
      .then(setInterviews)
      .catch(() => showToast('Failed to load interviews.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const analytics = useMemo(() => computeAnalytics(interviews), [interviews]);

  const filteredInterviews = useMemo(() => {
    let list = [...interviews];
    if (searchRole)       list = list.filter((i) => (i.role || '').toLowerCase().includes(searchRole.toLowerCase()));
    if (searchCompany)    list = list.filter((i) => (i.company || '').toLowerCase().includes(searchCompany.toLowerCase()));
    if (filterDifficulty) list = list.filter((i) => i.difficulty === filterDifficulty);
    if (filterStatus)     list = list.filter((i) => i.status === filterStatus);
    switch (sortBy) {
      case 'oldest':  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'highest': list.sort((a, b) => (b.score || 0) - (a.score || 0)); break;
      case 'lowest':  list.sort((a, b) => (a.score || 0) - (b.score || 0)); break;
      default:        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [interviews, searchRole, searchCompany, filterDifficulty, filterStatus, sortBy]);

  const handleSave = async (form) => {
    if (modal === 'add') {
      const created = await createInterview(form);
      setInterviews((prev) => [created, ...prev]);
      showToast('Interview created.');
    } else {
      const updated = await updateInterview(editTarget._id, form);
      setInterviews((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      showToast('Interview updated.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInterview(deleteTarget._id);
      setInterviews((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      showToast('Interview deleted.');
    } catch {
      showToast('Failed to delete interview.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAdd    = () => { setEditTarget(null); setModal('add'); };
  const openEdit   = (iv) => { setEditTarget(iv); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };
  const openView   = (iv) => setDetailTarget(iv);
  const closeView  = () => setDetailTarget(null);

  const clearFilters = () => {
    setSearchRole(''); setSearchCompany('');
    setFilterDifficulty(''); setFilterStatus(''); setSortBy('newest');
  };
  const hasFilters = searchRole || searchCompany || filterDifficulty || filterStatus || sortBy !== 'newest';

  return (
    <DashboardLayout title="AI Interviews">
      <div className="space-y-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 55%, #4338ca 100%)',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.35), 0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none" style={{ color: '#e4e4e7' }}>AI Interviews</h2>
              <p className="mt-1 text-xs leading-none" style={{ color: '#52525b' }}>
                Track mock interviews, scores and analytics
              </p>
            </div>
          </div>
          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>+ Create Interview</Button>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {loading ? (
          <PageSkeleton />
        ) : interviews.length === 0 ? (
          <InterviewEmptyState onAdd={openAdd} />
        ) : (
          <>
            {analytics && <AnalyticsSection analytics={analytics} />}

            <FilterBar
              searchRole={searchRole}
              searchCompany={searchCompany}
              filterDifficulty={filterDifficulty}
              filterStatus={filterStatus}
              sortBy={sortBy}
              onChange={handleFilterChange}
            />

            {filteredInterviews.length === 0 ? (
              <div
                className="card py-16 relative overflow-hidden text-center"
                style={{ minHeight: 220 }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 60%, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
                />
                <p className="text-sm font-medium mb-2" style={{ color: '#52525b' }}>
                  No interviews match your filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold transition-colors duration-150 hover:underline"
                  style={{ color: '#818cf8' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {hasFilters && (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}
                    >
                      {filteredInterviews.length} result{filteredInterviews.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs" style={{ color: '#3f3f46' }}>of {interviews.length} interviews</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard
                      key={interview._id}
                      interview={interview}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                      onView={openView}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <InterviewModal key="interview-modal" mode={modal} initial={editTarget} onClose={closeModal} onSave={handleSave} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteTarget && (
          <InterviewDeleteDialog key="interview-delete" interview={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {detailTarget && (
          <InterviewDetailModal key="interview-detail" interview={detailTarget} onClose={closeView} />
        )}
      </AnimatePresence>
      <Toast toast={toast} />
    </DashboardLayout>
  );
}
