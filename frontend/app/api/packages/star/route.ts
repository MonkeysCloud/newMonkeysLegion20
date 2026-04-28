import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * POST /api/packages/star
 * Proxies star/unstar to Drupal.
 * Body: { slug: "package-slug" }
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
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ errors: ['Package slug required.'] }, { status: 422 });
    }

    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/packages/${slug}/star`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[star] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
