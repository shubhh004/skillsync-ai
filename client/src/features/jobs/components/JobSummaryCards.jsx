import Card from '../../../components/ui/Card';

const config = [
  { status: 'Applied',   color: 'text-brand-600',   bg: 'bg-brand-50',    bar: 'bg-brand-500'   },
  { status: 'Interview', color: 'text-warning-700',  bg: 'bg-warning-100', bar: 'bg-warning-500' },
  { status: 'Offer',     color: 'text-success-700',  bg: 'bg-success-100', bar: 'bg-success-500' },
  { status: 'Rejected',  color: 'text-danger-700',   bg: 'bg-danger-100',  bar: 'bg-danger-500'  },
];

export default function JobSummaryCards({ jobs }) {
  const total = jobs.length || 1;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {config.map(({ status, color, bg, bar }) => {
        const count = jobs.filter((j) => j.status === status).length;
        const pct = Math.round((count / total) * 100);
        return (
          <Card key={status}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">{status}</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 leading-none">{count}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                <span className={`text-base font-bold ${color}`}>{pct}%</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
