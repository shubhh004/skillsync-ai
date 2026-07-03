const DIFF_CONFIG = {
  Easy:   { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',  text: '#22c55e' },
  Medium: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  Hard:   { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',  text: '#ef4444' },
};

const STATUS_CONFIG = {
  Solved:    { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   text: '#22c55e' },
  Attempted: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  text: '#f59e0b' },
  Todo:      { dot: '#71717a', bg: 'rgba(113,113,122,0.08)', border: 'rgba(113,113,122,0.2)', text: '#71717a' },
};

function DiffBadge({ label }) {
  const c = DIFF_CONFIG[label] ?? DIFF_CONFIG.Easy;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const c = STATUS_CONFIG[label] ?? STATUS_CONFIG.Todo;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {label}
    </span>
  );
}

const COLUMNS = ['#', 'Title', 'Topic', 'Difficulty', 'Status', 'Platform', 'Notes', 'Actions'];

export default function DsaProblemTable({ problems, onEdit, onDelete }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(24,24,27,0.65)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}>
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: '#52525b' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem._id}
                className="group transition-colors duration-150 hover:bg-white/[0.04]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                {/* # */}
                <td className="px-4 py-3.5 text-[11px] tabular-nums" style={{ color: '#3f3f46' }}>
                  {String(index + 1).padStart(2, '0')}
                </td>

                {/* Title */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  {problem.problemUrl ? (
                    <a
                      href={problem.problemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[13px] leading-snug transition-colors duration-150 hover:text-brand-400 flex items-center gap-1.5 group/link"
                      style={{ color: '#d4d4d8' }}
                    >
                      <span className="truncate">{problem.title}</span>
                      <svg
                        className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  ) : (
                    <span className="font-semibold text-[13px] leading-snug truncate block" style={{ color: '#d4d4d8' }}>
                      {problem.title}
                    </span>
                  )}
                </td>

                {/* Topic */}
                <td className="px-4 py-3.5">
                  <span className="text-xs font-medium" style={{ color: '#71717a' }}>{problem.topic}</span>
                </td>

                {/* Difficulty */}
                <td className="px-4 py-3.5">
                  <DiffBadge label={problem.difficulty} />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge label={problem.status} />
                </td>

                {/* Platform */}
                <td className="px-4 py-3.5">
                  <span className="text-[11px]" style={{ color: '#52525b' }}>
                    {problem.platform || <span style={{ color: '#3f3f46' }}>—</span>}
                  </span>
                </td>

                {/* Notes */}
                <td className="px-4 py-3.5 max-w-[160px]">
                  <span className="text-[11px] truncate block" style={{ color: '#52525b' }}>
                    {problem.notes || <span style={{ color: '#3f3f46' }}>—</span>}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => onEdit(problem)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                      style={{ color: '#52525b' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                        e.currentTarget.style.color = '#a5b4fc';
                        e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#52525b';
                        e.currentTarget.style.border = '1px solid transparent';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => onDelete(problem)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                      style={{ color: '#52525b' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.10)';
                        e.currentTarget.style.color = '#f87171';
                        e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#52525b';
                        e.currentTarget.style.border = '1px solid transparent';
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
    </div>
  );
}
