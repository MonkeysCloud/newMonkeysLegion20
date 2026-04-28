/**
 * Auth helper — handles registration, login, logout, and user state.
 * Uses Next.js API routes as proxy to Drupal backend for token security.
 */

export interface AuthUser {
  uid: number;
  uuid?: string;
  name: string;
  mail: string;
  slug?: string;
  bio?: string;
  website?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  roles?: string[];
  created?: string;
  profileUrl?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface AuthError {
  errors: string[];
}

const API_BASE = '';

/* ============================================================================
   Registration
   ============================================================================ */

export async function registerUser(
  name: string,
  mail: string,
  pass: string,
): Promise<{ success: boolean; user?: AuthUser; errors?: string[] }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mail, pass }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, errors: data.errors || ['Registration failed.'] };
  }

  return { success: true, user: data.user };
}

/* ============================================================================
   Login
   ============================================================================ */

export async function loginUser(
  username: string,
  password: string,
): Promise<{ success: boolean; user?: AuthUser; errors?: string[] }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, errors: data.errors || ['Login failed.'] };
  }

  return { success: true, user: data.user };
}

/* ============================================================================
   Logout
   ============================================================================ */

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
}

/* ============================================================================
   Get current user
   ============================================================================ */

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Skip if no session cookie exists (avoids 401 noise in console after logout)
    if (typeof document !== 'undefined' && !document.cookie.includes('SESS')) {
      return null;
    }
    const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}
