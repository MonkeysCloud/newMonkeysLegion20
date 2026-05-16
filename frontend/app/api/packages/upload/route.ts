import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const GCS_BUCKET = process.env.GCS_BUCKET || 'monkeyslegion-assets';
const GCS_PREFIX = 'drupal-files/marketplace';

// On Cloud Run, Application Default Credentials are auto-detected.
// Locally, set GOOGLE_APPLICATION_CREDENTIALS env var.
let storage: Storage;
function getStorage(): Storage {
  if (!storage) {
    storage = new Storage();
  }
  return storage;
}

/**
 * POST /api/packages/upload
 * Uploads file directly to Google Cloud Storage and returns the public URL.
 * Also proxies to Drupal to create a file entity (for fid reference).
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
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const gcsPath = `${GCS_PREFIX}/${timestamp}-${sanitized}`;

    // Upload to GCS
    const gcs = getStorage();
    const bucket = gcs.bucket(GCS_BUCKET);
    const blob = bucket.file(gcsPath);

    await blob.save(buffer, {
      contentType: file.type || 'application/octet-stream',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Public URL (bucket is publicly readable)
    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${gcsPath}`;

    // Also create the file entity in Drupal so we get an fid for field references
    const DRUPAL_BASE = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
    let fid = 0;
    try {
      const res = await fetch(`${DRUPAL_BASE}/api/marketplace/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'X-Filename': sanitized,
        },
        body: buffer,
      });
      if (res.ok) {
        const data = await res.json();
        fid = data.fid || 0;
      }
    } catch {
      // Drupal file entity creation failed — continue with GCS URL only
      console.warn('[upload] Drupal file entity creation failed, using GCS URL only');
    }

    return NextResponse.json({
      url: publicUrl,
      fid,
      filename: sanitized,
    });
  } catch (err) {
    console.error('[packages/upload] Error:', err);
    return NextResponse.json(
      { errors: ['File upload failed.'] },
      { status: 500 },
    );
  }
}
