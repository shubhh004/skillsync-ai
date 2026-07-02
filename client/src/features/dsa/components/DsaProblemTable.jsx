import Card from '../../../components/ui/Card';

const difficultyStyle = {
  Easy:   'bg-success-100 text-success-700',
  Medium: 'bg-warning-100 text-warning-700',
  Hard:   'bg-danger-100 text-danger-700',
};

const statusStyle = {
  Solved:    'bg-success-100 text-success-700',
  Attempted: 'bg-warning-100 text-warning-700',
  Todo:      'bg-neutral-100 text-neutral-600',
};

function Badge({ label, styleMap }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styleMap[label]}`}>
      {label}
    </span>
  );
}

export default function DsaProblemTable({ problems }) {
  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Topic</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {problems.map((problem, index) => (
              <tr key={problem.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3.5 text-neutral-400 text-xs">{index + 1}</td>
                <td className="px-4 py-3.5">
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-neutral-900 hover:text-brand-600 transition-colors"
                  >
                    {problem.title}
                  </a>
                </td>
                <td className="px-4 py-3.5 text-neutral-600">{problem.topic}</td>
                <td className="px-4 py-3.5">
                  <Badge label={problem.difficulty} styleMap={difficultyStyle} />
                </td>
                <td className="px-4 py-3.5">
                  <Badge label={problem.status} styleMap={statusStyle} />
                </td>
                <td className="px-4 py-3.5 text-neutral-500 text-xs">{problem.platform}</td>
                <td className="px-4 py-3.5 text-neutral-400 text-xs max-w-48 truncate">
                  {problem.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
