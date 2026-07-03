import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Binary Tree', 'Graph', 'Dynamic Programming', 'Binary Search',
  'Two Pointer', 'Heap', 'Design', 'Greedy', 'Sliding Window', 'Backtracking',
];

const EMPTY = {
  title: '', topic: 'Array', difficulty: 'Medium', status: 'Todo',
  platform: '', problemUrl: '', notes: '',
};

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

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="modal-panel max-w-lg">
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-base font-semibold text-neutral-900">
            {mode === 'add' ? 'Add Problem' : 'Edit Problem'}
          </h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <Label htmlFor="title" required>Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Two Sum" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic" required>Topic</Label>
              <select id="topic" name="topic" value={form.topic} onChange={handleChange} className="select-base w-full">
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className="select-base w-full">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="select-base w-full">
                <option value="Todo">Todo</option>
                <option value="Attempted">Attempted</option>
                <option value="Solved">Solved</option>
              </select>
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
      </div>
    </div>
  );
}
