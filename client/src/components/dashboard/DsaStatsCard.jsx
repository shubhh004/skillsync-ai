import { useMemo } from 'react';

const DIFF_CONFIG = [
  { label: 'Easy',   bar: 'bg-success-500', text: 'text-success-700' },
  { label: 'Medium', bar: 'bg-warning-500', text: 'text-warning-700' },
  { label: 'Hard',   bar: 'bg-danger-500',  text: 'text-danger-700'  },
];

function ProgressRow({ label, value, total, pct, barClass, textClass }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold ${textClass}`}>{label}</span>
        <span className="text-xs text-neutral-400 font-medium tabular-nums">
          {total !== undefined ? `${value}/${total}` : `${pct}%`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-500 ease-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DsaStatsCard({ problems, dsaStats }) {
  const { diff, progress } = useMemo(() => {
    if (dsaStats) {
      const { total, solved, attempted, todo, easy, easySolved, medium, mediumSolved, hard, hardSolved } = dsaStats;
      const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
      return {
        diff: [
          { label: 'Easy',   bar: 'bg-success-500', text: 'text-success-700', total: easy,   value: easySolved,   pct: easy   ? Math.round((easySolved   / easy)   * 100) : 0 },
          { label: 'Medium', bar: 'bg-warning-500', text: 'text-warning-700', total: medium, value: mediumSolved, pct: medium ? Math.round((mediumSolved / medium) * 100) : 0 },
          { label: 'Hard',   bar: 'bg-danger-500',  text: 'text-danger-700',  total: hard,   value: hardSolved,   pct: hard   ? Math.round((hardSolved   / hard)   * 100) : 0 },
        ],
        progress: [
          { label: 'Solved',    pct: pct(solved),    bar: 'bg-success-500', text: 'text-success-700' },
          { label: 'Attempted', pct: pct(attempted), bar: 'bg-warning-500', text: 'text-warning-700' },
          { label: 'Todo',      pct: pct(todo),      bar: 'bg-neutral-400', text: 'text-neutral-500' },
        ],
      };
    }

    const list      = problems || [];
    const total     = list.length;
    const solved    = list.filter((p) => p.status === 'Solved').length;
    const attempted = list.filter((p) => p.status === 'Attempted').length;
    const todo      = total - solved - attempted;
    const pct       = (n) => (total ? Math.round((n / total) * 100) : 0);

    return {
      diff: DIFF_CONFIG.map(({ label, bar, text }) => {
        const group     = list.filter((p) => p.difficulty === label);
        const grpSolved = group.filter((p) => p.status === 'Solved').length;
        const grpPct    = group.length ? Math.round((grpSolved / group.length) * 100) : 0;
        return { label, bar, text, total: group.length, value: grpSolved, pct: grpPct };
      }),
      progress: [
        { label: 'Solved',    pct: pct(solved),    bar: 'bg-success-500', text: 'text-success-700' },
        { label: 'Attempted', pct: pct(attempted), bar: 'bg-warning-500', text: 'text-warning-700' },
        { label: 'Todo',      pct: pct(todo),      bar: 'bg-neutral-400', text: 'text-neutral-500' },
      ],
    };
  }, [problems, dsaStats]);

  const isEmpty = dsaStats ? dsaStats.total === 0 : !problems?.length;
  if (isEmpty) return null;

  return (
    <div className="card p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* By difficulty */}
        <div>
          <p className="text-label mb-4">By Difficulty</p>
          <div className="space-y-3.5">
            {diff.map(({ label, bar, text, total, value, pct }) => (
              <ProgressRow
                key={label}
                label={label}
                value={value}
                total={total}
                pct={pct}
                barClass={bar}
                textClass={text}
              />
            ))}
          </div>
        </div>

        {/* Overall progress */}
        <div>
          <p className="text-label mb-4">Overall Progress</p>
          <div className="space-y-3.5">
            {progress.map(({ label, pct, bar, text }) => (
              <ProgressRow
                key={label}
                label={label}
                pct={pct}
                barClass={bar}
                textClass={text}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
