function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function scoreColor(score) {
  if (score >= 70) return 'text-success-700';
  if (score >= 40) return 'text-warning-700';
  return 'text-danger-700';
}

function EmptyList() {
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12 text-center">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      </div>
      <p className="text-xs font-medium text-neutral-600 mb-1">No roadmaps yet</p>
      <p className="text-xs text-neutral-400">Generate your first roadmap</p>
    </div>
  );
}

export default function RoadmapList({ roadmaps, loading, activeId, onSelect, onNew, onDelete }) {
  return (
    <aside className="flex flex-col h-full border-r border-neutral-200 bg-neutral-100">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 flex-shrink-0">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">My Roadmaps</h2>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-brand-400 bg-brand-50 hover:bg-brand-50/80 transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="space-y-1.5 px-2 pt-2 animate-pulse">
            {[90, 75, 85].map((w, i) => (
              <div key={i} className="h-16 rounded-lg bg-neutral-100" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : roadmaps.length === 0 ? (
          <EmptyList />
        ) : (
          <ul className="space-y-0.5 px-2 py-1">
            {roadmaps.map((rm) => {
              const isActive = rm._id === activeId;
              const pct = rm.checklistTotal > 0
                ? Math.round((rm.checklistDone / rm.checklistTotal) * 100)
                : 0;
              return (
                <li key={rm._id}>
                  <button
                    type="button"
                    onClick={() => onSelect(rm._id)}
                    className={[
                      'w-full text-left rounded-lg px-3 py-2.5 group relative transition-all duration-150',
                      isActive
                        ? 'bg-brand-50 border border-brand-100'
                        : 'hover:bg-neutral-200 border border-transparent',
                    ].join(' ')}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-r-full" />
                    )}
                    <div className="flex items-start justify-between gap-2 pl-0.5">
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-brand-400' : 'text-neutral-700'}`}>
                          {rm.targetCompany || rm.targetRole}
                        </p>
                        {rm.targetCompany && (
                          <p className="text-[11px] text-neutral-500 truncate">{rm.targetRole}</p>
                        )}
                      </div>
                      <span className={`text-xs font-bold flex-shrink-0 ${scoreColor(rm.readinessScore)}`}>
                        {rm.readinessScore}%
                      </span>
                    </div>
                    <div className="mt-2 pl-0.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-400">{rm.checklistDone}/{rm.checklistTotal} tasks</span>
                        <span className="text-[10px] text-neutral-400">{timeAgo(rm.updatedAt)}</span>
                      </div>
                      <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {/* Delete on hover */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDelete(rm._id); }}
                      aria-label="Delete roadmap"
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-danger-100 text-neutral-400 hover:text-danger-600"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
                    </button>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
