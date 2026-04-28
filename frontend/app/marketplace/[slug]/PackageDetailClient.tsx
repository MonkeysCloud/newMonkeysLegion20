'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MarketplacePackage } from '@/lib/types';
import PackageCard from '../../components/marketplace/PackageCard';
import { useAuth } from '../../components/auth/AuthProvider';

export default function PackageDetailClient({ pkg }: { pkg: MarketplacePackage }) {
  const { isAuthenticated } = useAuth();
  const [stars, setStars] = useState(pkg.stars);
  const [starred, setStarred] = useState(false);
  const [starLoading, setStarLoading] = useState(false);

  const handleStar = async () => {
    if (!isAuthenticated) return;
    setStarLoading(true);
    try {
      const res = await fetch('/api/packages/star', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: pkg.slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setStars(data.stars);
        setStarred(data.starred);
      }
    } catch { /* ignore */ }
    finally { setStarLoading(false); }
  };

  return (
    <>
      {/* Header */}
      <div className="pkg-detail-header">
        <div className="pkg-detail-icon">
          {pkg.logoUrl ? <img src={pkg.logoUrl} alt={pkg.title} /> : (pkg.icon || '📦')}
        </div>
        <div className="pkg-detail-info">
          <h1>{pkg.title}</h1>
          <div className="pkg-detail-badges">
            <span className="badge badge-success">v{pkg.version}</span>
            {pkg.license && <span className="badge badge-warning">{pkg.license}</span>}
            {pkg.category && <span className="pkg-card-category">{pkg.category.name}</span>}
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            by <Link href={`/profile/${pkg.author.name}`} style={{ color: 'var(--color-primary-light)' }}>{pkg.author.name}</Link>
          </p>
        </div>
        <button className={`star-btn${starred ? ' starred' : ''}`} onClick={handleStar} disabled={starLoading || !isAuthenticated}>
          {starred ? '★' : '☆'} {stars} Star{stars !== 1 ? 's' : ''}
        </button>
      </div>

      {/* Gallery */}
      {pkg.images && pkg.images.length > 0 && (
        <div className="pkg-gallery">
          {pkg.images.map((img, i) => (
            <img key={i} src={img} alt={`${pkg.title} screenshot ${i + 1}`} />
          ))}
        </div>
      )}

      {/* Body */}
      <div className="pkg-detail-body">
        <div>
          {pkg.description && (
            <div className="doc-content" dangerouslySetInnerHTML={{ __html: pkg.description }} />
          )}
          {!pkg.description && pkg.summary && (
            <div className="doc-content"><p>{pkg.summary}</p></div>
          )}
        </div>

        <aside className="pkg-detail-sidebar">
          {/* Install */}
          {(pkg.installCommand || pkg.composerInstall) && (
            <div className="pkg-sidebar-card">
              <h3>Install</h3>
              {pkg.composerInstall && (
                <div className="terminal" style={{ marginBottom: pkg.installCommand ? 'var(--space-3)' : 0 }}>
                  <div className="terminal-body" style={{ padding: 'var(--space-3)' }}>
                    <code style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-sm)' }}>{pkg.composerInstall}</code>
                  </div>
                </div>
              )}
              {pkg.installCommand && (
                <div className="terminal">
                  <div className="terminal-body" style={{ padding: 'var(--space-3)' }}>
                    <code style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-sm)' }}>{pkg.installCommand}</code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="pkg-sidebar-card">
            <h3>Package Info</h3>
            <div className="pkg-sidebar-row"><span className="label">Version</span><span className="value">{pkg.version}</span></div>
            <div className="pkg-sidebar-row"><span className="label">License</span><span className="value">{pkg.license || 'Not specified'}</span></div>
            <div className="pkg-sidebar-row"><span className="label">Downloads</span><span className="value">{pkg.downloads.toLocaleString()}</span></div>
            <div className="pkg-sidebar-row"><span className="label">Stars</span><span className="value">⭐ {stars}</span></div>
            <div className="pkg-sidebar-row"><span className="label">Published</span><span className="value">{new Date(pkg.created).toLocaleDateString()}</span></div>
            {pkg.repoUrl && (
              <div className="pkg-sidebar-row"><span className="label">Repository</span><a href={pkg.repoUrl} target="_blank" rel="noopener noreferrer" className="value">GitHub →</a></div>
            )}
            {pkg.docsUrl && (
              <div className="pkg-sidebar-row"><span className="label">Docs</span><a href={pkg.docsUrl} target="_blank" rel="noopener noreferrer" className="value">Documentation →</a></div>
            )}
          </div>
        </aside>
      </div>

      {/* Related */}
      {pkg.related && pkg.related.length > 0 && (
        <section style={{ marginTop: 'var(--space-16)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Related Packages</h2>
          <div className="packages-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {pkg.related.map((rp) => <PackageCard key={rp.id} pkg={rp} />)}
          </div>
        </section>
      )}
    </>
  );
}
