import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatCard from '../components/dashboard/StatCard';
import DsaStatsCard from '../components/dashboard/DsaStatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import Card from '../components/ui/Card';
import { getDashboard } from '../services/dashboardService';

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
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-neutral-100 rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24" />
      <Skeleton className="h-20" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <Skeleton className="h-28" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-20" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────
function DashboardHeader({ readiness }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const chip =
    readiness === null    ? null
    : readiness >= 70     ? { label: '🟢 On Track',   cls: 'bg-success-100 text-success-700' }
    : readiness >= 40     ? { label: '🟡 Improving',  cls: 'bg-warning-100 text-warning-700' }
    :                       { label: '🔴 Needs Focus', cls: 'bg-danger-100  text-danger-700'  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Dashboard</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{today}</p>
      </div>
      {chip && (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${chip.cls}`}>
          {chip.label}
        </span>
      )}
    </div>
  );
}

// ─── Placement Readiness ──────────────────────────────────────────────────────
function PlacementReadiness({ data, score }) {
  const barColor  = score >= 70 ? 'bg-success-500' : score >= 40 ? 'bg-warning-500' : 'bg-danger-500';
  const textColor = score >= 70 ? 'text-success-700' : score >= 40 ? 'text-warning-700' : 'text-danger-700';

  const pillars = [
    { label: 'DSA',        pct: Math.round(Math.min(data.dsa.solved / 50, 1) * 100),             link: '/dsa'       },
    { label: 'Resume',     pct: data.resumeCompletion,                                             link: '/resume'    },
    { label: 'Jobs',       pct: Math.round(Math.min(data.jobs.total / 10, 1) * 100),              link: '/jobs'      },
    { label: 'Interviews', pct: data.interviews.total > 0 ? data.interviews.avgScore : 0,         link: '/interview' },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-700">Placement Readiness</h3>
        <span className={`text-2xl font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-100 overflow-hidden mb-4">
        <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {pillars.map(({ label, pct, link }) => (
          <Link key={label} to={link} className="group text-center">
            <p className="text-sm font-semibold text-neutral-800 group-hover:text-brand-600 transition-colors">{pct}%</p>
            <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>
    </Card>
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
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-neutral-600">{label}</span>
        <span className={`text-xs font-semibold ${done ? 'text-success-700' : 'text-neutral-500'}`}>
          {current}/{target}{suffix}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-success-500' : GOAL_BAR[barKey]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WeeklyGoalsCard({ weekly }) {
  const resumeDone = weekly.resumeUpdated;
  return (
    <Card padding={false}>
      <div className="px-5 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-900">Weekly Goals</h3>
        <p className="text-xs text-neutral-400 mt-0.5">Resets every 7 days</p>
      </div>
      <div className="px-5 py-4 space-y-4">
        <GoalRow label="DSA Problems"     current={weekly.dsaProblems}    target={5} barKey="dsa"       suffix=" this week" />
        <GoalRow label="Job Applications" current={weekly.jobsApplied}    target={5} barKey="jobs"      suffix=" this week" />
        <GoalRow label="Mock Interviews"  current={weekly.interviewsDone} target={2} barKey="interview" suffix=" this week" />
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-600">Resume Update</span>
            <span className={`text-xs font-semibold ${resumeDone ? 'text-success-700' : 'text-neutral-400'}`}>
              {resumeDone ? 'Done ✓' : 'Pending'}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${resumeDone ? 'bg-success-500' : 'bg-neutral-200'}`}
              style={{ width: resumeDone ? '100%' : '0%' }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Upcoming ─────────────────────────────────────────────────────────────────
const DIFF_BADGE = {
  Easy:   'bg-success-100 text-success-700',
  Medium: 'bg-warning-100 text-warning-700',
  Hard:   'bg-danger-100  text-danger-700',
};

function UpcomingCard({ upcoming }) {
  return (
    <Card padding={false}>
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Upcoming</h3>
        <Link to="/interview" className="text-xs text-brand-600 hover:underline">View all</Link>
      </div>
      {upcoming.length === 0 ? (
        <div className="px-5 py-8 text-center space-y-2">
          <p className="text-sm text-neutral-400">No upcoming interviews.</p>
          <Link
            to="/interview"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline font-medium"
          >
            Schedule one →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {upcoming.map((iv) => (
            <li key={iv._id} className="flex items-start gap-3 px-5 py-3.5">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{iv.role || 'Mock Interview'}</p>
                {iv.company && <p className="text-xs text-neutral-400 truncate">{iv.company}</p>}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {iv.difficulty && (
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${DIFF_BADGE[iv.difficulty] || 'bg-neutral-100 text-neutral-600'}`}>
                    {iv.difficulty}
                  </span>
                )}
                <span className="text-xs text-neutral-400">{formatDate(iv.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ─── Job Summary ──────────────────────────────────────────────────────────────
const JOB_STATUS_ORDER = ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Accepted', 'Rejected'];
const JOB_STATUS_COLOR = {
  Applied:   'bg-brand-50    text-brand-700',
  OA:        'bg-neutral-100 text-neutral-600',
  Interview: 'bg-warning-100 text-warning-700',
  HR:        'bg-warning-100 text-warning-700',
  Offer:     'bg-success-100 text-success-700',
  Accepted:  'bg-success-100 text-success-700',
  Rejected:  'bg-danger-100  text-danger-700',
};

function JobSummaryCard({ jobs }) {
  const navigate = useNavigate();
  const byStatus = jobs.byStatus || {};
  const entries  = JOB_STATUS_ORDER.filter((s) => byStatus[s] > 0).map((s) => ({ status: s, count: byStatus[s] }));

  return (
    <Card
      padding={false}
      className="cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
      onClick={() => navigate('/jobs')}
    >
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Job Applications</h3>
        <Link
          to="/jobs"
          className="text-xs text-brand-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View all
        </Link>
      </div>
      {jobs.total === 0 ? (
        <div className="px-5 py-8 text-center space-y-2">
          <p className="text-sm text-neutral-400">No jobs tracked yet.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Track your first application →
          </Link>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{jobs.total}</span>
            <span className="text-sm text-neutral-400">total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entries.map(({ status, count }) => (
              <span
                key={status}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${JOB_STATUS_COLOR[status] || 'bg-neutral-100 text-neutral-600'}`}
              >
                {status} <span className="font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Interview Summary ────────────────────────────────────────────────────────
function InterviewSummaryCard({ interviews }) {
  const navigate    = useNavigate();
  const scoreColor  =
    interviews.avgScore >= 70 ? 'text-success-700' :
    interviews.avgScore >= 40 ? 'text-warning-700' : 'text-neutral-500';

  return (
    <Card
      padding={false}
      className="cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
      onClick={() => navigate('/interview')}
    >
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">AI Interviews</h3>
        <Link
          to="/interview"
          className="text-xs text-brand-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View all
        </Link>
      </div>
      {interviews.total === 0 ? (
        <div className="px-5 py-8 text-center space-y-2">
          <p className="text-sm text-neutral-400">No interviews completed yet.</p>
          <Link
            to="/interview"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Start your first interview →
          </Link>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{interviews.total}</span>
            <span className="text-sm text-neutral-400">total</span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="text-center">
              <p className="text-base font-bold text-neutral-800">{interviews.completed}</p>
              <p className="text-xs text-neutral-400">Completed</p>
            </div>
            <div className="text-center border-x border-neutral-100">
              <p className={`text-base font-bold ${scoreColor}`}>{interviews.avgScore}</p>
              <p className="text-xs text-neutral-400">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-neutral-800">{interviews.highScore}</p>
              <p className="text-xs text-neutral-400">Best Score</p>
            </div>
          </div>
        </div>
      )}
    </Card>
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
    <Card>
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {earned.map(({ id, icon, label }) => (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100"
          >
            {icon} {label}
          </span>
        ))}
      </div>
    </Card>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
const ACTIVITY_STYLE = {
  dsa:       { icon: 'text-brand-600   bg-brand-50',    label: 'DSA'       },
  job:       { icon: 'text-warning-700 bg-warning-100', label: 'Job'       },
  interview: { icon: 'text-success-700 bg-success-100', label: 'Interview' },
  resume:    { icon: 'text-neutral-600 bg-neutral-100', label: 'Resume'    },
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
    <Card padding={false}>
      <div className="px-5 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-900">Recent Activity</h3>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-neutral-400">No activity yet. Start by adding a DSA problem or logging a job.</p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((item, i) => {
            const style = ACTIVITY_STYLE[item.type] || ACTIVITY_STYLE.dsa;
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${style.icon}`}>
                  {ACTIVITY_SVG[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-neutral-400">{timeAgo(item.timestamp)}</span>
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {style.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function DashboardEmpty() {
  return (
    <Card>
      <div className="py-12 text-center space-y-4">
        <p className="text-5xl">🚀</p>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-neutral-800">You're all set up!</h3>
          <p className="text-sm text-neutral-400">Start building your placement profile.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/dsa"    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors">💻 Add DSA Problem</Link>
          <Link to="/resume" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success-100 text-success-700 text-sm font-medium hover:bg-success-100/80 transition-colors">📄 Update Resume</Link>
          <Link to="/jobs"   className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-warning-100 text-warning-700 text-sm font-medium hover:bg-warning-100/80 transition-colors">💼 Log a Job</Link>
        </div>
      </div>
    </Card>
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

  // Computed before early returns — safe when data is null
  const readiness = useMemo(() => (data ? computeReadiness(data) : 0), [data]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          <DashboardHeader readiness={null} />
          <WelcomeCard />
          <Card>
            <p className="text-center text-sm text-neutral-500 py-6">
              Failed to load dashboard data. Please refresh the page.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { dsa, resumeCompletion, jobs, interviews, weekly, recentActivity, upcoming } = data;
  const hasAnyData = dsa.total > 0 || jobs.total > 0 || interviews.total > 0 || resumeCompletion > 0;
  const solvedPct  = dsa.total ? Math.round((dsa.solved / dsa.total) * 100) : 0;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">

        {/* Page Header */}
        <DashboardHeader readiness={hasAnyData ? readiness : null} />

        {/* Hero */}
        <WelcomeCard
          readiness={hasAnyData ? readiness : null}
          data={hasAnyData ? data : null}
        />

        {!hasAnyData ? (
          <DashboardEmpty />
        ) : (
          <>
            {/* Placement Readiness */}
            <PlacementReadiness data={data} score={readiness} />

            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <StatCard
                label="DSA Solved"
                value={String(dsa.solved)}
                delta={dsa.total ? `${solvedPct}% of ${dsa.total}` : 'none yet'}
                positive={dsa.solved > 0}
                icon="code"
                to="/dsa"
              />
              <StatCard
                label="Resume Completion"
                value={`${resumeCompletion}%`}
                delta={resumeCompletion >= 100 ? 'complete' : 'sections filled'}
                positive={resumeCompletion >= 50}
                icon="document"
                to="/resume"
              />
              <StatCard
                label="Jobs Applied"
                value={String(jobs.total)}
                delta={jobs.byStatus?.Offer ? `${jobs.byStatus.Offer} offer${jobs.byStatus.Offer > 1 ? 's' : ''}` : 'applications tracked'}
                positive={jobs.total > 0}
                icon="briefcase"
                to="/jobs"
              />
              <StatCard
                label="Interviews Done"
                value={String(interviews.completed)}
                delta={interviews.total > 0 ? `avg ${interviews.avgScore}/100` : 'none yet'}
                positive={interviews.completed > 0}
                icon="chat"
                to="/interview"
              />
            </div>

            {/* DSA Breakdown */}
            <DsaStatsCard dsaStats={dsa} />

            {/* Weekly Goals + Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyGoalsCard weekly={weekly} />
              <UpcomingCard    upcoming={upcoming} />
            </div>

            {/* Job & Interview Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobSummaryCard       jobs={jobs} />
              <InterviewSummaryCard interviews={interviews} />
            </div>

            {/* Achievement Badges */}
            <AchievementBadges data={data} />

            {/* Recent Activity */}
            <RecentActivityCard items={recentActivity} />

            {/* Quick Actions */}
            <QuickActions />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
