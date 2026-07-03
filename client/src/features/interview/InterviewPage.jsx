import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InterviewCard from './components/InterviewCard';
import InterviewModal from './components/InterviewModal';
import InterviewDeleteDialog from './components/InterviewDeleteDialog';
import InterviewEmptyState from './components/InterviewEmptyState';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../../services/interviewService';

// ─── Constants ────────────────────────────────────────────────────────────────
const DIFF_COLORS   = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };
const STATUS_COLORS = { Scheduled: '#3d6ef6', 'In Progress': '#eab308', Completed: '#22c55e' };

const STAT_COLOR = {
  brand:   { text: 'text-brand-600',   bg: 'bg-brand-50' },
  success: { text: 'text-success-700', bg: 'bg-success-100' },
  warning: { text: 'text-warning-700', bg: 'bg-warning-100' },
  danger:  { text: 'text-danger-700',  bg: 'bg-danger-100' },
  neutral: { text: 'text-neutral-700', bg: 'bg-neutral-100' },
};

const FILTER_SELECT =
  'w-full h-9 px-3 text-sm border border-neutral-300 bg-white text-neutral-700 rounded-md ' +
  'cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors';

const FILTER_INPUT =
  'w-full h-9 px-3 text-sm border border-neutral-300 bg-white text-neutral-700 rounded-md ' +
  'placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const shortDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

