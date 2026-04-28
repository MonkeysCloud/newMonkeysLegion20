import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
const CLIENT_ID = process.env.DRUPAL_CLIENT_ID || 'monkeyslegion-nextjs';
const CLIENT_SECRET = process.env.DRUPAL_CLIENT_SECRET || '';

/**
 * POST /api/auth/login
 * Exchanges credentials for an OAuth token via Simple OAuth, then
 * stores the token in an httpOnly cookie and returns user info.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { errors: ['Username and password are required.'] },
        { status: 422 },
      );
    }

    // 1. Get OAuth token from Drupal
    const tokenRes = await fetch(`${DRUPAL_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username,
        password,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('[login] OAuth error:', err);
      return NextResponse.json(
        { errors: ['Invalid credentials.'] },
        { status: 401 },
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user info with the token
    const meRes = await fetch(`${DRUPAL_BASE}/api/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    let user = null;
    if (meRes.ok) {
      user = await meRes.json();
    }

    // 3. Set httpOnly cookie with the access token
    const response = NextResponse.json({
      message: 'Login successful.',
      user,
    });

    response.cookies.set('ml_auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 3600,
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
  } catch (err) {
    console.error('[login] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
