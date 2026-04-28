import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * POST /api/auth/register
 * Proxies to Drupal POST /api/register
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mail, pass } = body;

    // Client-side validation
    const errors: string[] = [];
    if (!name || name.length < 3) errors.push('Username must be at least 3 characters.');
    if (!mail || !mail.includes('@')) errors.push('Valid email is required.');
    if (!pass || pass.length < 8) errors.push('Password must be at least 8 characters.');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const res = await fetch(`${DRUPAL_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mail, pass }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { errors: data.errors || ['Registration failed.'] },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[register] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
