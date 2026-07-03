// Typing indicator — "AI is thinking..." with staggered dots
export function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row animate-fade-slide-up">
      {/* AI avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>

      {/* Bubble */}
      <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-xs text-neutral-500 font-medium">AI is thinking</span>
        <div className="flex items-center gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="block w-1.5 h-1.5 rounded-full bg-brand-400 animate-thinking"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton for initial sidebar load
export function SidebarSkeleton() {
  return (
    <div className="space-y-1.5 px-2 pt-2 animate-pulse">
      {[90, 75, 85, 60, 70].map((w, i) => (
        <div key={i} className="h-14 rounded-lg bg-neutral-100" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

// Skeleton rows while loading a chat's messages
export function ChatSkeleton() {
  return (
    <div className="space-y-4 animate-pulse px-4 py-4">
      {[
        { side: 'right', w: '60%' },
        { side: 'left',  w: '75%' },
        { side: 'left',  w: '55%' },
        { side: 'right', w: '40%' },
        { side: 'left',  w: '70%' },
      ].map(({ side, w }, i) => (
        <div key={i} className={`flex ${side === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200" />
          <div
            className="h-10 rounded-2xl bg-neutral-200"
            style={{ width: w }}
          />
        </div>
      ))}
    </div>
  );
}
