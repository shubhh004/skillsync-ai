import Card from '../ui/Card';

const activities = [
  { type: 'dsa',       text: 'Solved "Two Sum" — Easy · Array',               time: '2 hours ago'  },
  { type: 'resume',    text: 'Updated Professional Summary on Resume',          time: '5 hours ago'  },
  { type: 'job',       text: 'Applied to Google SWE Internship',                time: 'Yesterday'    },
  { type: 'interview', text: 'Completed DSA Mock Interview — Score 82%',        time: '2 days ago'   },
  { type: 'dsa',       text: 'Solved "LRU Cache" — Hard · Design',              time: '3 days ago'   },
];

const typeConfig = {
  dsa:       { label: 'DSA',       dot: 'bg-brand-500'   },
  resume:    { label: 'Resume',    dot: 'bg-success-500' },
  job:       { label: 'Job',       dot: 'bg-warning-500' },
  interview: { label: 'Interview', dot: 'bg-danger-500'  },
};

export default function RecentActivity() {
  return (
    <Card padding={false}>
      <div className="px-6 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-900">Recent Activity</h3>
      </div>

      <ul className="divide-y divide-neutral-100">
        {activities.map(({ type, text, time }, i) => {
          const { label, dot } = typeConfig[type];
          return (
            <li key={i} className="flex items-start gap-4 px-6 py-4">
              <span className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-800 leading-snug">{text}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{time}</p>
              </div>
              <span className="flex-shrink-0 text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
