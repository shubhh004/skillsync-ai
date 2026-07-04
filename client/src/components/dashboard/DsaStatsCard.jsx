import { useMemo } from 'react';

const DIFF_CONFIG = [
  { label: 'Easy',   barStyle: { background: 'linear-gradient(90deg,#22c55e,#16a34a)', boxShadow: '0 0 6px rgba(34,197,94,0.4)'  }, text: 'text-success-700' },
  { label: 'Medium', barStyle: { background: 'linear-gradient(90deg,#f59e0b,#d97706)', boxShadow: '0 0 6px rgba(245,158,11,0.4)' }, text: 'text-warning-700' },
  { label: 'Hard',   barStyle: { background: 'linear-gradient(90deg,#ef4444,#dc2626)', boxShadow: '0 0 6px rgba(239,68,68,0.4)'  }, text: 'text-danger-700'  },
];

function ProgressRow({ label, value, total, pct, barStyle, textClass }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold ${textClass}`}>{label}</span>
        <span className="text-xs text-neutral-400 font-medium tabular-nums">
          {total !== undefined ? `${value}/${total}` : `${pct}%`}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-smooth"
          style={{ width: `${pct}%`, ...barStyle }}
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
          { label: 'Easy',   barStyle: DIFF_CONFIG[0].barStyle, text: 'text-success-700', total: easy,   value: easySolved,   pct: easy   ? Math.round((easySolved   / easy)   * 100) : 0 },
          { label: 'Medium', barStyle: DIFF_CONFIG[1].barStyle, text: 'text-warning-700', total: medium, value: mediumSolved, pct: medium ? Math.round((mediumSolved / medium) * 100) : 0 },
          { label: 'Hard',   barStyle: DIFF_CONFIG[2].barStyle, text: 'text-danger-700',  total: hard,   value: hardSolved,   pct: hard   ? Math.round((hardSolved   / hard)   * 100) : 0 },
        ],
        progress: [
          { label: 'Solved',    pct: pct(solved),    barStyle: { background: 'linear-gradient(90deg,#22c55e,#16a34a)', boxShadow: '0 0 6px rgba(34,197,94,0.4)'  }, text: 'text-success-700' },
          { label: 'Attempted', pct: pct(attempted), barStyle: { background: 'linear-gradient(90deg,#f59e0b,#d97706)', boxShadow: '0 0 6px rgba(245,158,11,0.4)' }, text: 'text-warning-700' },
          { label: 'Todo',      pct: pct(todo),      barStyle: { background: 'rgba(255,255,255,0.2)' },                                                              text: 'text-neutral-500' },
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
      diff: DIFF_CONFIG.map(({ label, barStyle, text }) => {
        const group     = list.filter((p) => p.difficulty === label);
        const grpSolved = group.filter((p) => p.status === 'Solved').length;
        const grpPct    = group.length ? Math.round((grpSolved / group.length) * 100) : 0;
        return { label, barStyle, text, total: group.length, value: grpSolved, pct: grpPct };
      }),
      progress: [
        { label: 'Solved',    pct: pct(solved),    barStyle: { background: 'linear-gradient(90deg,#22c55e,#16a34a)', boxShadow: '0 0 6px rgba(34,197,94,0.4)'  }, text: 'text-success-700' },
        { label: 'Attempted', pct: pct(attempted), barStyle: { background: 'linear-gradient(90deg,#f59e0b,#d97706)', boxShadow: '0 0 6px rgba(245,158,11,0.4)' }, text: 'text-warning-700' },
        { label: 'Todo',      pct: pct(todo),      barStyle: { background: 'rgba(255,255,255,0.2)' },                                                              text: 'text-neutral-500' },
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
            {diff.map(({ label, barStyle, text, total, value, pct }) => (
              <ProgressRow
                key={label}
                label={label}
                value={value}
                total={total}
                pct={pct}
                barStyle={barStyle}
                textClass={text}
              />
            ))}
          </div>
        </div>

        {/* Overall progress */}
        <div>
          <p className="text-label mb-4">Overall Progress</p>
          <div className="space-y-3.5">
            {progress.map(({ label, pct, barStyle, text }) => (
              <ProgressRow
                key={label}
                label={label}
                pct={pct}
                barStyle={barStyle}
                textClass={text}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
