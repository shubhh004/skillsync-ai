import { useState, useCallback } from 'react';
import { updateChecklist as apiUpdateChecklist, downloadRoadmapPDF } from '../roadmapService';

// ─── Simple markdown parser (no dependency on ChatBubble) ─────────────────────
function parseInline(text) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
    const t = m[0];
    if (t.startsWith('`')) {
      parts.push(<code key={m.index} className="bg-neutral-200 text-brand-400 rounded px-1 py-0.5 text-[0.82em] font-mono border border-neutral-300">{t.slice(1,-1)}</code>);
    } else {
      parts.push(<strong key={m.index} className="font-semibold text-neutral-900">{t.slice(2,-2)}</strong>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
  return parts.length ? parts : [text];
}

function renderMarkdown(content) {
  const lines = content.split('\n');
  const output = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const block = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) { block.push(lines[i]); i++; }
      output.push(
        <pre key={i} className="bg-neutral-900 text-green-400 rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed my-3 border border-neutral-700">
          {lang && <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2">{lang}</div>}
          {block.join('\n')}
        </pre>
      );
      i++; continue;
    }
    if (/^## /.test(line)) {
      output.push(<h2 key={i} className="text-base font-bold text-neutral-900 mt-6 mb-2 border-b border-neutral-200 pb-1">{parseInline(line.replace(/^## /,''))}</h2>);
      i++; continue;
    }
    if (/^### /.test(line)) {
      output.push(<h3 key={i} className="text-sm font-semibold text-neutral-800 mt-4 mb-1.5">{parseInline(line.replace(/^### /,''))}</h3>);
      i++; continue;
    }
    if (/^- \[[ x]\] /.test(line)) {
      // Render checklist items in content as visual bullets (non-interactive; interactive checklist is below)
      output.push(<p key={i} className="text-sm text-neutral-600 ml-2 mb-0.5">▸ {parseInline(line.replace(/^- \[[ x]\] /,''))}</p>);
      i++; continue;
    }
    if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].replace(/^[-*] /,'')); i++; }
      output.push(<ul key={i} className="list-disc list-outside pl-5 space-y-0.5 my-2 text-sm text-neutral-800">{items.map((it,idx)=><li key={idx} className="leading-relaxed">{parseInline(it)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /,'')); i++; }
      output.push(<ol key={i} className="list-decimal list-outside pl-5 space-y-0.5 my-2 text-sm text-neutral-800">{items.map((it,idx)=><li key={idx} className="leading-relaxed">{parseInline(it)}</li>)}</ol>);
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    output.push(<p key={i} className="text-sm leading-relaxed text-neutral-800 mb-1">{parseInline(line)}</p>);
    i++;
  }
  return output;
}

// ─── Score badge ─────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const color = score >= 70 ? 'bg-success-100 text-success-700 border-success-200'
    : score >= 40 ? 'bg-warning-100 text-warning-700 border-warning-200'
    : 'bg-danger-100 text-danger-700 border-danger-200';
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${color}`}>
      {score}/100
    </span>
  );
}

// ─── Checklist panel ──────────────────────────────────────────────────────────
function ChecklistPanel({ roadmapId, checklist, onChange }) {
  const [saving, setSaving] = useState(false);

  const toggle = useCallback(async (idx) => {
    const updated = checklist.map((item, i) =>
      i === idx ? { ...item, done: !item.done } : item
    );
    onChange(updated);
    setSaving(true);
    try {
      await apiUpdateChecklist(roadmapId, updated);
    } catch {
      // revert optimistically? For simplicity, no — the next load will sync
    } finally {
      setSaving(false);
    }
  }, [checklist, roadmapId, onChange]);

  const done  = checklist.filter(i => i.done).length;
  const total = checklist.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-neutral-0 border border-neutral-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Progress Checklist</h3>
          <p className="text-xs text-neutral-500 mt-0.5">{done}/{total} tasks completed {saving && '· saving…'}</p>
        </div>
        <span className={`text-sm font-bold ${pct >= 70 ? 'text-success-700' : pct >= 40 ? 'text-warning-700' : 'text-neutral-500'}`}>
          {pct}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 bg-neutral-100">
        <div
          className="h-full bg-brand-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Items */}
      <ul className="divide-y divide-neutral-200 max-h-80 overflow-y-auto">
        {checklist.map((item, idx) => (
          <li key={idx}>
            <label className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggle(idx)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500 flex-shrink-0 cursor-pointer"
              />
              <span className={`text-sm leading-snug ${item.done ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                {item.text}
              </span>
            </label>
          </li>
        ))}
        {checklist.length === 0 && (
          <li className="px-5 py-6 text-center text-sm text-neutral-400">No checklist items found.</li>
        )}
      </ul>
    </div>
  );
}

// ─── Main RoadmapView ─────────────────────────────────────────────────────────
export default function RoadmapView({ roadmap: initialRoadmap, onRegenerate, onDelete, regenerating }) {
  const [roadmap,   setRoadmap]   = useState(initialRoadmap);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'checklist'

  // Sync when parent passes a new roadmap (e.g. after regenerate)
  if (initialRoadmap._id !== roadmap._id || initialRoadmap.updatedAt !== roadmap.updatedAt) {
    setRoadmap(initialRoadmap);
  }

  const handleChecklistChange = (updated) => {
    setRoadmap(prev => ({ ...prev, checklist: updated }));
  };

  const done  = roadmap.checklist.filter(i => i.done).length;
  const total = roadmap.checklist.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Header card */}
        <div className="bg-neutral-0 rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-neutral-900 truncate">{roadmap.targetRole}</h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                {[roadmap.targetCompany, roadmap.timeline, roadmap.skillLevel].filter(Boolean).join(' · ')}
              </p>
            </div>
            <ScoreBadge score={roadmap.readinessScore} />
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>{done}/{total} tasks completed</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-200 text-brand-400 bg-brand-50 hover:bg-brand-50/80 transition-colors disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {regenerating ? 'Regenerating…' : 'Regenerate'}
            </button>
            <button
              type="button"
              onClick={() => downloadRoadmapPDF(roadmap)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-danger-200 text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors ml-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {/* Inner tabs */}
        <div className="flex border-b border-neutral-200">
          {[
            { key: 'roadmap',   label: '🗺️ Roadmap' },
            { key: 'checklist', label: `✅ Checklist (${done}/${total})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={[
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === key
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'roadmap' ? (
          <div className="bg-neutral-0 rounded-xl border border-neutral-200 shadow-sm px-5 py-5 animate-fade-slide-up">
            <div className="space-y-1">
              {renderMarkdown(roadmap.content)}
            </div>
          </div>
        ) : (
          <div className="animate-fade-slide-up">
            <ChecklistPanel
              roadmapId={roadmap._id}
              checklist={roadmap.checklist}
              onChange={handleChecklistChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
