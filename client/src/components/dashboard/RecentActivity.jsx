import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const statusConfig = {
  Solved:    { dot: 'bg-success-500', badge: 'badge-success' },
  Attempted: { dot: 'bg-warning-500', badge: 'badge-warning' },
  Todo:      { dot: 'bg-neutral-400', badge: 'badge-neutral' },
};

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function RecentActivity({ problems = [] }) {
  const recent = useMemo(() =>
    [...problems]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5),
    [problems]
  );

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-sm font-semibold text-neutral-800">Recent Activity</h3>
        <Link
          to="/dsa"
          className="text-xs font-medium text-brand-400 hover:text-brand-500 transition-colors duration-150"
        >
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-neutral-500">No activity yet.</p>
          <Link
            to="/dsa"
            className="mt-2 inline-block text-sm text-brand-400 hover:underline"
          >
            Add your first problem →
          </Link>
        </div>
      ) : (
        <ul>
          {recent.map((p, i) => {
            const cfg = statusConfig[p.status] ?? statusConfig.Todo;
            return (
              <li
                key={p._id}
                className="flex items-start gap-4 px-6 py-4 transition-colors duration-150 hover:bg-white/5"
                style={i < recent.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : undefined}
              >
                {/* Status dot */}
                <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${cfg.dot}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700 leading-snug">
                    {p.status}{' '}
                    <span className="font-semibold text-neutral-800">"{p.title}"</span>
                    {' '}·{' '}{p.difficulty} · {p.topic}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{timeAgo(p.updatedAt)}</p>
                </div>

                {/* Feature badge */}
                <span className="flex-shrink-0 badge-neutral">DSA</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
