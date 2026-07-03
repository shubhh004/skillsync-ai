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
    <div className={`flex gap-2 items-end bg-white border rounded-2xl px-3 py-2 shadow-sm transition-shadow duration-150 ${
      disabled ? 'border-neutral-200' : 'border-neutral-300 hover:shadow-md focus-within:shadow-md focus-within:border-brand-400'
    }`}>
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about careers, resumes, interviews…"
        aria-label="Message input"
        className="flex-1 resize-none text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none leading-relaxed py-1.5 min-h-[40px] disabled:opacity-60"
      />

      {/* Send button */}
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send message"
        className={`flex-shrink-0 self-end w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
          canSend
            ? 'text-white hover:scale-105 active:scale-95 shadow-sm hover:shadow-md'
            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
        }`}
        style={canSend ? { background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' } : undefined}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
}
