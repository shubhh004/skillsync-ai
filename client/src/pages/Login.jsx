import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { login } from '../services/authService';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your placement prep"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="password" required>Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <div className="mt-1.5 text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger-700 bg-danger-100 px-3 py-2 rounded-md">{error}</p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Logging in…' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
