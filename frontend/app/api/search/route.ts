import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/drupal';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const type = searchParams.get('type') || undefined;

  const data = await search(query, page);

  // Filter by type if specified
  if (type) {
    const filtered = data.results.filter((r) => r.type === type);
    return NextResponse.json({ ...data, results: filtered, total: filtered.length });
  }

  return NextResponse.json(data);
}
