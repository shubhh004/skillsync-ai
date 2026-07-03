import Card from '../../../components/ui/Card';

const statusStyle = {
  Applied:   'bg-brand-50    text-brand-700',
  OA:        'bg-brand-100   text-brand-800',
  Interview: 'bg-warning-100 text-warning-700',
  HR:        'bg-warning-50  text-warning-600',
  Offer:     'bg-success-100 text-success-700',
  Accepted:  'bg-success-100 text-success-800',
  Rejected:  'bg-danger-100  text-danger-700',
};

const avatarColor = (name) => {
  const colors = [
    'bg-brand-100 text-brand-700',
    'bg-success-100 text-success-700',
    'bg-warning-100 text-warning-700',
    'bg-danger-100 text-danger-700',
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function JobTable({ jobs, onEdit, onDelete }) {
  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {['Company', 'Role', 'Status', 'Location', 'Applied Date', 'Job Type', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-neutral-200 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(job.company)}`}>
                      {job.company[0]}
                    </div>
                    {job.applicationLink ? (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-neutral-900 hover:text-brand-400 transition-colors"
                      >
                        {job.company}
                      </a>
                    ) : (
                      <span className="font-medium text-neutral-900">{job.company}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-neutral-700">{job.role}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[job.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-neutral-500 text-xs">{job.location || '—'}</td>
                <td className="px-4 py-3.5 text-neutral-500 text-xs">{formatDate(job.appliedDate)}</td>
                <td className="px-4 py-3.5 text-neutral-500 text-xs">{job.jobType || '—'}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => onEdit(job)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-brand-400 hover:bg-brand-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => onDelete(job)}
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
