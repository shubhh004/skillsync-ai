import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center px-4 py-12">

      {/* Centered auth panel */}
      <div className="w-full max-w-md animate-fade-slide-up">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="group inline-flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
              <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '1.125rem', height: '1.125rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-neutral-900">SkillSync</span>
              <span className="text-gradient-brand"> AI</span>
            </span>
          </Link>

          {title && (
            <h1 className="mt-8 text-h3">{title}</h1>
          )}
          {subtitle && (
            <p className="mt-1.5 text-body text-neutral-500">{subtitle}</p>
          )}
        </div>

        {/* Glass card */}
        <div className="glass-surface rounded-3xl p-8 shadow-elevated">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} SkillSync AI
        </p>
      </div>
    </div>
  );
}
