'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', mail: '', pass: '', confirm: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const errs: string[] = [];
    if (form.name.length < 2) errs.push('Display name must be at least 2 characters.');
    if (!form.mail.includes('@')) errs.push('Enter a valid email.');
    if (form.pass.length < 8) errs.push('Password must be at least 8 characters.');
    if (form.pass !== form.confirm) errs.push('Passwords do not match.');
    if (errs.length) { setErrors(errs); return; }

    setLoading(true);
    const result = await register(form.name, form.mail, form.pass);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setErrors(result.errors || ['Registration failed.']);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <Link href="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/monkeyslegion-logo.svg" alt="MonkeysLegion" style={{ height: 48 }} />
        </Link>
        <h1 className="text-gradient">Create Account</h1>
        <p className="auth-subtitle">Join the MonkeysLegion marketplace and share your packages with the world.</p>

        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        {success && (
          <div className="form-success">✅ Account created! Redirecting to login...</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-mail">Email</label>
            <input id="reg-mail" className="form-input" type="email" placeholder="you@example.com" value={form.mail} onChange={(e) => setForm({ ...form, mail: e.target.value })} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Display Name</label>
            <input id="reg-name" className="form-input" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-pass">Password</label>
            <input id="reg-pass" className="form-input" type="password" placeholder="At least 8 characters" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <input id="reg-confirm" className="form-input" type="password" placeholder="Repeat your password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
