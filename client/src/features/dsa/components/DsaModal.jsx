import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import { backdropTransition, springModal, dropdownTransition } from '../../../motion/variants';

const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Binary Tree', 'Graph', 'Dynamic Programming', 'Binary Search',
  'Two Pointer', 'Heap', 'Design', 'Greedy', 'Sliding Window', 'Backtracking',
];

const DIFF_DOTS   = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const STATUS_DOTS = { Todo: '#6366f1', Attempted: '#f59e0b', Solved: '#22c55e' };

const EMPTY = {
  title: '', topic: 'Array', difficulty: 'Medium', status: 'Todo',
  platform: '', problemUrl: '', notes: '',
};

// ─── Portal-based select — escapes backdrop-filter stacking context ───────────
function ModalSelect({ value, onChange, options, searchable = false }) {
  const [open, setOpen]               = useState(false);
  const [coords, setCoords]           = useState(null);
  const [highlighted, setHighlighted] = useState(-1);
  const [query, setQuery]             = useState('');
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const searchRef  = useRef(null);

  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const openMenu = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;

    const PANEL_MAX     = 280;
    const OFFSET        = 6;
    const COLLISION_PAD = 16;
    const spaceBelow    = window.innerHeight - r.bottom - COLLISION_PAD;
    const spaceAbove    = r.top - COLLISION_PAD;
    const flipUp        = spaceBelow < PANEL_MAX && spaceAbove > spaceBelow;

    setCoords({
      left:      r.left,
      width:     r.width,
      maxHeight: Math.min(PANEL_MAX, flipUp ? spaceAbove : spaceBelow),
      top:    flipUp ? undefined : r.bottom + OFFSET,
      bottom: flipUp ? window.innerHeight - r.top + OFFSET : undefined,
    });
    setOpen(true);
    setHighlighted(-1);
    setQuery('');
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
        setOpen(false);
    };
    // Only dismiss on scroll events that originate outside the dropdown panel
    const dismissScroll = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const dismissResize = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('resize', dismissResize, { passive: true });
    window.addEventListener('scroll', dismissScroll, { passive: true, capture: true });
    if (searchable) setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('resize', dismissResize);
      window.removeEventListener('scroll', dismissScroll, { capture: true });
    };
  }, [open, searchable]);

  const select = (val) => { onChange(val); setOpen(false); };

  const handleKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); break;
      case 'Enter':     e.preventDefault(); if (highlighted >= 0 && filtered[highlighted]) select(filtered[highlighted].value); break;
      case 'Escape':    setOpen(false); break;
      default: break;
    }
  };

  const active = options.find((o) => o.value === value);

  const panel = coords && (
    <motion.div
      ref={panelRef}
      role="listbox"
      variants={dropdownTransition}
      initial="hidden"
      animate="show"
      style={{
        position:  'fixed',
        top:       coords.top,
        bottom:    coords.bottom,
        left:      coords.left,
        width:     Math.max(coords.width, 180),
        maxHeight: coords.maxHeight,
        zIndex:    99999,
        background:    'rgba(15,15,17,0.98)',
        backdropFilter:'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border:    '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.3)',
        overflow:  'hidden',
        display:   'flex',
        flexDirection: 'column',
      }}
    >
      {searchable && (
        <div className="px-2 pt-2 pb-1 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHighlighted(-1); }}
            placeholder="Search…"
            className="w-full bg-transparent outline-none text-[11px] px-2 py-1.5"
            style={{ color: '#d4d4d8' }}
          />
        </div>
      )}
      <div className="py-1 overflow-y-auto scrollbar-thin" style={{ flex: 1, minHeight: 0 }}>
        {filtered.map((opt, i) => {
          const isSelected = value === opt.value;
          const isHovered  = highlighted === i;
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={isSelected}
              onClick={() => select(opt.value)}
              onMouseEnter={() => setHighlighted(i)}
              className="flex items-center gap-2 mx-1 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-medium transition-colors duration-100"
              style={{
                color:      isSelected ? '#a5b4fc' : isHovered ? '#e4e4e7' : '#a1a1aa',
                background: isSelected ? 'rgba(99,102,241,0.12)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              {opt.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opt.dot }} />}
              <span className="flex-1">{opt.label}</span>
              {isSelected && (
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-3 text-[11px]" style={{ color: '#52525b' }}>No results</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl text-xs font-medium transition-all duration-150 focus:outline-none"
        style={{
          background:    'rgba(24,24,27,0.65)',
          border:        open ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.1)',
          backdropFilter:'blur(16px)',
          color:         '#d4d4d8',
          boxShadow:     open ? '0 0 0 2px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {active?.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active.dot }} />}
          <span>{active?.label ?? ''}</span>
        </span>
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#52525b' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && createPortal(panel, document.body)}
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function DsaModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initial ? {
      title:      initial.title      || '',
      topic:      initial.topic      || 'Array',
      difficulty: initial.difficulty || 'Medium',
      status:     initial.status     || 'Todo',
      platform:   initial.platform   || '',
      problemUrl: initial.problemUrl || '',
      notes:      initial.notes      || '',
    } : EMPTY);
    setError('');
  }, [initial, mode]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.topic.trim()) {
      setError('Title and topic are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save problem.');
    } finally {
      setSaving(false);
    }
  };

  const topicOptions  = TOPICS.map((t) => ({ value: t, label: t }));
  const diffOptions   = ['Easy', 'Medium', 'Hard'].map((d) => ({ value: d, label: d, dot: DIFF_DOTS[d] }));
  const statusOptions = ['Todo', 'Attempted', 'Solved'].map((s) => ({ value: s, label: s, dot: STATUS_DOTS[s] }));

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
        variants={backdropTransition}
        initial="hidden"
        animate="show"
        exit="exit"
      />
      <motion.div
        className="modal-panel max-w-lg"
        variants={springModal}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: '#e4e4e7' }}>
            {mode === 'add' ? 'Add Problem' : 'Edit Problem'}
          </h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <Label htmlFor="title" required>Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Two Sum" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Topic</Label>
              <ModalSelect
                value={form.topic}
                onChange={(v) => setField('topic', v)}
                options={topicOptions}
                searchable
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <ModalSelect
                value={form.difficulty}
                onChange={(v) => setField('difficulty', v)}
                options={diffOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <ModalSelect
                value={form.status}
                onChange={(v) => setField('status', v)}
                options={statusOptions}
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input id="platform" name="platform" value={form.platform} onChange={handleChange} placeholder="LeetCode" />
            </div>
          </div>

          <div>
            <Label htmlFor="problemUrl">Problem URL</Label>
            <Input id="problemUrl" name="problemUrl" value={form.problemUrl} onChange={handleChange} placeholder="https://leetcode.com/problems/..." />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Key insight or approach…"
              rows={3}
              className="textarea-base"
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={saving}>
              {mode === 'add' ? 'Add Problem' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
