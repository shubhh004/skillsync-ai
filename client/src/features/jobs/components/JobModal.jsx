import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

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
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="modal-panel max-w-lg">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-neutral-900">
            {mode === 'add' ? 'Add Application' : 'Edit Application'}
          </h2>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
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
              <select id="status" name="status" value={form.status} onChange={handleChange} className="select-base w-full">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <select id="jobType" name="jobType" value={form.jobType} onChange={handleChange} className="select-base w-full">
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
      </div>
    </div>
  );
}
