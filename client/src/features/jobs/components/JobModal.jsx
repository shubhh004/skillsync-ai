import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import { backdropTransition, springModal, dropdownTransition } from '../../../motion/variants';

const STATUSES  = ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Rejected', 'Accepted'];
const JOB_TYPES = ['Internship', 'Full Time', 'Part Time'];

const STATUS_DOTS = {
  Applied: '#6366f1', OA: '#818cf8', Interview: '#f59e0b',
  HR: '#fbbf24', Offer: '#22c55e', Accepted: '#4ade80', Rejected: '#ef4444',
};

const EMPTY = {
  company: '', role: '', status: 'Applied', location: '',
  jobType: '', salary: '', applicationLink: '', notes: '',
  appliedDate: new Date().toISOString().slice(0, 10),
};

function toForm(job) {
  if (!job) return EMPTY;
  return {
    company:         job.company         || '',
    role:            job.role            || '',
    status:          job.status          || 'Applied',
    location:        job.location        || '',
    jobType:         job.jobType         || '',
    salary:          job.salary          || '',
    applicationLink: job.applicationLink || '',
    notes:           job.notes           || '',
    appliedDate:     job.appliedDate
      ? new Date(job.appliedDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}

// ─── Portal-based select — escapes backdrop-filter stacking context ───────────
function ModalSelect({ value, onChange, options, placeholder = '' }) {
  const [open, setOpen]               = useState(false);
  const [coords, setCoords]           = useState(null);
  const [highlighted, setHighlighted] = useState(-1);
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);

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
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', close);
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
          color:         value ? '#d4d4d8' : '#52525b',
          boxShadow:     open ? '0 0 0 2px rgba(99,102,241,0.12)' : 'none',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {active?.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active.dot }} />}
          <span>{active?.label ?? placeholder}</span>
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
export default function JobModal({ mode, initial, onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => { setForm(toForm(initial)); setError(''); }, [initial, mode]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) { setError('Company and role are required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save application.');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions  = STATUSES.map((s) => ({ value: s, label: s, dot: STATUS_DOTS[s] }));
  const jobTypeOptions = [{ value: '', label: 'Select type' }, ...JOB_TYPES.map((t) => ({ value: t, label: t }))];

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
            {mode === 'add' ? 'Add Application' : 'Edit Application'}
          </h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" required>Company</Label>
              <Input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Google" />
            </div>
            <div>
              <Label htmlFor="role" required>Role</Label>
              <Input id="role" name="role" value={form.role} onChange={handleChange} placeholder="SWE Intern" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <ModalSelect
                value={form.status}
                onChange={(v) => setField('status', v)}
                options={statusOptions}
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <ModalSelect
                value={form.jobType}
                onChange={(v) => setField('jobType', v)}
                options={jobTypeOptions}
                placeholder="Select type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore, India" />
            </div>
            <div>
              <Label htmlFor="salary">Salary / Stipend</Label>
              <Input id="salary" name="salary" value={form.salary} onChange={handleChange} placeholder="₹50,000/month" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input id="appliedDate" name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="applicationLink">Application Link</Label>
              <Input id="applicationLink" name="applicationLink" value={form.applicationLink} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Recruiter name, key contacts, interview tips…"
              rows={3}
              className="textarea-base"
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={saving}>
              {mode === 'add' ? 'Add Application' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
