import { NextRequest, NextResponse } from 'next/server';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
const PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://cms.monkeyslegion.com';

/**
 * POST /api/packages/upload
 * Proxies file upload to Drupal via the core file upload REST resource.
 * Accepts multipart/form-data with a 'file' field.
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

    // Upload via Drupal's file upload REST resource (core)
    // Endpoint: POST /file/upload/{entity_type_id}/{bundle}/{field_name}
    const res = await fetch(
      `${DRUPAL_BASE}/file/upload/node/marketplace_package/field_logo`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `file; filename="${filename}"`,
          Accept: 'application/json',
        },
        body: buffer,
      },
    );

    if (res.ok) {
      const data = await res.json();
      const fileUri = data?.uri?.[0]?.url;
      if (fileUri) {
        const url = fileUri.startsWith('http') ? fileUri : `${PUBLIC_CMS_URL}${fileUri}`;
        return NextResponse.json({ url, filename });
      }
    }

    // Fallback: upload as a generic file entity via JSON:API
    const fallbackRes = await fetch(`${DRUPAL_BASE}/jsonapi/file/file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `file; filename="${filename}"`,
      },
      body: buffer,
    });

    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      const fileUri = fbData?.data?.attributes?.uri?.url;
      if (fileUri) {
        const url = fileUri.startsWith('http') ? fileUri : `${PUBLIC_CMS_URL}${fileUri}`;
        return NextResponse.json({ url, filename });
      }
    }

    // Log the actual error for debugging
    const errText = await (res.ok ? fallbackRes : res).text();
    console.error('[packages/upload] Drupal error:', res.status, errText);
    return NextResponse.json(
      { errors: ['File upload failed.'] },
      { status: 500 },
    );
  } catch (err) {
    console.error('[packages/upload] Error:', err);
    return NextResponse.json(
      { errors: ['Internal server error.'] },
      { status: 500 },
    );
  }
}
