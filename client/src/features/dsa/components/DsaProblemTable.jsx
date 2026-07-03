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

export default function DsaProblemTable({ problems, onEdit, onDelete }) {
  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {['#', 'Title', 'Topic', 'Difficulty', 'Status', 'Platform', 'Notes', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {problems.map((problem, index) => (
              <tr key={problem._id} className="hover:bg-neutral-200 transition-colors">
                <td className="px-4 py-3.5 text-neutral-400 text-xs">{index + 1}</td>
                <td className="px-4 py-3.5">
                  {problem.problemUrl ? (
                    <a
                      href={problem.problemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-neutral-900 hover:text-brand-400 transition-colors"
                    >
                      {problem.title}
                    </a>
                  ) : (
                    <span className="font-medium text-neutral-900">{problem.title}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-neutral-600">{problem.topic}</td>
                <td className="px-4 py-3.5">
                  <Badge label={problem.difficulty} styleMap={difficultyStyle} />
                </td>
                <td className="px-4 py-3.5">
                  <Badge label={problem.status} styleMap={statusStyle} />
                </td>
                <td className="px-4 py-3.5 text-neutral-500 text-xs">{problem.platform || '—'}</td>
                <td className="px-4 py-3.5 text-neutral-400 text-xs max-w-48 truncate">
                  {problem.notes || '—'}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => onEdit(problem)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-brand-400 hover:bg-brand-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => onDelete(problem)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
