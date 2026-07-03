import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-neutral-100 border-b border-neutral-200 sticky top-0 z-10">
        <Container>
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-brand-500">SkillSync</span>
              <span className="text-neutral-700"> AI</span>
            </Link>
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
