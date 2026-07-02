import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your placement prep today — it's free"
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label htmlFor="name" required>Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Priya Sharma"
            value={form.name}
            onChange={handleChange}
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
          />
        </div>

        <div>
          <Label htmlFor="college" required>College</Label>
          <Input
            id="college"
            name="college"
            placeholder="NIT Trichy / IIT Bombay / ..."
            value={form.college}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="password" required>Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" fullWidth>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
