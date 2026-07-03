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
          className="bg-neutral-100 text-brand-600 rounded px-1 py-0.5 text-[0.82em] font-mono border border-neutral-200"
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
    <div className="my-3 rounded-xl overflow-hidden border border-neutral-700 shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800 border-b border-neutral-700">
        {lang ? (
          <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
            {lang}
          </span>
        ) : (
          <span className="text-[10px] text-neutral-600">code</span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-neutral-700"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-green-400">Copied!</span>
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
      <pre className="bg-neutral-900 px-4 py-3 overflow-x-auto font-mono text-[0.78rem] text-neutral-100 leading-relaxed">
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
      i++; // closing ```
      continue;
    }

    // Headings
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#{1,3})/)[1].length;
      const text  = line.replace(/^#{1,3}\s*/, '');
      const cls   = level === 1
        ? 'text-base font-bold text-neutral-900 mt-4 mb-1.5 leading-snug'
        : level === 2
        ? 'text-sm font-bold text-neutral-800 mt-3 mb-1'
        : 'text-sm font-semibold text-neutral-700 mt-2 mb-0.5';
      output.push(<p key={i} className={cls}>{parseInline(text)}</p>);
      i++;
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
        <div key={`table-${i}`} className="overflow-x-auto my-3 rounded-lg border border-neutral-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50">
                {headers.map((h, hi) => (
                  <th key={hi} className="border-b border-neutral-200 px-3 py-2 text-left font-semibold text-neutral-700">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 !== 0 ? 'bg-neutral-50/50' : ''}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-neutral-100 px-3 py-1.5 text-neutral-700 last:border-b-0">
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
        <ul key={`ul-${i}`} className="list-disc list-outside pl-5 space-y-1 my-2 text-sm text-neutral-800">
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
        <ol key={`ol-${i}`} className="list-decimal list-outside pl-5 space-y-1 my-2 text-sm text-neutral-800">
          {items.map((it, idx) => <li key={idx} className="leading-relaxed">{parseInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    // Blank line
    if (line.trim() === '') { i++; continue; }

    // Paragraph
    output.push(<p key={i} className="text-sm leading-relaxed text-neutral-800">{parseInline(line)}</p>);
    i++;
  }

  return output;
}

// ─── AI avatar ───────────────────────────────────────────────────────────────
function AIAvatar() {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
      style={{ background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' }}
    >
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
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
    <div className={`flex gap-3 animate-fade-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? <UserAvatar /> : <AIAvatar />}

      <div
        className={`max-w-[82%] px-4 py-3 ${
          isUser
            ? 'rounded-2xl rounded-tr-sm text-white'
            : 'rounded-2xl rounded-tl-sm bg-white border border-neutral-200 shadow-sm'
        }`}
        style={isUser ? { background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' } : undefined}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-1.5">{renderMarkdown(content)}</div>
        )}
      </div>
    </div>
  );
});

export default ChatBubble;
