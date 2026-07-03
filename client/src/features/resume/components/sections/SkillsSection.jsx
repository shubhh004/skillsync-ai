import { useState, useEffect, useRef, useCallback } from 'react';
import { SKILL_DICT, normalizeSkills } from '../../../../utils/skillsUtils';

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-neutral-900">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SkillsSection({ data, onChange }) {
  const [input, setInput]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef    = useRef(null);
  const listRef     = useRef(null);
  const initialized = useRef(false);

  // One-time backward-compat migration on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const normalized = normalizeSkills(data);
    if (normalized.length !== data.length || normalized.some((s, i) => s !== data[i])) {
      onChange(normalized);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const skills = Array.isArray(data) ? data : [];

  const updateSuggestions = useCallback((query) => {
    const q = query.trim().toLowerCase();
    if (!q) { setSuggestions([]); setActiveIdx(-1); return; }
    const already = new Set(skills.map((s) => s.toLowerCase()));
    const filtered = SKILL_DICT.filter(
      (s) => s.toLowerCase().includes(q) && !already.has(s.toLowerCase())
    ).slice(0, 8);
    setSuggestions(filtered);
    setActiveIdx(-1);
  }, [skills]);

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    const already = new Set(skills.map((s) => s.toLowerCase()));
    if (!already.has(trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
  }, [skills, onChange]);

  const addFromInput = useCallback(() => {
    const raw = input;
    // Smart paste: split on comma or newline
    const parts = raw.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      const already = new Set(skills.map((s) => s.toLowerCase()));
      const newSkills = [...skills];
      for (const p of parts) {
        if (!already.has(p.toLowerCase())) { already.add(p.toLowerCase()); newSkills.push(p); }
      }
      onChange(newSkills);
    } else {
      addSkill(raw);
    }
    setInput('');
    setSuggestions([]);
    setActiveIdx(-1);
  }, [input, skills, onChange, addSkill]);

  const selectSuggestion = (skill) => {
    addSkill(skill);
    setInput('');
    setSuggestions([]);
    setActiveIdx(-1);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
        return;
      }
      if (e.key === 'Escape') {
        setSuggestions([]);
        setActiveIdx(-1);
        return;
      }
      if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIdx]);
        return;
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      addFromInput();
    }
  };

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  return (
    <div className="space-y-4">
      {/* Input row */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); updateSuggestions(e.target.value); }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
            placeholder="Type a skill — or paste comma-separated to add many"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          <button
            type="button"
            onClick={addFromInput}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-colors flex-shrink-0"
          >
            Add
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-20 left-0 right-10 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-y-auto max-h-52 text-sm"
          >
            {suggestions.map((s, i) => (
              <li
                key={s}
                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                className={[
                  'px-3 py-2 cursor-pointer transition-colors text-neutral-700',
                  i === activeIdx ? 'bg-brand-50 text-brand-800' : 'hover:bg-neutral-50',
                ].join(' ')}
              >
                {highlight(s, input.trim())}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Skill chips */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 hover:border-brand-300 transition-colors"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-brand-400 hover:text-brand-700 transition-colors leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">No skills added yet. Start typing above.</p>
      )}
    </div>
  );
}
