import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * GET /api/menu/:name
 * Proxy to Drupal menu API for client-side components.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: menuName } = await params;

  try {
    const res = await fetch(`${DRUPAL_BASE}/api/menu/${menuName}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const items = await res.json();
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch {
    return NextResponse.json([]);
  }
}
