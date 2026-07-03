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
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-pop-in ${
      type === 'error' ? 'bg-danger-500' : 'bg-success-500'
    }`}>
      {type === 'error' ? (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {message}
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="flex justify-center animate-fade-slide-up">
      <div className="flex items-start gap-3 bg-danger-100 border border-danger-200 text-danger-700 rounded-xl px-4 py-3 max-w-md w-full shadow-sm">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-danger-700">{message}</p>
        </div>
        {onRetry && (
          <button type="button" onClick={onRetry} className="flex-shrink-0 text-xs font-semibold text-danger-600 hover:text-danger-800 underline underline-offset-2 transition-colors">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

const ChatHeader = memo(function ChatHeader({ onOpenSidebar }) {
  return (
    <div className="h-14 flex items-center gap-3 px-4 border-b border-neutral-200 bg-white flex-shrink-0 shadow-sm">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open conversations"
        className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' }}>
          <SparkleIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-neutral-900 leading-tight">AI Career Coach</p>
            <SparkleIcon className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-tight">Powered by AI</p>
        </div>
      </div>
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
    { key: 'coach',   label: '💬 Career Coach' },
    { key: 'roadmap', label: '🗺️ Placement Roadmap' },
  ];

  return (
    <DashboardLayout title="AI Career Coach">
      <div className="flex flex-col h-full -m-4 sm:-m-6 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-neutral-200 bg-white flex-shrink-0 px-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={[
                'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                activeTab === key
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Roadmap tab */}
        {activeTab === 'roadmap' && (
          <RoadmapTab sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Career Coach tab */}
        {activeTab === 'coach' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}
            {/* Sidebar */}
            <div className={[
              'fixed inset-y-0 left-0 z-40 w-72 lg:relative lg:inset-auto lg:z-auto lg:w-72 lg:flex-shrink-0',
              'transition-transform duration-200 ease-out lg:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
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
            <div className="flex-1 flex flex-col min-w-0 bg-neutral-50">
              <ChatHeader onOpenSidebar={() => setSidebarOpen(true)} />
              <div className="flex-1 overflow-y-auto">
                {msgLoading ? (
                  <ChatSkeleton />
                ) : showEmptyState ? (
                  <EmptyState onChipClick={handleChipClick} />
                ) : (
                  <div className="px-4 py-5 space-y-5 max-w-3xl mx-auto w-full">
                    {messages.map((msg, i) => (
                      <ChatBubble key={i} role={msg.role} content={msg.content} />
                    ))}
                    {typing && <TypingIndicator />}
                    {error && <ErrorCard message={error} onRetry={handleRetry} />}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 bg-neutral-50 border-t border-neutral-200 px-4 pb-4 pt-3">
                <div className="max-w-3xl mx-auto w-full">
                  <MessageInput
                    value={input}
                    onChange={setInput}
                    onSend={() => handleSend()}
                    disabled={typing || msgLoading}
                  />
                  <p className="text-[10px] text-neutral-400 text-center mt-2">
                    AI can make mistakes. Always verify important career advice. · Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
