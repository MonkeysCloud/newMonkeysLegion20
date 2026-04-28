import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * POST /api/auth/forgot-password
 * Triggers Drupal's password reset email for the given address.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mail = body.mail?.trim();

    if (!mail || !mail.includes('@')) {
      return NextResponse.json(
        { errors: ['A valid email address is required.'] },
        { status: 422 },
      );
    }

    const res = await fetch(`${DRUPAL_BASE}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail }),
    });

    // Always return success to prevent email enumeration
    if (!res.ok) {
      // Log server-side but don't expose to client
      console.warn('[forgot-password] Drupal returned:', res.status);
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (err) {
    console.error('[forgot-password] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
