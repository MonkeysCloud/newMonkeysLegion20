import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * POST /api/packages/publish
 * Proxies package creation to Drupal with the user's auth token.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get('ml_auth_token')?.value;

  if (!token) {
    return NextResponse.json(
      { errors: ['Authentication required.'] },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { errors: data.errors || ['Failed to publish package.'] },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[publish] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
