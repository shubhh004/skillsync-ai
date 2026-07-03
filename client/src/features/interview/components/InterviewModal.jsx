import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const SELECT_CLASS = [
  'w-full h-10 px-3 rounded-md text-sm border border-neutral-300 bg-white',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

const TEXTAREA_CLASS = 'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const STATUSES     = ['Scheduled', 'In Progress', 'Completed'];

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

export default function InterviewModal({ mode, initial, onClose, onSave }) {
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    setForm(toForm(initial));
    setError('');
  }, [initial, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'score' ? Number(value) : value }));
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">
            {isEdit ? 'Edit Interview' : 'Create Interview'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <Label htmlFor="im-role">Role</Label>
            <Input
              id="im-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <Label htmlFor="im-company">Company</Label>
            <Input
              id="im-company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Google"
            />
          </div>
          <div>
            <Label htmlFor="im-difficulty">Difficulty</Label>
            <select
              id="im-difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className={SELECT_CLASS}
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {isEdit && (
            <>
              <div>
                <Label htmlFor="im-status">Status</Label>
                <select
                  id="im-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={SELECT_CLASS}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="im-score">Score</Label>
                <Input
                  id="im-score"
                  name="score"
                  type="number"
                  min="0"
                  max="100"
                  value={form.score}
                  onChange={handleChange}
                  placeholder="0"
                />
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
                  className={TEXTAREA_CLASS}
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-danger-700 bg-danger-100 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
