import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
const PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://cms.monkeyslegion.com';

/**
 * POST /api/auth/upload — upload avatar or banner image
 * Proxies the upload to Drupal's JSON:API file endpoint so files are
 * persisted in the CMS (not the ephemeral Cloud Run filesystem).
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ml_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ errors: ['Not authenticated'] }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar' or 'banner'

    if (!file || !type) {
      return NextResponse.json({ errors: ['File and type are required.'] }, { status: 400 });
    }

    // Validate file
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ errors: ['File must be under 5MB.'] }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ errors: ['Only JPEG, PNG, WebP, and GIF are allowed.'] }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Drupal via JSON:API binary file endpoint
    const uploadRes = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/article/field_image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          Accept: 'application/vnd.api+json',
          'Content-Disposition': `file; filename="${filename}"`,
        },
        body: buffer,
      },
    );

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      const fileUri = data?.data?.attributes?.uri?.url;
      if (fileUri) {
        // Return the public CMS URL so the browser can load the image
        const url = fileUri.startsWith('http') ? fileUri : `${PUBLIC_CMS_URL}${fileUri}`;
        return NextResponse.json({ url, message: 'Upload successful.' });
      }
    }

    // Fallback: upload via Drupal's simple file upload REST endpoint
    const fallbackRes = await fetch(`${DRUPAL_BASE}/file/upload/user/user/user_picture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `file; filename="${filename}"`,
        Accept: 'application/json',
      },
      body: buffer,
    });

    if (fallbackRes.ok) {
      const fileData = await fallbackRes.json();
      const uri = fileData?.uri?.[0]?.url || fileData?.data?.attributes?.uri?.url;
      if (uri) {
        const url = uri.startsWith('http') ? uri : `${PUBLIC_CMS_URL}${uri}`;
        return NextResponse.json({ url, message: 'Upload successful.' });
      }
    }

    // If Drupal upload fails, log and return error
    const errText = await (uploadRes.ok ? fallbackRes : uploadRes).text();
    console.error('[upload] Drupal upload failed:', errText);
    return NextResponse.json({ errors: ['Upload to CMS failed.'] }, { status: 502 });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ errors: ['Upload failed.'] }, { status: 500 });
  }
}
