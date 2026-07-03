import { useRef, useEffect } from 'react';

export default function MessageInput({ value, onChange, onSend, disabled }) {
  const ref = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 168) + 'px';
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div
      className={[
        'flex items-end gap-2 glass-surface rounded-3xl px-3 py-3 transition-all duration-200',
        'border border-white/10',
        disabled
          ? 'opacity-70'
          : 'hover:border-white/20 focus-within:border-brand-500/40 focus-within:shadow-glow-sm',
      ].join(' ')}
    >
      {/* Attachment placeholder */}
      <button
        type="button"
        disabled={disabled}
        aria-label="Attach file"
        className="flex-shrink-0 self-end mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-white/10 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      </button>

      {/* Textarea */}
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about careers, resumes, interviews…"
        aria-label="Message input"
        className="flex-1 resize-none text-sm text-neutral-800 placeholder:text-neutral-500 bg-transparent outline-none leading-relaxed py-1.5 min-h-[28px] scrollbar-hidden disabled:opacity-60"
      />

      {/* Voice placeholder */}
      <button
        type="button"
        disabled={disabled}
        aria-label="Voice input"
        className="flex-shrink-0 self-end mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-white/10 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* Send button */}
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send message"
        className={[
          'flex-shrink-0 self-end w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          canSend
            ? 'gradient-brand text-white shadow-glow-sm hover:shadow-glow hover:-translate-y-px active:scale-95'
            : 'bg-white/5 text-neutral-500 cursor-not-allowed',
        ].join(' ')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
}
