const config = [
  { status: 'Applied',   textColor: 'text-brand-400',  iconBg: 'gradient-brand-subtle border-brand-200/20',   bar: 'bg-brand-500'   },
  { status: 'Interview', textColor: 'text-warning-700', iconBg: 'bg-warning-100/40 border-warning-500/20', bar: 'bg-warning-500' },
  { status: 'Offer',     textColor: 'text-success-700', iconBg: 'bg-success-100/40 border-success-500/20', bar: 'bg-success-500' },
  { status: 'Rejected',  textColor: 'text-danger-700',  iconBg: 'bg-danger-100/40  border-danger-500/20',  bar: 'bg-danger-500'  },
];

export default function JobSummaryCards({ jobs }) {
  const total = jobs.length || 1;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {config.map(({ status, textColor, iconBg, bar }) => {
        const count = jobs.filter((j) => j.status === status).length;
        const pct   = Math.round((count / total) * 100);
        return (
          <div key={status} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-neutral-500 tracking-wide">{status}</p>
                <p className="mt-1.5 text-3xl font-bold text-neutral-900 leading-none tracking-tight">{count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
                <span className={`text-sm font-bold tabular-nums ${textColor}`}>{pct}%</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${bar} transition-all duration-500 ease-smooth`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
