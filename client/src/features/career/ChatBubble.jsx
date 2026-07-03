import { useState, memo } from 'react';

// ─── Inline markdown: bold, inline code ──────────────────────────────────────
function parseInline(text) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
    const token = m[0];
    if (token.startsWith('`')) {
      parts.push(
        <code
          key={m.index}
          className="rounded-md px-1.5 py-0.5 text-[0.82em] font-mono"
          style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(
        <strong key={m.index} className="font-semibold text-neutral-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
  return parts.length ? parts : [text];
}

// ─── Code block with copy button ─────────────────────────────────────────────
function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(239,68,68,0.55)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,158,11,0.55)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,197,94,0.55)' }} />
          </div>
          {lang && (
            <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-wider">
              {lang}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-success-500">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="px-5 py-4 overflow-x-auto font-mono text-[0.79rem] leading-relaxed scrollbar-thin" style={{ background: 'rgba(9,9,11,0.9)', color: '#d4d4d8' }}>
        {code}
      </pre>
    </div>
  );
}

// ─── Full markdown renderer ───────────────────────────────────────────────────
function renderMarkdown(content) {
  const lines  = content.split('\n');
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang  = line.trim().slice(3).trim();
      const block = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        block.push(lines[i]);
        i++;
      }
      output.push(<CodeBlock key={`code-${i}`} lang={lang} code={block.join('\n')} />);
      i++;
      continue;
    }

    // Headings
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#{1,3})/)[1].length;
      const text  = line.replace(/^#{1,3}\s*/, '');
      const cls   = level === 1
        ? 'text-base font-bold text-neutral-900 mt-5 mb-2 leading-snug'
        : level === 2
        ? 'text-sm font-bold text-neutral-800 mt-4 mb-1.5'
        : 'text-sm font-semibold text-neutral-700 mt-3 mb-1';
      output.push(<p key={i} className={cls}>{parseInline(text)}</p>);
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^>\s/.test(lines[i])) {
        items.push(lines[i].replace(/^>\s/, ''));
        i++;
      }
      output.push(
        <blockquote key={`bq-${i}`} className="my-3 text-sm text-neutral-600 italic space-y-1 pl-4" style={{ borderLeft: '2px solid rgba(99,102,241,0.45)' }}>
          {items.map((it, idx) => <p key={idx}>{parseInline(it)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Table
    if (line.includes('|') && lines[i + 1]?.match(/^[\s|:-]+$/)) {
      const headers = line.split('|').map((c) => c.trim()).filter(Boolean);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map((c) => c.trim()).filter(Boolean));
        i++;
      }
      output.push(
        <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-xl scrollbar-thin" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-2.5 text-left font-semibold text-neutral-700 whitespace-nowrap">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: ri % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 text-neutral-700">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Bullet list
    if (/^[-*+]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ''));
        i++;
      }
      output.push(
        <ul key={`ul-${i}`} className="list-disc list-outside pl-5 space-y-1.5 my-3 text-sm text-neutral-800">
          {items.map((it, idx) => <li key={idx} className="leading-relaxed">{parseInline(it)}</li>)}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      output.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside pl-5 space-y-1.5 my-3 text-sm text-neutral-800">
          {items.map((it, idx) => <li key={idx} className="leading-relaxed">{parseInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    // Blank line
    if (line.trim() === '') { i++; continue; }

    // Paragraph
    output.push(<p key={i} className="text-sm leading-[1.7] text-neutral-800">{parseInline(line)}</p>);
    i++;
  }

  return output;
}

// ─── Avatars ──────────────────────────────────────────────────────────────────
function AIAvatar() {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: '0 0 0 2px rgba(99,102,241,0.25), 0 0 18px rgba(99,102,241,0.35), 0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
        style={{ background: '#22c55e', border: '2px solid #18181b' }}
      />
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
    >
      <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
  );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
const ChatBubble = memo(function ChatBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3.5 animate-fade-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? <UserAvatar /> : <AIAvatar />}

      <div
        className={`max-w-[84%] px-5 py-4 ${
          isUser
            ? 'rounded-3xl rounded-tr-sm'
            : 'rounded-3xl rounded-tl-sm'
        }`}
        style={isUser ? {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 55%, #4338ca 100%)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.25), 0 4px 20px rgba(0,0,0,0.45)',
          color: 'white',
        } : {
          background: 'rgba(24,24,27,0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.05) inset',
        }}
      >
        {isUser ? (
          <p className="text-sm leading-[1.7] whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-2">{renderMarkdown(content)}</div>
        )}
      </div>
    </div>
  );
});

export default ChatBubble;
