import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clears the auth cookies.
 */
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out.' });

  response.cookies.set('ml_auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('ml_refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
