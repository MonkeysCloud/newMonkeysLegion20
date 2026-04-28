'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { useMenuItems } from '@/lib/useMenuItems';
import type { MarketplacePackage } from '@/lib/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const menuItems = useMenuItems();
  const [packages, setPackages] = useState<MarketplacePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/dashboard/packages')
        .then((r) => r.ok ? r.json() : { packages: [] })
        .then((data) => setPackages(data.packages || []))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="auth-page"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) return null;

  const totalStars = packages.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalDownloads = packages.reduce((sum, p) => sum + (p.downloads || 0), 0);

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                Welcome, <span className="text-gradient">{user?.name}</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>Manage your published packages</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link href="/dashboard/settings" className="btn" style={{ border: '1px solid var(--color-border)' }}>⚙️ Settings</Link>
              <Link href="/dashboard/publish" className="btn btn-primary">+ Publish Package</Link>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value text-gradient">{packages.length}</div>
              <div className="stat-label">Packages</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--color-warning)' }}>⭐ {totalStars}</div>
              <div className="stat-label">Total Stars</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--color-secondary)' }}>{totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Total Downloads</div>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading packages...</p>
          ) : packages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No packages yet</h2>
              <p>Publish your first package and share it with the community.</p>
              <Link href="/dashboard/publish" className="btn btn-primary">Publish Your First Package</Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Downloads</th>
                    <th>Stars</th>
                    <th>Published</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{pkg.title}</td>
                      <td><span className="badge badge-success">v{pkg.version}</span></td>
                      <td><span className={`status-badge ${pkg.status || 'published'}`}>{pkg.status || 'published'}</span></td>
                      <td>{pkg.downloads.toLocaleString()}</td>
                      <td>⭐ {pkg.stars}</td>
                      <td>{new Date(pkg.created).toLocaleDateString()}</td>
                      <td><Link href={`/marketplace/${pkg.slug}`} style={{ color: 'var(--color-primary-light)', fontSize: 'var(--text-sm)' }}>View →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
