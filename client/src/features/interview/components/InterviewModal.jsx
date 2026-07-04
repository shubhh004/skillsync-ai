import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import { backdropTransition, springModal, dropdownTransition } from '../../../motion/variants';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const STATUSES     = ['Scheduled', 'In Progress', 'Completed'];

const DIFF_DOTS   = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const STATUS_DOTS = { Scheduled: '#6366f1', 'In Progress': '#f59e0b', Completed: '#22c55e' };

const EMPTY = { role: '', company: '', difficulty: 'Medium', status: 'Scheduled', score: 0, feedback: '' };

function toForm(interview) {
  if (!interview) return EMPTY;
  return {
    role:       interview.role       || '',
    company:    interview.company    || '',
    difficulty: interview.difficulty || 'Medium',
    status:     interview.status     || 'Scheduled',
    score:      interview.score      ?? 0,
    feedback:   interview.feedback   || '',
  };
}

// ─── Portal-based select — escapes backdrop-filter stacking context ───────────
// backdrop-filter on .modal-panel creates a new stacking context that breaks
// position:fixed children. createPortal renders to document.body directly,
// fully outside the modal's DOM subtree, so z-index and positioning are clean.
function ModalSelect({ value, onChange, options }) {
  const [open, setOpen]               = useState(false);
  const [coords, setCoords]           = useState(null);
  const [highlighted, setHighlighted] = useState(-1);
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);

  const openMenu = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;

    const PANEL_MAX    = 280;
    const OFFSET       = 6;
    const COLLISION_PAD = 16;
    const spaceBelow   = window.innerHeight - r.bottom - COLLISION_PAD;
    const spaceAbove   = r.top - COLLISION_PAD;
    const flipUp       = spaceBelow < PANEL_MAX && spaceAbove > spaceBelow;

    setCoords({
      left:      r.left,
      width:     r.width,
      maxHeight: Math.min(PANEL_MAX, flipUp ? spaceAbove : spaceBelow),
      // exclusive: one will be set, the other undefined
      top:    flipUp ? undefined : r.bottom + OFFSET,
      bottom: flipUp ? window.innerHeight - r.top + OFFSET : undefined,
    });
    setOpen(true);
    setHighlighted(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', close);
    // Also close on scroll/resize so the panel doesn't drift
    const dismiss = () => setOpen(false);
    window.addEventListener('resize', dismiss, { passive: true });
    window.addEventListener('scroll', dismiss, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('scroll', dismiss, { capture: true });
    };
  }, [open]);

  const select = (val) => { onChange(val); setOpen(false); };

  const handleKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlighted((h) => Math.min(h + 1, options.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); break;
      case 'Enter':     e.preventDefault(); if (highlighted >= 0 && options[highlighted]) select(options[highlighted].value); break;
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
      }}
    >
      <div className="py-1 overflow-y-auto" style={{ maxHeight: coords.maxHeight }}>
        {options.map((opt, i) => {
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
export default function InterviewModal({ mode, initial, onClose, onSave }) {
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => { setForm(toForm(initial)); setError(''); }, [initial, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'score' ? Number(value) : value }));
  };
  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save interview.');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === 'edit';

  const diffOptions   = DIFFICULTIES.map((d) => ({ value: d, label: d, dot: DIFF_DOTS[d] }));
  const statusOptions = STATUSES.map((s) => ({ value: s, label: s, dot: STATUS_DOTS[s] }));

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
        className="modal-panel max-w-md"
        variants={springModal}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: '#e4e4e7' }}>
            {isEdit ? 'Edit Interview' : 'Create Interview'}
          </h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <Label htmlFor="im-role">Role</Label>
            <Input id="im-role" name="role" value={form.role} onChange={handleChange} placeholder="Software Engineer" />
          </div>

          <div>
            <Label htmlFor="im-company">Company</Label>
            <Input id="im-company" name="company" value={form.company} onChange={handleChange} placeholder="Google" />
          </div>

          <div>
            <Label>Difficulty</Label>
            <ModalSelect
              value={form.difficulty}
              onChange={(v) => setField('difficulty', v)}
              options={diffOptions}
            />
          </div>

          {isEdit && (
            <>
              <div>
                <Label>Status</Label>
                <ModalSelect
                  value={form.status}
                  onChange={(v) => setField('status', v)}
                  options={statusOptions}
                />
              </div>

              <div>
                <Label htmlFor="im-score">Score (0–100)</Label>
                <Input id="im-score" name="score" type="number" min="0" max="100" value={form.score} onChange={handleChange} placeholder="0" />
              </div>

              <div>
                <Label htmlFor="im-feedback">Feedback</Label>
                <textarea
                  id="im-feedback"
                  name="feedback"
                  value={form.feedback}
                  onChange={handleChange}
                  placeholder="Notes or feedback from the interview..."
                  rows={3}
                  className="textarea-base"
                />
              </div>
            </>
          )}

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={saving}>
              {isEdit ? 'Save Changes' : 'Create Interview'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
