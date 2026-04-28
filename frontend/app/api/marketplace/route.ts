import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * GET /api/marketplace
 * Proxies marketplace package queries to Drupal.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  try {
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/packages?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ packages: [], total: 0, page: 0, pageSize: 12 }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ packages: [], total: 0, page: 0, pageSize: 12 }, { status: 500 });
  }
}
