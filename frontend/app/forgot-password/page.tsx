'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!email || !email.includes('@')) {
      setErrors(['Please enter a valid email address.']);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ['Something went wrong.']);
      } else {
        setSuccess(true);
      }
    } catch {
      setErrors(['An unexpected error occurred.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <Link href="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/monkeyslegion-logo.svg" alt="MonkeysLegion" style={{ height: 48 }} />
        </Link>
        <h1 className="text-gradient">Reset Password</h1>
        <p className="auth-subtitle">Enter your email and we&apos;ll send you instructions to reset your password.</p>

        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        {success ? (
          <div className="form-success">
            ✅ If an account with that email exists, we&apos;ve sent password reset instructions. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link href="/login">← Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
