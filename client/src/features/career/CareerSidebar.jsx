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
    <div className="flex flex-col items-center justify-center px-4 pt-12 pb-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </div>
      <p className="text-xs font-medium text-neutral-600 mb-1">No conversations yet</p>
      <p className="text-xs text-neutral-400">Ask a question to get started</p>
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
    <aside className="flex flex-col h-full border-r border-neutral-200 bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 flex-shrink-0">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">History</h2>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New conversation"
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <SidebarSkeleton />
        ) : chats.length === 0 ? (
          <EmptySidebar />
        ) : (
          <ul className="space-y-0.5 px-2 py-1">
            {chats.map((chat) => {
              const isActive = chat._id === activeChatId;
              return (
                <li key={chat._id}>
                  <button
                    type="button"
                    onClick={() => onSelect(chat._id)}
                    className={[
                      'w-full text-left rounded-lg px-3 py-2.5 group relative transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                      isActive
                        ? 'bg-brand-50 border border-brand-100'
                        : 'hover:bg-neutral-50 border border-transparent',
                    ].join(' ')}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-r-full" />
                    )}

                    <div className="flex items-start justify-between gap-2 pl-0.5">
                      <p className={`text-xs font-medium truncate leading-snug ${
                        isActive ? 'text-brand-700' : 'text-neutral-800 group-hover:text-neutral-900'
                      }`}>
                        {chat.title}
                      </p>
                      <span className="text-[10px] text-neutral-400 flex-shrink-0 mt-px">
                        {timeAgo(chat.updatedAt)}
                      </span>
                    </div>

                    {chat.preview && (
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5 pl-0.5 pr-5 leading-snug">
                        {chat.preview}
                      </p>
                    )}

                    {/* Delete button — only visible on hover */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDelete(chat._id); }}
                      aria-label="Delete conversation"
                      className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-danger-100 text-neutral-400 hover:text-danger-600 focus-visible:opacity-100 focus-visible:outline-none"
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
