import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { register } from '../services/authService';
import { useUser } from '../context/UserContext';

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your placement prep today — it's free">
      <form className="space-y-4" onSubmit={handleSubmit}>

        <div>
          <Label htmlFor="name" required>Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Priya Sharma"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="college">College</Label>
          <Input
            id="college"
            name="college"
            placeholder="NIT Trichy / IIT Bombay / …"
            value={form.college}
            onChange={handleChange}
            autoComplete="organization"
          />
        </div>

        <div>
          <Label htmlFor="password" required>Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
              style={{ color: '#52525b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
              onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <p className="mt-1.5 text-[11px]" style={{ color: '#52525b' }}>
            Must be at least 8 characters.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="signup-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm px-3 py-2.5 rounded-xl"
              style={{
                color: '#f87171',
                background: 'rgba(127,29,29,0.35)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="pt-1">
          <Button type="submit" fullWidth isLoading={loading} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
          <p className="mt-3 text-center text-[11px]" style={{ color: '#52525b' }}>
            By signing up you agree to our{' '}
            <span style={{ color: '#71717a' }}>Terms of Service</span> and{' '}
            <span style={{ color: '#71717a' }}>Privacy Policy</span>.
          </p>
        </div>
      </form>

      <p className="mt-5 text-center text-sm" style={{ color: '#71717a' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium transition-colors duration-150"
          style={{ color: '#818cf8' }}
          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
          onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
