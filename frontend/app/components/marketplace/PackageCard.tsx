'use client';

import Link from 'next/link';
import type { MarketplacePackage } from '@/lib/types';

export default function PackageCard({ pkg }: { pkg: MarketplacePackage }) {
  const hasLogo = pkg.logoUrl && pkg.logoUrl.length > 0;

  return (
    <Link href={`/marketplace/${pkg.slug}`} className="pkg-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="pkg-card-header">
        <div className="pkg-card-icon">
          {hasLogo ? (
            <img src={pkg.logoUrl} alt={pkg.title} />
          ) : (
            pkg.icon || '📦'
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="pkg-card-title">{pkg.title}</span>
            <span className="pkg-card-version">v{pkg.version}</span>
          </div>
          {pkg.category && (
            <span className="pkg-card-category">{pkg.category.name}</span>
          )}
        </div>
      </div>

      <p className="pkg-card-summary">{pkg.summary}</p>

      <div className="pkg-card-footer">
        <div className="pkg-card-meta">
          <span>⬇ {pkg.downloads.toLocaleString()}</span>
          <span>⭐ {pkg.stars}</span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          by {pkg.author.name}
        </span>
      </div>
    </Link>
  );
}
