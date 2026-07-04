import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { staggerContainer, staggerItem } from '../motion/variants';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatCard from '../components/dashboard/StatCard';
import DsaStatsCard from '../components/dashboard/DsaStatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import { getDashboard } from '../services/dashboardService';
import { getLatestRoadmap } from '../features/career/roadmapService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function computeReadiness(data) {
  const dsaScore       = Math.min(data.dsa.solved / 50, 1) * 25;
  const resumeScore    = (data.resumeCompletion / 100) * 25;
  const jobScore       = Math.min(data.jobs.total / 10, 1) * 25;
  const interviewScore = data.interviews.total > 0 ? (data.interviews.avgScore / 100) * 25 : 0;
  return Math.round(dsaScore + resumeScore + jobScore + interviewScore);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="skeleton-shimmer h-8 w-52" />
      <div className="skeleton-shimmer h-28 rounded-2xl" />
      <div className="skeleton-shimmer h-24 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-shimmer h-32 rounded-2xl" />)}
      </div>
      <div className="skeleton-shimmer h-32 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="skeleton-shimmer h-52 rounded-2xl" />
        <div className="skeleton-shimmer h-52 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="skeleton-shimmer h-44 rounded-2xl" />
        <div className="skeleton-shimmer h-44 rounded-2xl" />
      </div>
      <div className="skeleton-shimmer h-20 rounded-2xl" />
      <div className="skeleton-shimmer h-64 rounded-2xl" />
    </div>
  );
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────
function DashboardHeader({ readiness }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const chip =
    readiness === null ? null
    : readiness >= 70  ? { label: 'On Track',   cls: 'badge-success badge-dot' }
    : readiness >= 40  ? { label: 'Improving',  cls: 'badge-warning badge-dot' }
    :                    { label: 'Needs Focus', cls: 'badge-danger  badge-dot' };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{today}</p>
      </div>
      {chip && (
        <span className={`${chip.cls} flex-shrink-0`}>{chip.label}</span>
      )}
    </div>
  );
}

