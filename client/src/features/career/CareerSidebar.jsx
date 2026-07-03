import { useState } from 'react';
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

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function EmptySidebar() {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-14 pb-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(79,70,229,0.15) 100%)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 20px rgba(99,102,241,0.1)' }}
      >
        <ChatIcon className="w-8 h-8 text-brand-400" />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-2">No conversations yet</p>
      <p className="text-xs text-neutral-500 leading-relaxed max-w-[170px]">
        Start a new chat to begin your career coaching journey.
      </p>
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
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? chats.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()))
    : chats;

  return (
    <aside className="flex flex-col h-full glass-surface border-r border-white/10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 0 12px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-neutral-800 leading-none">Conversations</h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-none">
              {chats.length > 0
                ? `${chats.length} chat${chats.length !== 1 ? 's' : ''}`
                : 'No chats yet'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          aria-label="New conversation"
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-px active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 0 12px rgba(99,102,241,0.35), 0 2px 8px rgba(0,0,0,0.3)' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 16.803z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full h-9 pl-9 pr-3.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-neutral-700 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 focus:border-brand-500/40 focus:bg-white/[0.08] transition-all duration-150"
          />
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="mx-4 mb-3 h-px bg-white/[0.06] flex-shrink-0" />

      {/* ── Chat list ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
        {loading ? (
          <SidebarSkeleton />
        ) : filtered.length === 0 ? (
          <EmptySidebar />
        ) : (
          <div className="pb-4">
            {filtered.map((chat) => {
              const isActive = chat._id === activeChatId;
              return (
                /* Each row: px-3 creates gutter, pb-2 is gap between cards */
                <div key={chat._id} className="relative group px-3 pb-2">

                  {/* ── Card button ─────────────────────────────────── */}
                  <button
                    type="button"
                    onClick={() => onSelect(chat._id)}
                    className={[
                      'w-full text-left rounded-2xl p-4 pr-10 transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1',
                      isActive
                        ? 'border border-brand-500/25'
                        : 'bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-card-hover',
                    ].join(' ')}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(79,70,229,0.06) 100%)',
                      boxShadow: '0 0 0 1px rgba(99,102,241,0.2), 0 0 20px rgba(99,102,241,0.1), 0 4px 16px rgba(0,0,0,0.3)',
                    } : undefined}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Icon container */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isActive ? '' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
                        }`}
                        style={isActive ? {
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                        } : undefined}
                      >
                        <ChatIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-700'}`} />
                      </div>

                      {/* Text stack */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className={`text-sm font-semibold leading-snug truncate ${
                          isActive ? 'text-brand-400' : 'text-neutral-700 group-hover:text-neutral-900'
                        }`}>
                          {chat.title}
                        </p>
                        {chat.preview && (
                          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                            {chat.preview}
                          </p>
                        )}
                        <span className={`text-[10px] mt-2 block font-medium ${isActive ? 'text-brand-400/60' : 'text-neutral-600'}`}>
                          {timeAgo(chat.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* ── Delete button ────────────────────────────────── */}
                  <button
                    type="button"
                    onClick={() => onDelete(chat._id)}
                    aria-label="Delete conversation"
                    className="absolute right-5 top-4 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1.5 rounded-lg hover:bg-danger-500/10 text-neutral-500 hover:text-danger-500 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-500"
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
