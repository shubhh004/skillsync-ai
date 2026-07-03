import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

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
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="modal-panel max-w-md">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-neutral-900">
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
            <Label htmlFor="im-difficulty">Difficulty</Label>
            <select id="im-difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className="select-base w-full">
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {isEdit && (
            <>
              <div>
                <Label htmlFor="im-status">Status</Label>
                <select id="im-status" name="status" value={form.status} onChange={handleChange} className="select-base w-full">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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
      </div>
    </div>
  );
}
