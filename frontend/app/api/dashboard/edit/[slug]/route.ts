import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/** PUT /api/dashboard/edit/[slug] — proxy to Drupal updatePackage */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = request.cookies.get('ml_auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  try {
    const body = await request.json();
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/packages/${slug}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ error: 'Invalid response from CMS' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

/** GET /api/dashboard/edit/[slug] — fetch package details for editing */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = request.cookies.get('ml_auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  try {
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/packages/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await res.json().catch(() => ({ error: 'Invalid response from CMS' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
