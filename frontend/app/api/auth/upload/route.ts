import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Storage } from '@google-cloud/storage';

const GCS_BUCKET = process.env.GCS_BUCKET || 'monkeyslegion-assets';
const GCS_PREFIX = 'drupal-files/profiles';

let storage: Storage;
function getStorage(): Storage {
  if (!storage) {
    storage = new Storage();
  }
  return storage;
}

/**
 * POST /api/auth/upload — upload avatar or banner image to GCS.
 * Returns a persistent public URL.
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
    const gcsPath = `${GCS_PREFIX}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

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

    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${gcsPath}`;

    return NextResponse.json({ url: publicUrl, message: 'Upload successful.' });
  } catch (err) {
    console.error('[auth/upload] Error:', err);
    return NextResponse.json({ errors: ['Upload failed.'] }, { status: 500 });
  }
}
