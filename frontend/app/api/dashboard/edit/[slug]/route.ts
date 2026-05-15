import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

async function updatePackage(request: NextRequest, slug: string) {
  const token = request.cookies.get('ml_auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  try {
    const body = await request.json();
    const url = `${DRUPAL_BASE}/api/marketplace/packages/${slug}`;

    console.log(`[edit] PUT ${url}`);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log(`[edit] CMS responded: ${res.status} - ${text.substring(0, 300)}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // CMS returned non-JSON (HTML error page etc.)
      return NextResponse.json(
        { error: `CMS error (${res.status}): ${text.substring(0, 200)}` },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[edit] Proxy error:', err);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

/** PUT /api/dashboard/edit/[slug] */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return updatePackage(request, slug);
}

/** PATCH /api/dashboard/edit/[slug] — alias for PUT */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return updatePackage(request, slug);
}

/** POST /api/dashboard/edit/[slug] — fallback for environments that block PUT */
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return updatePackage(request, slug);
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

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `CMS error (${res.status})` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
