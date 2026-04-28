'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import { useMenuItems } from '@/lib/useMenuItems';

const LICENSE_OPTIONS = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3', 'ISC', 'Custom'];

interface PublishForm {
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

const INITIAL: PublishForm = {
  title: '', summary: '', description: '', version: '1.0.0',
  category: '', repo_url: '', docs_url: '',
  install_command: '', composer_install: '', license: 'MIT', icon: '📦',
};

export default function PublishPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const menuItems = useMenuItems();
  const [form, setForm] = useState<PublishForm>(INITIAL);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Image uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const logoRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/packages/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const errs: string[] = [];
    if (form.title.length < 2) errs.push('Package name is required.');
    if (form.summary.length < 5) errs.push('Summary is required.');
    if (!form.version) errs.push('Version is required.');
    if (errs.length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      // Upload logo if provided
      let logoUrl = '';
      if (logoFile) {
        try { logoUrl = await uploadFile(logoFile); } catch { /* continue without logo */ }
      }

      // Upload gallery images
      const imageUrls: string[] = [];
      for (const img of imageFiles) {
        try { imageUrls.push(await uploadFile(img)); } catch { /* skip */ }
      }

      const categoryName = form.category;

      const res = await fetch('/api/packages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          category: categoryName,
          logo_url: logoUrl,
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || ['Publication failed.']);
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

  const set = (key: keyof PublishForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main className="publish-page">
        <div className="container">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="eyebrow">📦 Publish</span>
            <h1 className="section-title">Publish a <span className="text-gradient">Package</span></h1>
            <p className="section-subtitle">Share your package with the MonkeysLegion community.</p>
          </div>

          {errors.length > 0 && <ul className="form-errors">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
          {success && <div className="form-success">✅ Package published! Redirecting...</div>}

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
              <label className="form-label">Full Description (HTML supported)</label>
              <textarea className="form-textarea" placeholder="Detailed description, features, usage examples..." value={form.description} onChange={set('description')} style={{ minHeight: 200 }} />
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
                    <p>Click to upload logo image</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>PNG, JPG, SVG up to 2MB</p>
                  </div>
                )}
              </div>
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

            <div style={{ marginTop: 'var(--space-8)' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ minWidth: 200 }}>
                {submitting ? 'Publishing...' : '🚀 Publish Package'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
