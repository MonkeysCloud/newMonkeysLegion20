import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/**
 * POST /api/packages/upload
 * Proxies file upload to Drupal. Accepts multipart/form-data with a 'file' field.
 * Returns the uploaded file URL.
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ errors: ['No file provided.'] }, { status: 422 });
    }

    // Read file as buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Upload to Drupal via JSON:API file upload
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/marketplace_package/field_logo/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `file; filename="${filename}"`,
        },
        body: buffer,
      },
    );

    if (!res.ok) {
      // Fallback: store via Drupal's custom upload endpoint
      const fallbackRes = await fetch(`${DRUPAL_BASE}/api/marketplace/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': file.type,
          'X-Filename': filename,
        },
        body: buffer,
      });

      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.error('[upload] Drupal error:', errText);
        return NextResponse.json(
          { errors: ['File upload failed.'] },
          { status: 500 },
        );
      }

      const fallbackData = await fallbackRes.json();
      return NextResponse.json(fallbackData);
    }

    const data = await res.json();
    const fileUrl = data?.data?.attributes?.uri?.url || '';

    return NextResponse.json({
      url: fileUrl ? `${DRUPAL_BASE}${fileUrl}` : '',
      filename,
    });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
