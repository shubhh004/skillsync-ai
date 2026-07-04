import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import UserAvatar from '../components/ui/UserAvatar';
import { useUser } from '../context/UserContext';
import { updateProfile } from '../services/profileService';

// Fields that count toward completion (excluding name/email which are always set)
const COMPLETION_FIELDS = [
  'phone', 'city', 'state',
  'college', 'degree', 'branch', 'graduationYear',
  'currentStatus', 'dreamRole',
  'github', 'linkedin',
  'bio', 'skills',
];

function getCompletionPct(form) {
  const filled = COMPLETION_FIELDS.filter((f) =>
    f === 'skills' ? form.skills.trim().length > 0 : form[f]?.trim?.().length > 0
  ).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

function toForm(user) {
  return {
    name:           user?.name           || '',
    avatar:         user?.avatar         || '',
    phone:          user?.phone          || '',
    city:           user?.city           || '',
    state:          user?.state          || '',
    college:        user?.college        || '',
    university:     user?.university     || '',
    degree:         user?.degree         || '',
    branch:         user?.branch         || '',
    graduationYear: user?.graduationYear || '',
    currentStatus:  user?.currentStatus  || '',
    dreamRole:      user?.dreamRole      || '',
    github:         user?.github         || '',
    linkedin:       user?.linkedin       || '',
    portfolio:      user?.portfolio      || '',
    leetcode:       user?.leetcode       || '',
    codeforces:     user?.codeforces     || '',
    hackerrank:     user?.hackerrank     || '',
    bio:            user?.bio            || '',
    skills:         user?.skills?.join(', ') || '',
  };
}

function SectionCard({ title, children }) {
  return (
    <Card>
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Field({ label, required, htmlFor, children }) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {children}
    </div>
  );
}

function Textarea({ id, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={[
        'w-full px-3 py-2.5 rounded-xl text-sm resize-none',
        'bg-neutral-0 border border-neutral-300',
        'placeholder:text-neutral-400 text-neutral-800',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-brand-500 focus:ring-brand-500',
      ].join(' ')}
    />
  );
}

function TwoCol({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export default function Profile() {
  const { user, loading: userLoading, setUser } = useUser();
  const [form, setForm] = useState(toForm(null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) setForm(toForm(user));
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        avatar: form.avatar || undefined,
      };
      const updated = await updateProfile(payload);
      setUser(updated);
      setSuccess('Profile saved successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <DashboardLayout title="Profile">
        <p className="text-sm text-neutral-500">Loading profile…</p>
      </DashboardLayout>
    );
  }

  const pct = getCompletionPct(form);

  return (
    <DashboardLayout title="Profile">
      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl space-y-6">

          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Your Profile</h2>
            <p className="mt-0.5 text-sm text-neutral-500">Keep your placement profile up to date.</p>
          </div>

          {/* Profile Header Card */}
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <UserAvatar src={form.avatar} name={form.name} size="lg" />
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-neutral-900">{form.name || user?.name}</p>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="mt-1 text-xs text-neutral-400">
                    Paste an image URL or keep the default avatar.
                  </p>
                </div>

                {/* Completion bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-500">Profile completion</span>
                    <span className="text-xs font-semibold text-brand-400">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <SectionCard title="Personal Information">
            <TwoCol>
              <Field label="Full Name" required htmlFor="name">
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </Field>
            </TwoCol>
            <TwoCol>
              <Field label="City" htmlFor="city">
                <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
              </Field>
              <Field label="State" htmlFor="state">
                <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
              </Field>
            </TwoCol>
            <Field label="Email">
              <Input value={user?.email || ''} disabled />
            </Field>
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education">
            <TwoCol>
              <Field label="College" htmlFor="college">
                <Input id="college" name="college" value={form.college} onChange={handleChange} placeholder="NIT Trichy" />
              </Field>
              <Field label="University" htmlFor="university">
                <Input id="university" name="university" value={form.university} onChange={handleChange} placeholder="Anna University" />
              </Field>
            </TwoCol>
            <TwoCol>
              <Field label="Degree" htmlFor="degree">
                <Input id="degree" name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech" />
              </Field>
              <Field label="Branch" htmlFor="branch">
                <Input id="branch" name="branch" value={form.branch} onChange={handleChange} placeholder="Computer Science" />
              </Field>
            </TwoCol>
            <Field label="Graduation Year" htmlFor="graduationYear">
              <Input id="graduationYear" name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="2025" />
            </Field>
          </SectionCard>

          {/* Career */}
          <SectionCard title="Career">
            <TwoCol>
              <Field label="Current Status" htmlFor="currentStatus">
                <Input id="currentStatus" name="currentStatus" value={form.currentStatus} onChange={handleChange} placeholder="Final Year Student" />
              </Field>
              <Field label="Dream Role" htmlFor="dreamRole">
                <Input id="dreamRole" name="dreamRole" value={form.dreamRole} onChange={handleChange} placeholder="SDE at a FAANG company" />
              </Field>
            </TwoCol>
          </SectionCard>

          {/* Social Links */}
          <SectionCard title="Social Links">
            <TwoCol>
              <Field label="GitHub" htmlFor="github">
                <Input id="github" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/username" />
              </Field>
              <Field label="LinkedIn" htmlFor="linkedin">
                <Input id="linkedin" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
              </Field>
            </TwoCol>
            <TwoCol>
              <Field label="Portfolio" htmlFor="portfolio">
                <Input id="portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://yoursite.com" />
              </Field>
              <Field label="LeetCode" htmlFor="leetcode">
                <Input id="leetcode" name="leetcode" value={form.leetcode} onChange={handleChange} placeholder="https://leetcode.com/username" />
              </Field>
            </TwoCol>
            <TwoCol>
              <Field label="Codeforces" htmlFor="codeforces">
                <Input id="codeforces" name="codeforces" value={form.codeforces} onChange={handleChange} placeholder="https://codeforces.com/profile/handle" />
              </Field>
              <Field label="HackerRank" htmlFor="hackerrank">
                <Input id="hackerrank" name="hackerrank" value={form.hackerrank} onChange={handleChange} placeholder="https://hackerrank.com/username" />
              </Field>
            </TwoCol>
          </SectionCard>

          {/* About */}
          <SectionCard title="About">
            <Field label="Bio" htmlFor="bio">
              <Textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell recruiters and peers a little about yourself…"
                rows={4}
              />
            </Field>
          </SectionCard>

          {/* Skills */}
          <SectionCard title="Skills">
            <Field label="Skills" htmlFor="skills">
              <Input
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python, Data Structures…"
              />
              <p className="mt-1.5 text-xs text-neutral-400">Separate skills with commas.</p>
            </Field>
            {form.skills.trim() && (
              <div className="flex flex-wrap gap-2 mt-1">
                {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                  <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Footer actions */}
          {error && (
            <p className="text-sm text-danger-700 bg-danger-100 px-4 py-3 rounded-xl">{error}</p>
          )}
          {success && (
            <p className="text-sm text-success-700 bg-success-100 px-4 py-3 rounded-xl">{success}</p>
          )}

          <div className="flex justify-end pb-6">
            <Button type="submit" isLoading={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
}
