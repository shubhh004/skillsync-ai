import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" fullWidth>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        <Link to="/login" className="text-brand-400 font-medium hover:underline">
          ← Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
