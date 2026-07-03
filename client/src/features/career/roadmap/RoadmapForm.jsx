import { useState } from 'react';

const TIMELINES = ['1 month', '2 months', '3 months', '4 months', '6 months'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const QUICK_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Capgemini', 'Accenture', 'Zoho'];

export default function RoadmapForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    targetCompany: '',
    targetRole:    '',
    timeline:      '3 months',
    skillLevel:    'Intermediate',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.targetRole.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pop-in"
            style={{ background: 'linear-gradient(135deg, #e0eaff 0%, #c2d4ff 100%)' }}>
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Generate Your Placement Roadmap</h2>
          <p className="text-sm text-neutral-500">I'll use your resume, DSA progress, interviews and job data to build a personalized plan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Company */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Target Company <span className="font-normal text-neutral-400">(Optional)</span></label>
            <input
              type="text"
              value={form.targetCompany}
              onChange={e => set('targetCompany', e.target.value)}
              placeholder="e.g. Google, TCS, Deloitte… or leave blank"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            {/* Quick-pick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_COMPANIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('targetCompany', c)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    form.targetCompany === c
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Target Role *</label>
            <input
              type="text"
              value={form.targetRole}
              onChange={e => set('targetRole', e.target.value)}
              placeholder="e.g. Software Engineer, Backend Developer..."
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Timeline + Skill Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Timeline</label>
              <select
                value={form.timeline}
                onChange={e => set('timeline', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {TIMELINES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Skill Level</label>
              <select
                value={form.skillLevel}
                onChange={e => set('skillLevel', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {SKILL_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.targetRole.trim()}
            className={[
              'w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              loading || !form.targetRole.trim()
                ? 'bg-neutral-300 cursor-not-allowed'
                : 'hover:shadow-md active:scale-[0.99]',
            ].join(' ')}
            style={
              loading || !form.targetRole.trim()
                ? undefined
                : { background: 'linear-gradient(135deg, #3d6ef6 0%, #2240d8 100%)' }
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating your roadmap…
              </span>
            ) : (
              '✨ Generate Roadmap'
            )}
          </button>
          {loading && (
            <p className="text-center text-xs text-neutral-400 animate-pulse">
              Analyzing your profile and building a personalized plan… this may take 15–30 seconds.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
