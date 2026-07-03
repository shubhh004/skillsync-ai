// Typing indicator — beautiful AI thinking animation
export function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row animate-fade-slide-up">
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center shadow-glow-sm">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-neutral-50" />
      </div>

      <div className="card rounded-3xl rounded-tl-sm px-5 py-3.5 shadow-card-hover flex items-center gap-4">
        <span className="text-xs text-neutral-500 font-medium tracking-wide">Thinking</span>
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="block w-2 h-2 rounded-full bg-brand-400 animate-thinking"
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
    <div className="px-3 pb-3 pt-1 space-y-1.5">
      {[90, 75, 85, 60, 80].map((w, i) => (
        <div
          key={i}
          className="h-14 rounded-xl skeleton-shimmer"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// Skeleton rows while loading a chat's messages
export function ChatSkeleton() {
  return (
    <div className="max-w-[840px] mx-auto px-6 py-8">
      <div className="space-y-6">
        {[
          { side: 'right', w: '58%', h: 'h-12' },
          { side: 'left',  w: '72%', h: 'h-20' },
          { side: 'left',  w: '52%', h: 'h-14' },
          { side: 'right', w: '40%', h: 'h-10' },
          { side: 'left',  w: '68%', h: 'h-24' },
        ].map(({ side, w, h }, i) => (
          <div key={i} className={`flex ${side === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
            <div className="flex-shrink-0 w-9 h-9 rounded-full skeleton-shimmer" />
            <div className={`${h} rounded-3xl skeleton-shimmer`} style={{ width: w }} />
          </div>
        ))}
      </div>
    </div>
  );
}
