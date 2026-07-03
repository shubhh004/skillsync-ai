import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import { isAuthenticated } from '../services/authService';

export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <p className="text-8xl font-bold text-brand-100 select-none">404</p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">Page not found</h1>
          <p className="mt-3 text-neutral-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8">
            <Button onClick={handleBack}>Back to Home</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
