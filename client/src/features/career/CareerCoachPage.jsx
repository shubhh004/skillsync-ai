import { useState, useEffect, useRef, useCallback, memo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CareerSidebar from './CareerSidebar';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import EmptyState from './EmptyState';
import { TypingIndicator, ChatSkeleton } from './LoadingState';
import { sendMessage, getChats, getChat, deleteChat } from './careerService';
import RoadmapTab from './roadmap/RoadmapTab';

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-elevated text-sm font-medium flex items-center gap-2.5 animate-pop-in glass-heavy border max-w-[calc(100vw-3rem)] ${
      type === 'error' ? 'border-danger-500/30' : 'border-success-500/30'
    }`}>
      {type === 'error' ? (
        <svg className="w-4 h-4 flex-shrink-0 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span style={{ color: type === 'error' ? '#fca5a5' : '#86efac' }}>{message}</span>
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="flex justify-center animate-fade-slide-up">
      <div className="flex items-start gap-3 bg-danger-500/10 border border-danger-500/20 text-danger-400 rounded-2xl px-4 py-3.5 max-w-md w-full">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex-shrink-0 text-xs font-semibold text-danger-400 hover:text-danger-300 underline underline-offset-2 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

const ChatHeader = memo(function ChatHeader({ onOpenSidebar, activeChatId }) {
  return (
    <div
      className="flex-shrink-0 h-16 flex items-center gap-3 px-5 border-b border-white/10"
      style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(24px)' }}
    >
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open conversations"
        className="lg:hidden flex-shrink-0 p-2 rounded-xl text-neutral-500 hover:bg-white/10 hover:text-neutral-700 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* AI identity */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 55%, #db2777 100%)',
              boxShadow: '0 0 0 2px rgba(244,114,182,0.32), 0 0 24px rgba(244,114,182,0.5), 0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <SparkleIcon className="w-5 h-5 text-white" />
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
            style={{ background: '#22c55e', border: '2px solid #18181b' }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-neutral-900 leading-none">AI Career Coach</p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              GPT-4o
            </span>
          </div>
          <p className="text-[11px] font-medium leading-none mt-1.5 text-success-500">● Online</p>
        </div>
      </div>

      {/* Conversation action buttons — UI only */}
      {activeChatId && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Share */}
          <button
            type="button"
            aria-label="Share conversation"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-white/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
          {/* Favorite */}
          <button
            type="button"
            aria-label="Favorite"
            className="p-2 rounded-xl text-neutral-500 hover:text-brand-400 hover:bg-white/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
          {/* More / ellipsis */}
          <button
            type="button"
            aria-label="More options"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-white/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CareerCoachPage() {
  const [activeTab,    setActiveTab]    = useState('coach');
  const [chats,        setChats]        = useState([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [msgLoading,   setMsgLoading]   = useState(false);
  const [typing,       setTyping]       = useState(false);
  const [input,        setInput]        = useState('');
  const [error,        setError]        = useState(null);
  const [toast,        setToast]        = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const bottomRef  = useRef(null);
  const lastMsgRef = useRef('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadChats = useCallback(async () => {
    try {
      const list = await getChats();
      setChats(list);
    } catch { /* non-fatal */ }
    finally { setChatsLoading(false); }
  }, []);

  useEffect(() => { loadChats(); }, [loadChats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSelectChat = useCallback(async (id) => {
    if (id === activeChatId) { setSidebarOpen(false); return; }
    setMsgLoading(true);
    setError(null);
    setSidebarOpen(false);
    try {
      const chat = await getChat(id);
      setActiveChatId(id);
      setMessages(chat.messages);
    } catch {
      setError('Failed to load conversation. Please try again.');
    } finally {
      setMsgLoading(false);
    }
  }, [activeChatId]);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
    setInput('');
    setSidebarOpen(false);
  }, []);

  const handleDeleteChat = useCallback(async (id) => {
    try {
      await deleteChat(id);
      setChats(prev => prev.filter(c => c._id !== id));
      if (activeChatId === id) { setActiveChatId(null); setMessages([]); }
    } catch {
      showToast('Failed to delete conversation.', 'error');
    }
  }, [activeChatId, showToast]);

  const handleSend = useCallback(async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    lastMsgRef.current = msg;
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setTyping(true);
    try {
      const { reply, chatId } = await sendMessage(msg, activeChatId);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      if (!activeChatId) setActiveChatId(chatId);
      loadChats();
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setTyping(false);
    }
  }, [input, activeChatId, typing, loadChats]);

  const handleChipClick = useCallback((chip) => { handleSend(chip); }, [handleSend]);
  const handleRetry     = useCallback(() => { setError(null); handleSend(lastMsgRef.current); }, [handleSend]);

  const showEmptyState = !msgLoading && messages.length === 0 && !error;

  const TABS = [
    { key: 'coach',   label: '💬 Career Coach',      labelSm: '💬 Career Coach' },
    { key: 'roadmap', label: '🗺️ Roadmap',           labelSm: '🗺️ Placement Roadmap' },
  ];

  return (
    <DashboardLayout title="AI Career Coach" noPadding>
      <div className="flex flex-col flex-1 min-h-0">

        {/* ── Tab bar ──────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex gap-1 bg-white/5 rounded-2xl p-1">
            {TABS.map(({ key, label, labelSm }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={[
                  'flex-1 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
                  activeTab === key
                    ? 'glass-brand text-brand-400 shadow-glow-sm'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/5',
                ].join(' ')}
              >
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{labelSm}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Roadmap tab ───────────────────────────────────────────────────── */}
        {activeTab === 'roadmap' && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <RoadmapTab sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        )}

        {/* ── Career Coach tab ──────────────────────────────────────────────── */}
        {activeTab === 'coach' && (
          <div className="flex flex-1 min-h-0">

            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Sidebar */}
            <div className={[
              'fixed inset-y-3 left-3 z-40 w-72 rounded-3xl overflow-hidden',
              'lg:relative lg:inset-auto lg:z-auto lg:w-[280px] lg:rounded-none lg:flex-shrink-0',
              'transition-transform duration-300 ease-out-quart lg:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+0.75rem)]',
            ].join(' ')}>
              <CareerSidebar
                chats={chats}
                loading={chatsLoading}
                activeChatId={activeChatId}
                onSelect={handleSelectChat}
                onNewChat={handleNewChat}
                onDelete={handleDeleteChat}
              />
            </div>

            {/* Main chat area */}
            <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
              {/* Ambient radial lights */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                  className="absolute top-24 right-24 w-96 h-80 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)' }}
                />
                <div
                  className="absolute bottom-48 left-16 w-80 h-64 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
                />
              </div>
              <ChatHeader
                onOpenSidebar={() => setSidebarOpen(true)}
                activeChatId={activeChatId}
              />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
                {msgLoading ? (
                  <ChatSkeleton />
                ) : showEmptyState ? (
                  <EmptyState onChipClick={handleChipClick} />
                ) : (
                  <div className="max-w-[840px] mx-auto px-6 py-8 space-y-5">
                    {messages.map((msg, i) => (
                      <ChatBubble key={`${msg.role}-${i}`} role={msg.role} content={msg.content} />
                    ))}
                    {typing && <TypingIndicator />}
                    {error && <ErrorCard message={error} onRetry={handleRetry} />}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input area — floating with soft fade above */}
              <div
                className="flex-shrink-0 px-6 pb-4 pt-3"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.6) 30%, rgba(9,9,11,0.9) 100%)' }}
              >
                <MessageInput
                  value={input}
                  onChange={setInput}
                  onSend={() => handleSend()}
                  disabled={typing || msgLoading}
                />
                <p className="text-[10px] text-neutral-500 text-center mt-2.5">
                  <span className="sm:hidden">Enter to send · Shift+Enter for new line</span>
                  <span className="hidden sm:inline">AI can make mistakes. Always verify important career advice. · Enter to send · Shift+Enter for new line</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
