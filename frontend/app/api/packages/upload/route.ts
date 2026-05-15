import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
const PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://cms.monkeyslegion.com';

/**
 * POST /api/packages/upload
 * Proxies file upload to Drupal's custom marketplace upload endpoint.
 * Accepts multipart/form-data with a 'file' field.
 * Returns the uploaded file URL and fid.
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Upload to Drupal's custom marketplace upload endpoint
    const res = await fetch(`${DRUPAL_BASE}/api/marketplace/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Filename': filename,
      },
      body: buffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[packages/upload] Drupal error:', res.status, errText);
      return NextResponse.json(
        { errors: ['File upload failed.'] },
        { status: res.status },
      );
    }

    const data = await res.json();

    // Rewrite internal URL to public CMS URL
    let url = data.url || '';
    if (url && !url.startsWith('https://cms.')) {
      const path = url.replace(/^https?:\/\/[^/]+/, '');
      url = `${PUBLIC_CMS_URL}${path}`;
    }

    return NextResponse.json({
      url,
      fid: data.fid,
      filename: data.filename || filename,
    });
  } catch (err) {
    console.error('[packages/upload] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
