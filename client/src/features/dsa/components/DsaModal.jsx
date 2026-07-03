import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Binary Tree', 'Graph', 'Dynamic Programming', 'Binary Search',
  'Two Pointer', 'Heap', 'Design', 'Greedy', 'Sliding Window', 'Backtracking',
];

const selectClass = [
  'w-full h-10 px-3 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-neutral-0 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">
            {mode === 'add' ? 'Add Problem' : 'Edit Problem'}
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <Label htmlFor="title" required>Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Two Sum" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic" required>Topic</Label>
              <select id="topic" name="topic" value={form.topic} onChange={handleChange} className={selectClass}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className={selectClass}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className={selectClass}>
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
              className="w-full px-3 py-2.5 rounded-md text-sm resize-none border border-neutral-300 bg-neutral-100 placeholder:text-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-brand-500 focus:ring-brand-500 transition-colors duration-150"
            />
          </div>

          {error && (
            <p className="text-sm text-danger-700 bg-danger-100 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : mode === 'add' ? 'Add Problem' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
