import { useState, useRef, useEffect, useCallback } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const STATUS_OPTIONS = [
  { value: 'Applied',   label: 'Applied',   dot: '#6366f1' },
  { value: 'OA',        label: 'OA',        dot: '#818cf8' },
  { value: 'Interview', label: 'Interview', dot: '#f59e0b' },
  { value: 'HR',        label: 'HR',        dot: '#fbbf24' },
  { value: 'Offer',     label: 'Offer',     dot: '#22c55e' },
  { value: 'Accepted',  label: 'Accepted',  dot: '#4ade80' },
  { value: 'Rejected',  label: 'Rejected',  dot: '#ef4444' },
];

// ─── Premium custom dropdown (same pattern as DsaFilterBar) ──────────────────
function FilterSelect({ value, onChange, options, placeholder, searchable = false, minWidth = 148 }) {
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState('');
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const searchRef    = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
    if (!open) setHighlighted(-1);
  }, [open, searchable]);

  const filtered = searchable && query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const select = useCallback((val) => {
    onChange(val);
    setOpen(false);
    setQuery('');
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHighlighted(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); break;
      case 'Enter':     e.preventDefault(); if (highlighted >= 0 && filtered[highlighted]) select(filtered[highlighted].value); break;
      case 'Escape':    setOpen(false); setQuery(''); break;
      default: break;
    }
  };

  const activeOption = options.find((o) => o.value === value);
  const isActive = !!value;

  return (
    <div ref={containerRef} className="relative flex-shrink-0" style={{ minWidth }} onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl text-xs font-medium transition-all duration-150 focus:outline-none"
        style={{
          background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(24,24,27,0.65)',
          border: isActive ? '1px solid rgba(99,102,241,0.35)' : open ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(16px)',
          color: isActive ? '#a5b4fc' : '#71717a',
          boxShadow: open ? '0 0 0 2px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {activeOption?.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeOption.dot }} />}
          <span className="truncate">{activeOption?.label ?? placeholder}</span>
        </span>
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#52525b' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-50 rounded-xl overflow-hidden animate-fade-in"
          style={{
            minWidth: Math.max(minWidth, 172),
            background: 'rgba(15,15,17,0.96)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
          }}
          role="listbox"
        >
          {searchable && (
            <div className="p-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: '#52525b' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                  className="w-full text-[11px] pl-7 pr-2.5 py-1.5 rounded-lg outline-none placeholder:text-neutral-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#d4d4d8' }}
                />
              </div>
            </div>
          )}

          <div className="pt-1 pb-1">
            {/* All / clear option */}
            <div
              role="option" aria-selected={!value}
              onClick={() => select('')}
              onMouseEnter={() => setHighlighted(-1)}
              className="flex items-center justify-between gap-2 mx-1 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-medium transition-colors duration-100"
              style={{ color: !value ? '#a5b4fc' : '#71717a', background: !value ? 'rgba(99,102,241,0.1)' : 'transparent' }}
            >
              <span>{placeholder}</span>
              {!value && (
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>

            <div className="mx-2 my-1" style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            <div className="max-h-52 overflow-y-auto">
              {filtered.map((opt, i) => {
                const isSelected = value === opt.value;
                const isHovered  = highlighted === i;
                return (
                  <div
                    key={opt.value}
                    role="option" aria-selected={isSelected}
                    onClick={() => select(opt.value)}
                    onMouseEnter={() => setHighlighted(i)}
                    className="flex items-center gap-2 mx-1 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-medium transition-colors duration-100"
                    style={{
                      color: isSelected ? '#a5b4fc' : isHovered ? '#e4e4e7' : '#a1a1aa',
                      background: isSelected ? 'rgba(99,102,241,0.12)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >
                    {opt.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opt.dot }} />}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && (
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-3.5 text-[11px] text-center" style={{ color: '#52525b' }}>No matches</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
export default function JobFilterBar({ search, status, company, companies, onChange, onClear, hasActiveFilters }) {
  const companyOptions = companies.map((c) => ({ value: c, label: c }));

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      <FilterSelect
        value={status}
        onChange={(v) => onChange('status', v)}
        options={STATUS_OPTIONS}
        placeholder="All Statuses"
        minWidth={140}
      />

      <FilterSelect
        value={company}
        onChange={(v) => onChange('company', v)}
        options={companyOptions}
        placeholder="All Companies"
        searchable
        minWidth={152}
      />

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClear}>Clear</Button>
      )}
    </div>
  );
}
