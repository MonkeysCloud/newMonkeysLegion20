import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * PATCH /api/auth/settings — update user profile settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ml_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ errors: ['Not authenticated'] }, { status: 401 });
    }

    const body = await request.json();

    // Save settings
    const res = await fetch(`${DRUPAL_BASE}/api/me/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // If password was changed, re-authenticate to get a new token
    if (body.newPassword) {
      const CLIENT_ID = process.env.DRUPAL_CLIENT_ID || 'monkeyslegion-nextjs';
      const CLIENT_SECRET = process.env.DRUPAL_CLIENT_SECRET || '';

      // Get the user's email from /api/me before the token might be invalidated
      const meRes = await fetch(`${DRUPAL_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (meRes.ok) {
        const user = await meRes.json();
        const username = user.mail;

        // Re-authenticate with the new password
        const tokenRes = await fetch(`${DRUPAL_BASE}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username,
            password: body.newPassword,
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const response = NextResponse.json(data);

          response.cookies.set('ml_auth_token', tokenData.access_token, {
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
              maxAge: 60 * 60 * 24 * 30,
            });
          }

          return response;
        }
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[settings] Error:', err);
    return NextResponse.json({ errors: ['Internal server error.'] }, { status: 500 });
  }
}
