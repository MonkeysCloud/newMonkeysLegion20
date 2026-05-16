'use client';

import { useEffect, useState, useRef, use } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/Footer';
import { useMenuItems } from '@/lib/useMenuItems';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

const LICENSE_OPTIONS = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3', 'ISC', 'Custom'];

interface EditForm {
  title: string;
  summary: string;
  description: string;
  version: string;
  category: string;
  repo_url: string;
  docs_url: string;
  install_command: string;
  composer_install: string;
  license: string;
  icon: string;
}

export default function EditPackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const menuItems = useMenuItems();
  const [form, setForm] = useState<EditForm | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Image uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // Track which previews are existing GCS URLs vs new blob URLs
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const logoRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  // Fetch package data
  useEffect(() => {
    if (!isAuthenticated || !slug) return;

    fetch(`/api/dashboard/edit/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoadingPkg(false); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        const pkg = data.package || data;
        setForm({
          title: pkg.title || '',
          summary: pkg.summary || '',
          description: pkg.description || '',
          version: pkg.version || '',
          category: pkg.category?.name || '',
          repo_url: pkg.repoUrl || '',
          docs_url: pkg.docsUrl || '',
          install_command: pkg.installCommand || '',
          composer_install: pkg.composerInstall || '',
          license: pkg.license || 'MIT',
          icon: pkg.icon || '📦',
        });
        // Pre-populate existing logo
        if (pkg.logoUrl) {
          setLogoPreview(pkg.logoUrl);
        }
        // Pre-populate existing screenshots
        if (pkg.images && pkg.images.length > 0) {
          setImagePreviews(pkg.images);
          setExistingImageUrls(pkg.images);
        }
        setLoadingPkg(false);
      })
      .catch(() => { setNotFound(true); setLoadingPkg(false); });
  }, [isAuthenticated, slug]);

  // Fetch categories
  useEffect(() => {
    fetch('/api/marketplace/categories')
      .then(r => r.ok ? r.json() : { categories: [] })
      .then(d => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    // If removing an existing (GCS) image, also remove from existingImageUrls
    const removedSrc = imagePreviews[index];
    if (existingImageUrls.includes(removedSrc)) {
      setExistingImageUrls(prev => prev.filter(u => u !== removedSrc));
    } else {
      // It's a new file — remove from imageFiles
      const newFileIndex = index - existingImageUrls.filter(u => imagePreviews.slice(0, index).includes(u)).length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<{ url: string; fid: number }> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/packages/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return { url: data.url || '', fid: data.fid || 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setErrors([]);
    const errs: string[] = [];
    if (form.title.length < 2) errs.push('Package name is required.');
    if (form.summary.length < 5) errs.push('Summary is required.');
    if (!form.version) errs.push('Version is required.');
    if (errs.length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { ...form };

      // Handle logo: if removed, explicitly clear; if new file, upload
      if (logoRemoved && !logoFile) {
        payload.logo_url = '';
        payload.logo_fid = 0;
      }
      if (logoFile) {
        try {
          const result = await uploadFile(logoFile);
          payload.logo_fid = result.fid;
          payload.logo_url = result.url;
        } catch { /* continue without logo */ }
      }

      // Build final screenshot URLs: existing (non-removed) + newly uploaded
      const finalScreenshotUrls: string[] = [...existingImageUrls];
      const newScreenshotFids: number[] = [];
      for (const img of imageFiles) {
        try {
          const result = await uploadFile(img);
          if (result.url) finalScreenshotUrls.push(result.url);
          if (result.fid) newScreenshotFids.push(result.fid);
        } catch { /* skip */ }
      }
      // Always send the full list so Drupal knows the current state
      payload.screenshot_urls = finalScreenshotUrls;
      if (newScreenshotFids.length > 0) {
        payload.screenshot_fids = newScreenshotFids;
      }

      const res = await fetch(`/api/dashboard/edit/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || [data.error || 'Update failed.']);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch {
      setErrors(['An unexpected error occurred.']);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated) return <div className="auth-page"><p>Loading...</p></div>;

  if (loadingPkg) {
    return (
      <>
        <Navbar menuItems={menuItems} />
        <main className="publish-page">
          <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading package data...</p>
          </div>
        </main>
        <Footer menuItems={menuItems} />
      </>
    );
  }

  if (notFound || !form) {
    return (
      <>
        <Navbar menuItems={menuItems} />
        <main className="publish-page">
          <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>Package Not Found</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>The package you&apos;re trying to edit does not exist or you don&apos;t have permission to edit it.</p>
          </div>
        </main>
        <Footer menuItems={menuItems} />
      </>
    );
  }

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main className="publish-page">
        <div className="container">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="eyebrow">✏️ Edit</span>
            <h1 className="section-title">Edit <span className="text-gradient">{form.title}</span></h1>
            <p className="section-subtitle">Update your package details.</p>
          </div>

          {errors.length > 0 && <ul className="form-errors">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
          {success && <div className="form-success">✅ Package updated! Redirecting...</div>}

          <form className="publish-form" onSubmit={handleSubmit}>
            {/* Name + Version */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input className="form-input" placeholder="my-awesome-package" value={form.title} onChange={set('title')} />
              </div>
              <div className="form-group">
                <label className="form-label">Version *</label>
                <input className="form-input" placeholder="1.0.0" value={form.version} onChange={set('version')} />
              </div>
            </div>

            {/* Summary */}
            <div className="form-group">
              <label className="form-label">Short Summary *</label>
              <input className="form-input" placeholder="A brief description of what your package does" value={form.summary} onChange={set('summary')} />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Full Description</label>
              <RichTextEditor
                value={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
                placeholder="Detailed description, features, usage examples..."
                minHeight={240}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {/* Logo Upload */}
            <div className="form-group">
              <label className="form-label">Package Logo / Icon</label>
              <div className={`file-upload${logoPreview ? ' has-file' : ''}`} onClick={() => logoRef.current?.click()}>
                {logoPreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
                    <img src={logoPreview} alt="Logo preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                    <span>Click to change logo</span>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>🖼️</p>
                    <p>Click to upload a new logo image</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>PNG, JPG, SVG up to 2MB</p>
                  </div>
                )}
              </div>
              {logoPreview && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setLogoFile(null); setLogoRemoved(true); }}
                  style={{ marginTop: 'var(--space-2)', background: 'var(--color-danger)', color: 'white', border: 'none', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  🗑️ Remove Logo
                </button>
              )}
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </div>

            {/* Gallery Images */}
            <div className="form-group">
              <label className="form-label">Screenshots / Gallery Images</label>
              <div className="file-upload" onClick={() => imagesRef.current?.click()}>
                <p style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>📸</p>
                <p>Click to add screenshots</p>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>Upload multiple images to showcase your package</p>
              </div>
              <input ref={imagesRef} type="file" accept="image/*" multiple onChange={handleImagesChange} style={{ display: 'none' }} />
              {imagePreviews.length > 0 && (
                <div className="file-preview">
                  {imagePreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt={`Screenshot ${i + 1}`} />
                      <button type="button" onClick={() => removeImage(i)} style={{
                        position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                        borderRadius: '50%', background: 'var(--color-danger)', border: 'none',
                        color: 'white', fontSize: 12, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Install Commands */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Composer Install Command</label>
                <input className="form-input" placeholder="composer require vendor/package" value={form.composer_install} onChange={set('composer_install')} />
              </div>
              <div className="form-group">
                <label className="form-label">Alternative Install Command</label>
                <input className="form-input" placeholder="npm install package-name" value={form.install_command} onChange={set('install_command')} />
              </div>
            </div>

            {/* URLs */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Repository URL</label>
                <input className="form-input" placeholder="https://github.com/..." value={form.repo_url} onChange={set('repo_url')} />
              </div>
              <div className="form-group">
                <label className="form-label">Documentation URL</label>
                <input className="form-input" placeholder="https://docs.example.com" value={form.docs_url} onChange={set('docs_url')} />
              </div>
            </div>

            {/* License */}
            <div className="form-group">
              <label className="form-label">License</label>
              <select className="form-select" value={form.license} onChange={set('license')}>
                {LICENSE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ minWidth: 200 }}>
                {submitting ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button type="button" className="btn btn-lg" onClick={() => router.push('/dashboard')} style={{ border: '1px solid var(--color-border)', minWidth: 140 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
