'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!form.email || !form.password) { setErrors(['All fields are required.']); return; }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrors(result.errors || ['Invalid credentials.']);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <Link href="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/monkeyslegion-logo.svg" alt="MonkeysLegion" style={{ height: 48 }} />
        </Link>
        <h1 className="text-gradient">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to manage your packages and explore the marketplace.</p>

        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input id="login-email" className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">Password</label>
            <input id="login-pass" className="form-input" type="password" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
            <div style={{ textAlign: 'right', marginTop: 'var(--space-2)' }}>
              <Link href="/forgot-password" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-light)' }}>Forgot password?</Link>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
