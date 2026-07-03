import { useMemo } from 'react';
import Card from '../ui/Card';

const DIFF = [
  { label: 'Easy',   bar: 'bg-success-500', text: 'text-success-700' },
  { label: 'Medium', bar: 'bg-warning-500', text: 'text-warning-700' },
  { label: 'Hard',   bar: 'bg-danger-500',  text: 'text-danger-700'  },
];

export default function DsaStatsCard({ problems, dsaStats }) {
  const { diff, progress } = useMemo(() => {
    // Path A: pre-aggregated stats from dashboard API
    if (dsaStats) {
      const { total, solved, attempted, todo, easy, easySolved, medium, mediumSolved, hard, hardSolved } = dsaStats;
      const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
      return {
        diff: [
          { label: 'Easy',   bar: 'bg-success-500', text: 'text-success-700', total: easy,   solved: easySolved,   pct: easy   ? Math.round((easySolved   / easy)   * 100) : 0 },
          { label: 'Medium', bar: 'bg-warning-500', text: 'text-warning-700', total: medium, solved: mediumSolved, pct: medium ? Math.round((mediumSolved / medium) * 100) : 0 },
          { label: 'Hard',   bar: 'bg-danger-500',  text: 'text-danger-700',  total: hard,   solved: hardSolved,   pct: hard   ? Math.round((hardSolved   / hard)   * 100) : 0 },
        ],
        progress: [
          { label: 'Solved',    pct: pct(solved),    bar: 'bg-success-500', text: 'text-success-700' },
          { label: 'Attempted', pct: pct(attempted), bar: 'bg-warning-500', text: 'text-warning-700' },
          { label: 'Todo',      pct: pct(todo),      bar: 'bg-neutral-300', text: 'text-neutral-500' },
        ],
      };
    }

    // Path B: raw problems array
    const list     = problems || [];
    const total    = list.length;
    const solved   = list.filter((p) => p.status === 'Solved').length;
    const attempted = list.filter((p) => p.status === 'Attempted').length;
    const todo     = total - solved - attempted;
    const pct      = (n) => (total ? Math.round((n / total) * 100) : 0);

    return {
      diff: DIFF.map(({ label, bar, text }) => {
        const group      = list.filter((p) => p.difficulty === label);
        const grpSolved  = group.filter((p) => p.status === 'Solved').length;
        const grpPct     = group.length ? Math.round((grpSolved / group.length) * 100) : 0;
        return { label, bar, text, total: group.length, solved: grpSolved, pct: grpPct };
      }),
      progress: [
        { label: 'Solved',    pct: pct(solved),    bar: 'bg-success-500', text: 'text-success-700' },
        { label: 'Attempted', pct: pct(attempted), bar: 'bg-warning-500', text: 'text-warning-700' },
        { label: 'Todo',      pct: pct(todo),      bar: 'bg-neutral-300', text: 'text-neutral-500' },
      ],
    };
  }, [problems, dsaStats]);

  const isEmpty = dsaStats ? dsaStats.total === 0 : !problems?.length;
  if (isEmpty) return null;

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