// ─── Placement Readiness ──────────────────────────────────────────────────────
function PlacementReadiness({ data, score }) {
  const barClass  = score >= 70 ? 'bg-success-500' : score >= 40 ? 'bg-warning-500' : 'bg-danger-500';
  const textClass = score >= 70 ? 'text-success-700' : score >= 40 ? 'text-warning-700' : 'text-danger-700';

  const pillars = [
    { label: 'DSA',        pct: Math.round(Math.min(data.dsa.solved / 50, 1) * 100),            link: '/dsa'       },
    { label: 'Resume',     pct: data.resumeCompletion,                                            link: '/resume'    },
    { label: 'Jobs',       pct: Math.round(Math.min(data.jobs.total / 10, 1) * 100),             link: '/jobs'      },
    { label: 'Interviews', pct: data.interviews.total > 0 ? data.interviews.avgScore : 0,        link: '/interview' },
  ];

  return (
    <div className="card-brand p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Placement Readiness</h3>
          <p className="text-xs text-neutral-500 mt-0.5">DSA · Resume · Jobs · Interviews</p>
        </div>
        <span className={`text-3xl font-bold ${textClass} tracking-tight tabular-nums`}>{score}%</span>
      </div>

      {/* Main bar */}
      <div className="h-2.5 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-smooth"
          style={{
            width: `${score}%`,
            background: score >= 70
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : score >= 40
              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : 'linear-gradient(90deg, #ef4444, #dc2626)',
            boxShadow: score >= 70
              ? '0 0 8px rgba(34,197,94,0.55)'
              : score >= 40
              ? '0 0 8px rgba(245,158,11,0.55)'
              : '0 0 8px rgba(239,68,68,0.55)',
          }}
        />
      </div>

      {/* Pillar breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pillars.map(({ label, pct, link }) => (
          <Link
            key={label}
            to={link}
            className="group text-center p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <p className="text-sm font-bold text-neutral-800 group-hover:text-brand-400 transition-colors tabular-nums">{pct}%</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Roadmap Progress Widget ──────────────────────────────────────────────────
function RoadmapProgressWidget() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestRoadmap()
      .then(setRoadmap)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="skeleton-shimmer h-24 rounded-2xl" />;
  }

  if (!roadmap) {
    return (
      <div className="card p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Placement Roadmap</h3>
          <p className="text-xs text-neutral-500 mt-0.5">No roadmap generated yet</p>
        </div>
        <Link
          to="/career"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full gradient-brand-subtle border border-brand-200/20 text-brand-400 hover:shadow-glow-sm transition-all duration-200 flex-shrink-0"
        >
          Generate →
        </Link>
      </div>
    );
  }

  const pct = roadmap.checklistTotal > 0
    ? Math.round((roadmap.checklistDone / roadmap.checklistTotal) * 100)
    : 0;
  const scoreColor = roadmap.readinessScore >= 70 ? 'text-success-700'
    : roadmap.readinessScore >= 40 ? 'text-warning-700' : 'text-danger-700';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-800">Placement Roadmap</h3>
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {roadmap.targetRole} at {roadmap.targetCompany}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xl font-bold tabular-nums ${scoreColor}`}>{roadmap.readinessScore}%</span>
          <Link to="/career" className="text-xs font-semibold text-brand-400 hover:text-brand-500 transition-colors">
            View →
          </Link>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Tasks completed</span>
          <span className="tabular-nums font-medium">{roadmap.checklistDone}/{roadmap.checklistTotal} ({pct}%)</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-smooth"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 6px rgba(99,102,241,0.45)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Weekly Goals ─────────────────────────────────────────────────────────────
const GOAL_BAR = {
  dsa:       'bg-brand-500',
  jobs:      'bg-warning-500',
  interview: 'bg-success-500',
};

function GoalRow({ label, current, target, barKey, suffix = '' }) {
  const pct  = Math.min(Math.round((current / target) * 100), 100);
  const done = current >= target;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span className={`text-xs font-semibold tabular-nums ${done ? 'text-success-700' : 'text-neutral-500'}`}>
          {current}/{target}{suffix}{done ? ' ✓' : ''}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-smooth"
          style={{
            width: `${pct}%`,
            background: done
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : barKey === 'dsa'       ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              : barKey === 'jobs'      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : /* interview */          'linear-gradient(90deg, #22c55e, #16a34a)',
            boxShadow: done
              ? '0 0 6px rgba(34,197,94,0.5)'
              : barKey === 'dsa'       ? '0 0 6px rgba(99,102,241,0.45)'
              : barKey === 'jobs'      ? '0 0 6px rgba(245,158,11,0.45)'
              :                          '0 0 6px rgba(34,197,94,0.45)',
          }}
        />
      </div>
    </div>
  );
}

