'use client';

import { useAuth } from '../auth/AuthProvider';

/**
 * Shows an "Edit Profile" button only when the logged-in user
 * is viewing their own profile.
 */
export default function EditProfileButton({ profileUid }: { profileUid: number }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) return null;
  if (user.uid !== profileUid) return null;

  return (
    <a
      href="/dashboard/settings"
      className="edit-profile-btn"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 16px',
        fontSize: '0.8rem', fontWeight: 600,
        color: 'hsl(250, 95%, 80%)',
        background: 'hsla(250, 85%, 60%, 0.1)',
        border: '1px solid hsla(250, 85%, 60%, 0.3)',
        borderRadius: 'var(--radius-full)',
        textDecoration: 'none',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ color: 'currentColor' }}>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Edit Profile
    </a>
  );
}
