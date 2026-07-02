import { useMemo } from 'react';
import Card from '../ui/Card';

const DIFF = [
  { label: 'Easy',   bar: 'bg-success-500', text: 'text-success-700' },
  { label: 'Medium', bar: 'bg-warning-500', text: 'text-warning-700' },
  { label: 'Hard',   bar: 'bg-danger-500',  text: 'text-danger-700'  },
];

export default function DsaStatsCard({ problems }) {
  const { diff, progress } = useMemo(() => {
    const total     = problems.length;
    const solved    = problems.filter((p) => p.status === 'Solved').length;
    const attempted = problems.filter((p) => p.status === 'Attempted').length;
    const todo      = total - solved - attempted;
    const pct       = (n) => (total ? Math.round((n / total) * 100) : 0);

    return {
      diff: DIFF.map(({ label, bar, text }) => {
        const group   = problems.filter((p) => p.difficulty === label);
        const grpSolved = group.filter((p) => p.status === 'Solved').length;
        const grpPct  = group.length ? Math.round((grpSolved / group.length) * 100) : 0;
        return { label, bar, text, total: group.length, solved: grpSolved, pct: grpPct };
      }),
      progress: [
        { label: 'Solved',    pct: pct(solved),    bar: 'bg-success-500', text: 'text-success-700' },
        { label: 'Attempted', pct: pct(attempted), bar: 'bg-warning-500', text: 'text-warning-700' },
        { label: 'Todo',      pct: pct(todo),      bar: 'bg-neutral-300', text: 'text-neutral-500' },
      ],
    };
  }, [problems]);

  if (!problems.length) return null;

  return (
    <Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">By Difficulty</h3>
          <div className="space-y-3">
            {diff.map(({ label, bar, text, total, solved, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${text}`}>{label}</span>
                  <span className="text-xs text-neutral-500">{solved}/{total} solved · {pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Overall Progress</h3>
          <div className="space-y-3">
            {progress.map(({ label, pct, bar, text }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${text}`}>{label}</span>
                  <span className="text-xs text-neutral-500">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
