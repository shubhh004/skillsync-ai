import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-xl font-bold tracking-tight">
            <span className="text-brand-500">SkillSync</span>
            <span className="text-neutral-700"> AI</span>
          </Link>
          {title && (
            <h1 className="mt-6 text-2xl font-semibold text-neutral-900">{title}</h1>
          )}
          {subtitle && (
            <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        <Card padding={false} className="p-8">
          {children}
        </Card>
      </div>
    </div>
  );
}
