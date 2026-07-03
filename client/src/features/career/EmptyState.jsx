const CHIPS = [
  { label: 'Improve my Resume',   icon: '📄' },
  { label: 'Career Roadmap',      icon: '🗺️' },
  { label: 'DSA Roadmap',         icon: '🧮' },
  { label: 'HR Interview Tips',   icon: '🎯' },
  { label: 'Skills to Build',     icon: '🛠️' },
  { label: 'Resume Review',       icon: '🔍' },
  { label: 'Mock Interview',      icon: '🎤' },
  { label: 'Product Companies',   icon: '🏢' },
  { label: 'Service Companies',   icon: '💼' },
  { label: 'Placement Plan',      icon: '✨' },
];

export default function EmptyState({ onChipClick }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none">
      {/* Animated icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 animate-pop-in"
        style={{
          background: 'linear-gradient(135deg, #e0eaff 0%, #c2d4ff 100%)',
        }}
      >
        <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      </div>

      <h2
        className="text-2xl font-bold text-neutral-900 mb-2 animate-fade-slide-up"
        style={{ animationDelay: '60ms' }}
      >
        👋 Hi, I'm your AI Career Coach
      </h2>
      <p
        className="text-sm text-neutral-500 max-w-md mb-8 leading-relaxed animate-fade-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        Ask anything about placements, resumes, interviews, skills, career goals or next steps.
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl">
        {CHIPS.map(({ label, icon }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onChipClick(label)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-full border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 hover:border-brand-400 hover:shadow-sm active:scale-95 transition-all duration-150 animate-fade-slide-up"
            style={{ animationDelay: `${140 + i * 35}ms` }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
