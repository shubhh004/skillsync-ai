import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const selectClass = [
  'w-full h-10 px-3 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

const STATUSES  = ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Rejected', 'Accepted'];
const JOB_TYPES = ['Internship', 'Full Time', 'Part Time'];

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

export default function JobModal({ mode, initial, onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    setForm(toForm(initial));
    setError('');
  }, [initial, mode]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required.');
      return;
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-neutral-0 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">
            {mode === 'add' ? 'Add Application' : 'Edit Application'}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" required>Company</Label>
              <Input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Google" />
            </div>
            <div>
              <Label htmlFor="role" required>Role</Label>
              <Input id="role" name="role" value={form.role} onChange={handleChange} placeholder="SWE Intern" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className={selectClass}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <select id="jobType" name="jobType" value={form.jobType} onChange={handleChange} className={selectClass}>
                <option value="">Select type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore, India" />
            </div>
            <div>
              <Label htmlFor="salary">Salary / Stipend</Label>
              <Input id="salary" name="salary" value={form.salary} onChange={handleChange} placeholder="₹50,000/month" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-3 py-2.5 rounded-md text-sm resize-none border border-neutral-300 bg-neutral-100 placeholder:text-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-brand-500 focus:ring-brand-500 transition-colors duration-150"
            />
          </div>

          {error && (
            <p className="text-sm text-danger-700 bg-danger-100 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : mode === 'add' ? 'Add Application' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
