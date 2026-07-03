import { SidebarSkeleton } from './LoadingState';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function EmptySidebar() {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-neutral-200 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-neutral-600 mb-2">No conversations yet</p>
      <p className="text-xs text-neutral-400 leading-relaxed">Start a new chat to begin your career coaching journey.</p>
    </div>
  );
}

export default function CareerSidebar({
  chats,
  loading,
  activeChatId,
  onSelect,
  onNewChat,
  onDelete,
}) {
  return (
    <aside className="flex flex-col h-full bg-neutral-100 border-r border-neutral-200">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-200 flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-neutral-800 leading-none">History</h2>
          <p className="text-xs text-neutral-400 mt-1 leading-none">
            {chats.length > 0
              ? `${chats.length} conversation${chats.length !== 1 ? 's' : ''}`
              : 'No conversations yet'}
          </p>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          aria-label="New conversation"
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg text-white transition-all duration-150 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* ── Chat list ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <SidebarSkeleton />
        ) : chats.length === 0 ? (
          <EmptySidebar />
        ) : (
          <div className="p-3 space-y-2">
            {chats.map((chat) => {
              const isActive = chat._id === activeChatId;
              return (
                /* group wrapper — fixes the nested-button antipattern */
                <div key={chat._id} className="relative group">

                  {/* Main select button */}
                  <button
                    type="button"
                    onClick={() => onSelect(chat._id)}
                    className={[
                      'w-full text-left rounded-xl px-4 py-3.5 pr-10 transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-100',
                      isActive
                        ? 'bg-brand-50 border border-brand-500/30 shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_4px_16px_rgba(99,102,241,0.12)]'
                        : 'bg-neutral-0 border border-neutral-200 hover:border-neutral-300 hover:-translate-y-0.5 hover:shadow-lg',
                    ].join(' ')}
                  >
                    {/* Active left-edge accent */}
                    {isActive && (
                      <span className="absolute left-0 top-4 bottom-4 w-[3px] bg-brand-500 rounded-r-full" />
                    )}

                    {/* Title + timestamp */}
                    <div className="flex items-start gap-2">
                      <p className={`flex-1 text-sm font-semibold leading-snug truncate ${
                        isActive
                          ? 'text-brand-400'
                          : 'text-neutral-800 group-hover:text-neutral-900'
                      }`}>
                        {chat.title}
                      </p>
                      <span className="flex-shrink-0 text-[11px] text-neutral-400 leading-snug pt-px">
                        {timeAgo(chat.updatedAt)}
                      </span>
                    </div>

                    {/* Preview — 2-line clamp */}
                    {chat.preview && (
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
                        {chat.preview}
                      </p>
                    )}
                  </button>

                  {/* Delete button — sibling, never nested inside the select button */}
                  <button
                    type="button"
                    onClick={() => onDelete(chat._id)}
                    aria-label="Delete conversation"
                    className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1.5 rounded-lg hover:bg-danger-100 text-neutral-400 hover:text-danger-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-500"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
