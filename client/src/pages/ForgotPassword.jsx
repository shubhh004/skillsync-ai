import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <AuthLayout
      title={sent ? 'Check your inbox' : 'Reset your password'}
      subtitle={sent ? undefined : "Enter your email and we'll send you a reset link"}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center py-2"
          >
            {/* Email icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                boxShadow: '0 0 28px rgba(34,197,94,0.12)',
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>

            <p className="text-sm mb-1" style={{ color: '#a1a1aa' }}>
              We've sent a reset link to
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: '#e4e4e7' }}>
              {email}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>
              Didn't receive it? Check your spam folder, or{' '}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="transition-colors duration-150"
                style={{ color: '#818cf8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
              >
                try again
              </button>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <Button type="submit" fullWidth disabled={!email}>
              Send Reset Link
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-sm" style={{ color: '#71717a' }}>
        <Link
          to="/login"
          className="transition-colors duration-150"
          style={{ color: '#818cf8' }}
          onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
          onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
        >
          ← Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