function WeeklyGoalsCard({ weekly }) {
  const resumeDone = weekly.resumeUpdated;
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Weekly Goals</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Resets every 7 days</p>
        </div>
      </div>
      <div className="card-body space-y-4">
        <GoalRow label="DSA Problems"     current={weekly.dsaProblems}    target={5} barKey="dsa"       suffix=" this week" />
        <GoalRow label="Job Applications" current={weekly.jobsApplied}    target={5} barKey="jobs"      suffix=" this week" />
        <GoalRow label="Mock Interviews"  current={weekly.interviewsDone} target={2} barKey="interview" suffix=" this week" />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-neutral-500">Resume Update</span>
            <span className={`text-xs font-semibold ${resumeDone ? 'text-success-700' : 'text-neutral-400'}`}>
              {resumeDone ? 'Done ✓' : 'Pending'}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-smooth"
              style={{
                width: resumeDone ? '100%' : '0%',
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                boxShadow: '0 0 6px rgba(34,197,94,0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Upcoming ─────────────────────────────────────────────────────────────────
const DIFF_BADGE_CLASS = {
  Easy:   'badge-success',
  Medium: 'badge-warning',
  Hard:   'badge-danger',
};

function UpcomingCard({ upcoming }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">Upcoming Interviews</h3>
        <Link to="/interview" className="text-xs font-semibold text-brand-400 hover:text-brand-500 transition-colors">
          View all →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-5 py-10 text-center space-y-2">
          <p className="text-sm text-neutral-500">No upcoming interviews.</p>
          <Link to="/interview" className="text-sm text-brand-400 hover:underline font-medium">
            Schedule one →
          </Link>
        </div>
      ) : (
        <ul>
          {upcoming.map((iv, i) => (
            <li
              key={iv._id}
              className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors duration-150"
              style={i < upcoming.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : undefined}
            >
              <div className="mt-0.5 w-8 h-8 rounded-xl gradient-brand-subtle border border-brand-200/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{iv.role || 'Mock Interview'}</p>
                {iv.company && <p className="text-xs text-neutral-500 truncate">{iv.company}</p>}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {iv.difficulty && (
                  <span className={DIFF_BADGE_CLASS[iv.difficulty] ?? 'badge-neutral'}>{iv.difficulty}</span>
                )}
                <span className="text-xs text-neutral-400">{formatDate(iv.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Job Summary ──────────────────────────────────────────────────────────────
const JOB_STATUS_ORDER = ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Accepted', 'Rejected'];
const JOB_STATUS_BADGE = {
  Applied:   'badge-brand',
  OA:        'badge-neutral',
  Interview: 'badge-warning',
  HR:        'badge-warning',
  Offer:     'badge-success',
  Accepted:  'badge-success',
  Rejected:  'badge-danger',
};

function JobSummaryCard({ jobs }) {
  const navigate = useNavigate();
  const byStatus = jobs.byStatus || {};
  const entries  = JOB_STATUS_ORDER.filter((s) => byStatus[s] > 0).map((s) => ({ status: s, count: byStatus[s] }));

  return (
    <div
      className="card overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/jobs')}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/jobs')}
    >
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">Job Applications</h3>
        <Link
          to="/jobs"
          className="text-xs font-semibold text-brand-400 hover:text-brand-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View all →
        </Link>
      </div>

      {jobs.total === 0 ? (
        <div className="px-5 py-10 text-center space-y-2">
          <p className="text-sm text-neutral-500">No jobs tracked yet.</p>
          <Link
            to="/jobs"
            className="text-sm text-brand-400 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Track your first application →
          </Link>
        </div>
      ) : (
        <div className="card-body space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900 tracking-tight tabular-nums">{jobs.total}</span>
            <span className="text-sm text-neutral-400">total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entries.map(({ status, count }) => (
              <span key={status} className={JOB_STATUS_BADGE[status] ?? 'badge-neutral'}>
                {status} <span className="font-bold tabular-nums">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Interview Summary ────────────────────────────────────────────────────────
function InterviewSummaryCard({ interviews }) {
  const navigate   = useNavigate();
  const scoreClass = interviews.avgScore >= 70 ? 'text-success-700'
    : interviews.avgScore >= 40 ? 'text-warning-700' : 'text-neutral-500';

  return (
    <div
      className="card overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/interview')}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/interview')}
    >
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">AI Interviews</h3>
        <Link
          to="/interview"
          className="text-xs font-semibold text-brand-400 hover:text-brand-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View all →
        </Link>
      </div>

      {interviews.total === 0 ? (
        <div className="px-5 py-10 text-center space-y-2">
          <p className="text-sm text-neutral-500">No interviews completed yet.</p>
          <Link
            to="/interview"
            className="text-sm text-brand-400 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Start your first interview →
          </Link>
        </div>
      ) : (
        <div className="card-body space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900 tracking-tight tabular-nums">{interviews.total}</span>
            <span className="text-sm text-neutral-400">total</span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="text-center">
              <p className="text-base font-bold text-neutral-800 tabular-nums">{interviews.completed}</p>
              <p className="text-xs text-neutral-500">Completed</p>
            </div>
            <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <p className={`text-base font-bold tabular-nums ${scoreClass}`}>{interviews.avgScore}</p>
              <p className="text-xs text-neutral-500">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-neutral-800 tabular-nums">{interviews.highScore}</p>
              <p className="text-xs text-neutral-500">Best Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Achievement Badges ───────────────────────────────────────────────────────
const BADGES = [
  { id: 'first_dsa',       icon: '💻', label: 'First Problem',     check: (d) => d.dsa.total            >= 1   },
  { id: 'dsa_10',          icon: '🔥', label: '10 Problems',       check: (d) => d.dsa.total            >= 10  },
  { id: 'dsa_50',          icon: '⚡', label: '50 Problems',       check: (d) => d.dsa.total            >= 50  },
  { id: 'solver',          icon: '✅', label: 'Problem Solver',    check: (d) => d.dsa.solved           >= 1   },
  { id: 'resume_complete', icon: '📄', label: 'Resume Complete',   check: (d) => d.resumeCompletion     >= 100 },
  { id: 'first_job',       icon: '💼', label: 'First Application', check: (d) => d.jobs.total           >= 1   },
  { id: 'first_interview', icon: '🎤', label: 'First Interview',   check: (d) => d.interviews.total     >= 1   },
  { id: 'interview_ace',   icon: '🏆', label: 'Interview Ace',     check: (d) => d.interviews.highScore >= 80  },
];

function AchievementBadges({ data }) {
  const earned = useMemo(() => BADGES.filter((b) => b.check(data)), [data]);
  if (!earned.length) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-neutral-800 mb-3">Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {earned.map(({ id, icon, label }) => (
          <span key={id} className="badge-brand">
            {icon} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
const ACTIVITY_CONFIG = {
  dsa:       { iconStyle: { background: 'rgba(108,92,255,0.12)', border: '1px solid rgba(108,92,255,0.22)' }, iconColor: '#a78bfa',  label: 'DSA',       badgeClass: 'badge-brand'   },
  job:       { iconStyle: { background: 'rgba(245,158,11,0.1)',  border: '1px solid rgba(245,158,11,0.2)'  }, iconColor: '#fcd34d',  label: 'Job',       badgeClass: 'badge-warning' },
  interview: { iconStyle: { background: 'rgba(168,85,247,0.1)',  border: '1px solid rgba(168,85,247,0.2)'  }, iconColor: '#d8b4fe',  label: 'Interview', badgeClass: 'badge-success' },
  resume:    { iconStyle: { background: 'rgba(34,197,94,0.1)',   border: '1px solid rgba(34,197,94,0.2)'   }, iconColor: '#86efac',  label: 'Resume',    badgeClass: 'badge-neutral' },
};

const ACTIVITY_SVG = {
  dsa: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  job: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  interview: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  resume: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

function RecentActivityCard({ items }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">Recent Activity</h3>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-neutral-500">
            No activity yet. Start by adding a DSA problem or logging a job.
          </p>
        </div>
      ) : (
        <ul>
          {items.map((item, i) => {
            const cfg = ACTIVITY_CONFIG[item.type] ?? ACTIVITY_CONFIG.dsa;
            return (
              <li
                key={i}
                className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors duration-150"
                style={i < items.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : undefined}
              >
                <div
                  className="mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={cfg.iconStyle}
                >
                  <span style={{ color: cfg.iconColor }}>{ACTIVITY_SVG[item.type]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 truncate">{item.title}</p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs text-neutral-400">{timeAgo(item.timestamp)}</span>
                  <span className={cfg.badgeClass}>{cfg.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function DashboardEmpty() {
  return (
    <div className="card-brand p-10">
      <div className="text-center space-y-5">
        {/* Icon */}
        <div className="inline-flex w-20 h-20 rounded-3xl gradient-brand items-center justify-center shadow-glow mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">You're all set up!</h3>
          <p className="text-sm text-neutral-500 mt-1">Start building your placement profile.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/dsa"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold gradient-brand-subtle border border-brand-200/20 text-brand-400 hover:shadow-glow-sm transition-all duration-200"
          >
            💻 Add DSA Problem
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-success-100/40 border border-success-500/20 text-success-700 hover:shadow-md transition-all duration-200"
          >
            📄 Update Resume
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-warning-100/40 border border-warning-500/20 text-warning-700 hover:shadow-md transition-all duration-200"
          >
            💼 Log a Job
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const readiness = useMemo(() => (data ? computeReadiness(data) : 0), [data]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="space-y-5 animate-fade-in">
          <DashboardHeader readiness={null} />
          <WelcomeCard />
          <div className="card p-6 text-center">
            <p className="text-sm text-neutral-500">
              Failed to load dashboard data. Please refresh the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { dsa, resumeCompletion, jobs, interviews, weekly, recentActivity, upcoming } = data;
  const hasAnyData = dsa.total > 0 || jobs.total > 0 || interviews.total > 0 || resumeCompletion > 0;
  const solvedPct  = dsa.total ? Math.round((dsa.solved / dsa.total) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <DashboardHeader readiness={hasAnyData ? readiness : null} />
        </motion.div>

        {/* Welcome hero */}
        <motion.div variants={staggerItem}>
          <WelcomeCard
            readiness={hasAnyData ? readiness : null}
            data={hasAnyData ? data : null}
          />
        </motion.div>

        {!hasAnyData ? (
          <motion.div variants={staggerItem}>
            <DashboardEmpty />
          </motion.div>
        ) : (
          <>
            {/* Placement readiness + Roadmap */}
            <motion.div variants={staggerItem}>
              <PlacementReadiness data={data} score={readiness} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <RoadmapProgressWidget />
            </motion.div>

            {/* 4 stat cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <StatCard
                  label="DSA Solved"
                  value={String(dsa.solved)}
                  delta={dsa.total ? `${solvedPct}% of ${dsa.total}` : 'none yet'}
                  positive={dsa.solved > 0}
                  icon="code"
                  to="/dsa"
                />
              </motion.div>
              <motion.div variants={staggerItem}>
                <StatCard
                  label="Resume Completion"
                  value={`${resumeCompletion}%`}
                  delta={resumeCompletion >= 100 ? 'complete' : 'sections filled'}
                  positive={resumeCompletion >= 50}
                  icon="document"
                  to="/resume"
                />
              </motion.div>
              <motion.div variants={staggerItem}>
                <StatCard
                  label="Jobs Applied"
                  value={String(jobs.total)}
                  delta={jobs.byStatus?.Offer ? `${jobs.byStatus.Offer} offer${jobs.byStatus.Offer > 1 ? 's' : ''}` : 'applications tracked'}
                  positive={jobs.total > 0}
                  icon="briefcase"
                  to="/jobs"
                />
              </motion.div>
              <motion.div variants={staggerItem}>
                <StatCard
                  label="Interviews Done"
                  value={String(interviews.completed)}
                  delta={interviews.total > 0 ? `avg ${interviews.avgScore}/100` : 'none yet'}
                  positive={interviews.completed > 0}
                  icon="chat"
                  to="/interview"
                />
              </motion.div>
            </motion.div>

            {/* DSA breakdown */}
            <motion.div variants={staggerItem}>
              <DsaStatsCard dsaStats={dsa} />
            </motion.div>

            {/* Weekly goals + Upcoming */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5" variants={staggerItem}>
              <WeeklyGoalsCard weekly={weekly} />
              <UpcomingCard    upcoming={upcoming} />
            </motion.div>

            {/* Job + Interview summaries */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5" variants={staggerItem}>
              <JobSummaryCard       jobs={jobs} />
              <InterviewSummaryCard interviews={interviews} />
            </motion.div>

            {/* Achievements */}
            <motion.div variants={staggerItem}>
              <AchievementBadges data={data} />
            </motion.div>

            {/* Recent activity */}
            <motion.div variants={staggerItem}>
              <RecentActivityCard items={recentActivity} />
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={staggerItem}>
              <QuickActions />
            </motion.div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
