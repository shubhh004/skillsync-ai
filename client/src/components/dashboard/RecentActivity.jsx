import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const statusDot = {
  Solved:    'bg-success-500',
  Attempted: 'bg-warning-500',
  Todo:      'bg-neutral-400',
};

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  ===1) return 'Yesterday';
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
    <Card padding={false}>
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Recent Activity</h3>
        <Link to="/dsa" className="text-xs text-brand-600 hover:underline">View all</Link>
      </div>

      {recent.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-neutral-500">No activity yet.</p>
          <Link to="/dsa" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Add your first problem →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {recent.map((p) => (
            <li key={p._id} className="flex items-start gap-4 px-6 py-4">
              <span className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${statusDot[p.status] || 'bg-neutral-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-800 leading-snug">
                  {p.status}{' '}
                  <span className="font-medium">"{p.title}"</span>
                  {' '}— {p.difficulty} · {p.topic}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{timeAgo(p.updatedAt)}</p>
              </div>
              <span className="flex-shrink-0 text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                DSA
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
