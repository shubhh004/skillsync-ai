import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Glass nav header */}
      <header className="sticky top-0 z-30 glass-surface">
        <Container>
          <div className="h-16 flex items-center justify-between">

            {/* Brand */}
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '0.875rem', height: '0.875rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight">
                <span className="text-neutral-900">SkillSync</span>
                <span className="text-gradient-brand"> AI</span>
              </span>
            </Link>

            {/* Nav actions */}
            <nav className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-neutral-200 py-6">
        <Container>
          <p className="text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} SkillSync AI. Built for placement season.
          </p>
        </Container>
      </footer>
    </div>
  );
}
