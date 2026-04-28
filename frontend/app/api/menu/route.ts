import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * GET /api/menu?name=main
 * Proxy to Drupal menu API for client-side components.
 */
export async function GET(request: NextRequest) {
  const menuName = request.nextUrl.searchParams.get('name') || 'main';

  try {
    const res = await fetch(`${DRUPAL_BASE}/api/menu/${menuName}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const items = await res.json();
    return NextResponse.json({ items: Array.isArray(items) ? items : [] });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
