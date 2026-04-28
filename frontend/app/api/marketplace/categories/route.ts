import { NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

export async function GET() {
  try {
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/categories`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ categories: [] });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
