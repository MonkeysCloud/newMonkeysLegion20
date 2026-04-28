import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
const CLIENT_ID = process.env.DRUPAL_CLIENT_ID || 'monkeyslegion-nextjs';
const CLIENT_SECRET = process.env.DRUPAL_CLIENT_SECRET || '';

/**
 * GET /api/auth/me
 * Returns current user info by reading the auth cookie and querying Drupal.
 * Automatically refreshes the token if expired and a refresh token is available.
 */
export async function GET(request: NextRequest) {
  let token = request.cookies.get('ml_auth_token')?.value;
  const refreshToken = request.cookies.get('ml_refresh_token')?.value;

  if (!token && !refreshToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Try with current access token
  if (token) {
    try {
      const res = await fetch(`${DRUPAL_BASE}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const user = await res.json();
        return NextResponse.json({ user });
      }

      // If not 401, it's a different error
      if (res.status !== 401) {
        return NextResponse.json({ user: null }, { status: res.status });
      }
    } catch {
      // Fall through to refresh
    }
  }

  // Access token failed or missing — try refreshing
  if (refreshToken) {
    try {
      const tokenRes = await fetch(`${DRUPAL_BASE}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const newAccessToken = tokenData.access_token;

        // Fetch user with the new token
        const meRes = await fetch(`${DRUPAL_BASE}/api/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            Accept: 'application/json',
          },
        });

        if (meRes.ok) {
          const user = await meRes.json();
          const response = NextResponse.json({ user });

          // Update cookies with new tokens
          response.cookies.set('ml_auth_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: tokenData.expires_in || 86400,
          });

          if (tokenData.refresh_token) {
            response.cookies.set('ml_refresh_token', tokenData.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
          }

          return response;
        }
      }
    } catch (err) {
      console.error('[me] Token refresh failed:', err);
    }
  }

  // Both tokens failed — clear cookies and return 401
  const response = NextResponse.json({ user: null }, { status: 401 });
  response.cookies.delete('ml_auth_token');
  response.cookies.delete('ml_refresh_token');
  return response;
}
