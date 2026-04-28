import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * POST /api/auth/upload — upload avatar or banner image
 * Stores files in public/uploads/profiles/
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

    // Store in public/uploads/profiles/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/profiles/${filename}`;

    return NextResponse.json({ url, message: 'Upload successful.' });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ errors: ['Upload failed.'] }, { status: 500 });
  }
}
