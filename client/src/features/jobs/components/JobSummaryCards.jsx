const SUMMARY = [
  {
    status: 'Applied',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
    bar: 'linear-gradient(90deg, #6366f1, #4f46e5)',
    glow: 'rgba(99,102,241,0.45)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
    ),
  },
  {
    status: 'Interview',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    bar: 'linear-gradient(90deg, #f59e0b, #d97706)',
    glow: 'rgba(245,158,11,0.45)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    ),
  },
  {
    status: 'Offer',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    bar: 'linear-gradient(90deg, #22c55e, #16a34a)',
    glow: 'rgba(34,197,94,0.45)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    ),
  },
  {
    status: 'Rejected',
    color: '#f87171',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    bar: 'linear-gradient(90deg, #ef4444, #dc2626)',
    glow: 'rgba(239,68,68,0.45)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

export default function JobSummaryCards({ jobs }) {
  const total = jobs.length || 1;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {SUMMARY.map(({ status, color, bg, border, bar, glow, icon }) => {
        const count = jobs.filter((j) => j.status === status).length;
        const pct   = Math.round((count / total) * 100);

        return (
          <div
            key={status}
            className="card p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest leading-none"
                  style={{ color: '#52525b' }}
                >
                  {status}
                </p>
                <p
                  className="mt-2.5 text-3xl font-bold leading-none tracking-tight tabular-nums"
                  style={{ color: '#e4e4e7' }}
                >
                  {count}
                </p>
              </div>

              {/* Icon container */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.6}>
                  {icon}
                </svg>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: bar,
                    boxShadow: `0 0 8px ${glow}`,
                  }}
                />
              </div>
              <p className="text-[10px] font-semibold tabular-nums" style={{ color }}>
                {pct}% of total
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
