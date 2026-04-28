import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/** GET /api/dashboard/packages — returns current user's packages */
export async function GET(request: NextRequest) {
  const token = request.cookies.get('ml_auth_token')?.value;
  if (!token) return NextResponse.json({ packages: [] }, { status: 401 });

  try {
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/my-packages`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) return NextResponse.json({ packages: [] }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ packages: [] }, { status: 500 });
  }
}