// ─── Analytics computation ────────────────────────────────────────────────────
function computeAnalytics(interviews) {
  if (!interviews.length) return null;

  const completed  = interviews.filter((i) => i.status === 'Completed');
  const scheduled  = interviews.filter((i) => i.status === 'Scheduled');
  const scores     = interviews.map((i) => i.score || 0);
  const avgScore   = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highScore  = Math.max(...scores);

  // Score trend: last 10 by date ascending
  const trendData = [...interviews]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10)
    .map((iv, idx) => ({
      label: shortDate(iv.createdAt),
      index: idx + 1,
      score: iv.score || 0,
    }));

  // Difficulty distribution
  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  interviews.forEach((iv) => { if (iv.difficulty) diffCounts[iv.difficulty]++; });
  const diffData = Object.entries(diffCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // Status distribution
  const statusCounts = { Scheduled: 0, 'In Progress': 0, Completed: 0 };
  interviews.forEach((iv) => { if (iv.status) statusCounts[iv.status]++; });
  const statusData = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // Avg completion %
  const completionPcts = interviews.map((iv) => {
    if (!iv.questions?.length) return 0;
    const answered = iv.questions.filter((q) => q.answer?.trim()).length;
    return Math.round((answered / iv.questions.length) * 100);
  });
  const avgCompletion = Math.round(completionPcts.reduce((a, b) => a + b, 0) / completionPcts.length);

  // Avg duration (completed with both timestamps)
  const durations = completed
    .filter((iv) => iv.startedAt && iv.completedAt)
    .map((iv) => Math.round((new Date(iv.completedAt) - new Date(iv.startedAt)) / 60000))
    .filter((d) => d > 0);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;

  // Strongest / Weakest (by difficulty avg score)
  const diffScoreMap = {};
  interviews.forEach((iv) => {
    if (!iv.difficulty) return;
    if (!diffScoreMap[iv.difficulty]) diffScoreMap[iv.difficulty] = [];
    diffScoreMap[iv.difficulty].push(iv.score || 0);
  });
  const diffAvgs = Object.entries(diffScoreMap).map(([diff, s]) => ({
    diff,
    avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length),
  }));
  const strongest = diffAvgs.length ? diffAvgs.reduce((a, b) => (a.avg >= b.avg ? a : b)) : null;
  const weakest   = diffAvgs.length ? diffAvgs.reduce((a, b) => (a.avg <= b.avg ? a : b)) : null;

  return {
    total: interviews.length,
    avgScore,
    highScore,
    completedCount: completed.length,
    scheduledCount: scheduled.length,
    trendData,
    diffData,
    statusData,
    avgCompletion,
    avgDuration,
    strongestTopic: strongest?.diff || '—',
    weakestTopic:   weakest?.diff   || '—',
  };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix = '', color = 'brand' }) {
  const c = STAT_COLOR[color] || STAT_COLOR.brand;
  return (
    <Card padding={false} className="p-4 text-center">
      <p className={`text-2xl font-bold ${c.text}`}>
        {value}{suffix && <span className="text-base font-normal opacity-60 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </Card>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
function InsightCard({ label, value, color = 'brand' }) {
  const c = STAT_COLOR[color] || STAT_COLOR.brand;
  return (
    <Card padding={false} className={`p-4 ${c.bg}`}>
      <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
      <p className={`text-base font-bold ${c.text} truncate`}>{value}</p>
    </Card>
  );
}

// ─── Score Trend Chart ────────────────────────────────────────────────────────
function ScoreTrendChart({ data }) {
  if (!data.length) return <p className="text-xs text-neutral-400 py-8 text-center">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9aa3b2' }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9aa3b2' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e7ed' }}
          formatter={(v) => [`${v}/100`, 'Score']}
          labelFormatter={(l) => `Date: ${l}`}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#3d6ef6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#3d6ef6' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Difficulty Distribution Chart ───────────────────────────────────────────
function DifficultyChart({ data }) {
  if (!data.length) return <p className="text-xs text-neutral-400 py-8 text-center">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9aa3b2' }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#9aa3b2' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e7ed' }}
          formatter={(v) => [v, 'Interviews']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={DIFF_COLORS[entry.name] || '#9aa3b2'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Status Distribution Chart ────────────────────────────────────────────────
function StatusChart({ data }) {
  if (!data.length) return <p className="text-xs text-neutral-400 py-8 text-center">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={72}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
          labelLine={false}
          fontSize={10}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#9aa3b2'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e7ed' }}
          formatter={(v, name) => [v, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Analytics Section ────────────────────────────────────────────────────────
function AnalyticsSection({ analytics }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-700">Analytics</h3>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Interviews" value={analytics.total}          color="neutral" />
        <StatCard label="Average Score"    value={analytics.avgScore}       color="brand"   suffix="/100" />
        <StatCard label="Highest Score"    value={analytics.highScore}      color="success" suffix="/100" />
        <StatCard label="Completed"        value={analytics.completedCount} color="success" />
        <StatCard label="Scheduled"        value={analytics.scheduledCount} color="brand"   />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs font-semibold text-neutral-500 mb-3">Score Trend (Last 10)</p>
          <ScoreTrendChart data={analytics.trendData} />
        </Card>
        <Card>
          <p className="text-xs font-semibold text-neutral-500 mb-3">Difficulty Distribution</p>
          <DifficultyChart data={analytics.diffData} />
        </Card>
        <Card>
          <p className="text-xs font-semibold text-neutral-500 mb-3">Status Distribution</p>
          <StatusChart data={analytics.statusData} />
        </Card>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InsightCard
          label="Strongest Topic"
          value={analytics.strongestTopic}
          color="success"
        />
        <InsightCard
          label="Weakest Topic"
          value={analytics.weakestTopic}
          color="danger"
        />
        <InsightCard
          label="Avg Completion"
          value={`${analytics.avgCompletion}%`}
          color="brand"
        />
        <InsightCard
          label="Avg Duration"
          value={analytics.avgDuration ? `${analytics.avgDuration} min` : '—'}
          color="neutral"
        />
      </div>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ searchRole, searchCompany, filterDifficulty, filterStatus, sortBy, onChange }) {
  const set = (key) => (e) => onChange(key, e.target.value);
  return (
    <Card padding={false} className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search by role…"
          value={searchRole}
          onChange={set('searchRole')}
          className={FILTER_INPUT}
        />
        <input
          type="text"
          placeholder="Filter by company…"
          value={searchCompany}
          onChange={set('searchCompany')}
          className={FILTER_INPUT}
        />
        <select value={filterDifficulty} onChange={set('filterDifficulty')} className={FILTER_SELECT}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={filterStatus} onChange={set('filterStatus')} className={FILTER_SELECT}>
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={sortBy} onChange={set('sortBy')} className={FILTER_SELECT}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Score</option>
          <option value="lowest">Lowest Score</option>
        </select>
      </div>
    </Card>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const difficultyStyle = {
  Easy:   'bg-success-100 text-success-700',
  Medium: 'bg-warning-100 text-warning-700',
  Hard:   'bg-danger-100 text-danger-700',
};

const statusStyle = {
  Scheduled:     'bg-brand-50 text-brand-700',
  'In Progress': 'bg-warning-100 text-warning-700',
  Completed:     'bg-success-100 text-success-700',
};

function InterviewDetailModal({ interview, onClose }) {
  const scoreColor =
    interview.score >= 70 ? '#15803d' :
    interview.score >= 40 ? '#a16207' : '#b91c1c';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-neutral-200 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-neutral-900 truncate">
              {interview.role || 'Mock Interview'}
            </h2>
            {interview.company && (
              <p className="text-sm text-neutral-500 truncate mt-0.5">{interview.company}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyle[interview.difficulty] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {interview.difficulty}
            </span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[interview.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {interview.status}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: scoreColor }}>{interview.score ?? 0}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Score</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-neutral-700">{formatDate(interview.createdAt)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Created</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-neutral-700">{formatDate(interview.completedAt)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Completed</p>
            </div>
          </div>

          {/* Feedback */}
          {interview.feedback && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1.5">Feedback</p>
              <p className="text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                {interview.feedback}
              </p>
            </div>
          )}

          {/* Question breakdown */}
          {interview.questions && interview.questions.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-neutral-500">
                Questions ({interview.questions.length})
              </p>
              {interview.questions.map((q, i) => {
                const scoreCls =
                  q.score >= 70 ? 'bg-success-100 text-success-700' :
                  q.score >= 40 ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700';
                return (
                  <div key={i} className="border border-neutral-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-neutral-400 font-medium pt-0.5">Q{i + 1}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${scoreCls}`}>
                        {q.score ?? 0}/100
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 leading-relaxed">{q.question}</p>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 mb-1.5">Your Answer</p>
                      {q.answer
                        ? <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3 whitespace-pre-wrap">{q.answer}</p>
                        : <p className="text-sm text-neutral-400 italic">No answer provided.</p>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 mb-1.5">Ideal Answer</p>
                      <p className="text-sm text-neutral-700 bg-brand-50 border border-brand-100 rounded-lg p-3 whitespace-pre-wrap">
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
        <div className="px-6 py-4 border-t border-neutral-200 flex-shrink-0">
          <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${type === 'error' ? 'bg-danger-700' : 'bg-success-700'}`}>
      {message}
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

  // Filter state
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

  // Analytics (computed from ALL interviews, not filtered)
  const analytics = useMemo(() => computeAnalytics(interviews), [interviews]);

  // Filtered + sorted list
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

  return (
    <DashboardLayout title="AI Interviews">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">AI Interviews</h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Track your mock interviews, scores, and performance analytics.
            </p>
          </div>
          <Button size="sm" className="flex-shrink-0" onClick={openAdd}>
            + Create Interview
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-brand-600 animate-spin" />
          </div>
        ) : interviews.length === 0 ? (
          <InterviewEmptyState onAdd={openAdd} />
        ) : (
          <>
            {/* Analytics */}
            {analytics && <AnalyticsSection analytics={analytics} />}

            {/* Filters */}
            <FilterBar
              searchRole={searchRole}
              searchCompany={searchCompany}
              filterDifficulty={filterDifficulty}
              filterStatus={filterStatus}
              sortBy={sortBy}
              onChange={handleFilterChange}
            />

            {/* History grid */}
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-neutral-500">No interviews match your filters.</p>
                <button
                  type="button"
                  onClick={() => { setSearchRole(''); setSearchCompany(''); setFilterDifficulty(''); setFilterStatus(''); setSortBy('newest'); }}
                  className="mt-2 text-sm text-brand-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-400">
                    {filteredInterviews.length} of {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
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
              </>
            )}
          </>
        )}
      </div>

      {modal && (
        <InterviewModal
          mode={modal}
          initial={editTarget}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <InterviewDeleteDialog
          interview={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {detailTarget && (
        <InterviewDetailModal
          interview={detailTarget}
          onClose={closeView}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
