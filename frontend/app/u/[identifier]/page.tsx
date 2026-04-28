export const dynamic = 'force-dynamic';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import EditProfileButton from '../../components/profile/EditProfileButton';
import { getMenu } from '@/lib/drupal';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ identifier: string }>;
}

async function getProfile(identifier: string) {
  const DRUPAL_BASE = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';
  try {
    const res = await fetch(`${DRUPAL_BASE}/api/profile/${identifier}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { identifier } = await params;
  const profile = await getProfile(identifier);
  if (!profile) return { title: 'User Not Found' };
  return {
    title: `${profile.user.name} — Profile | MonkeysLegion`,
    description: profile.user.bio || `${profile.user.name} has published ${profile.user.packageCount} packages on MonkeysLegion.`,
  };
}

/* Social icon — pure CSS hover */
function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className="social-icon-link">
      {children}
    </a>
  );
}

export default async function PublicProfilePage({ params }: Props) {
  const { identifier } = await params;
  const [profile, menuItems] = await Promise.all([
    getProfile(identifier),
    getMenu('main'),
  ]);

  if (!profile) notFound();

  const { user, packages } = profile;

  return (
    <>
      <Navbar menuItems={menuItems} />

      {/* Banner — full width, below navbar */}
      <div style={{
        width: '100%',
        height: 300,
        paddingTop: 112, /* clear topbar (32px) + main navbar */
        background: user.bannerUrl
          ? `url(${user.bannerUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, hsl(260, 50%, 18%) 0%, hsl(230, 50%, 12%) 50%, hsl(200, 60%, 15%) 100%)',
        position: 'relative',
      }}>
        {/* Top gradient for navbar readability */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.6) 40%, transparent 100%)',
          zIndex: 1,
        }} />
        {/* Bottom gradient fade into page bg */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(transparent, var(--color-bg))',
        }} />
      </div>

      <main style={{ minHeight: '60vh', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 var(--space-6)' }}>

          {/* Profile Header Card */}
          <div style={{ marginTop: -80, position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start',
              flexWrap: 'wrap', padding: 'var(--space-8)',
              background: 'var(--color-surface-glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 120, height: 120, borderRadius: 'var(--radius-xl)', flexShrink: 0,
                border: '4px solid var(--color-bg)',
                background: user.avatarUrl
                  ? `url(${user.avatarUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', fontWeight: 800, color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}>
                {!user.avatarUrl && user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 2, lineHeight: 1.2 }}>
                    {user.name}
                  </h1>
                  <EditProfileButton profileUid={user.uid} />
                </div>
                {user.slug && (
                  <p style={{ color: 'var(--color-primary-light)', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-3)' }}>
                    @{user.slug}
                  </p>
                )}
                {user.bio && (
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)', maxWidth: 560 }}>
                    {user.bio}
                  </p>
                )}

                {/* Stats pills */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                  <span className="profile-stat-pill">📦 {user.packageCount} packages</span>
                  <span className="profile-stat-pill">⭐ {user.totalStars} stars</span>
                  <span className="profile-stat-pill">📅 Joined {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Links row */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="profile-website-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                      </svg>
                      {user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  )}

                  {/* Social icons */}
                  <SocialLink href={user.github} label="GitHub">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  </SocialLink>
                  <SocialLink href={user.twitter} label="X (Twitter)">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </SocialLink>
                  <SocialLink href={user.linkedin} label="LinkedIn">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </SocialLink>
                  {user.discord && (
                    <span className="profile-discord-badge">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                      {user.discord}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Packages Section */}
          <div style={{ marginTop: 'var(--space-10)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)',
            }}>
              <span style={{ fontSize: 'var(--text-2xl)' }}>📦</span>
              Published Packages
              {packages.length > 0 && (
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  background: 'var(--color-primary)', color: 'white',
                  padding: '2px 10px', borderRadius: 'var(--radius-full)',
                }}>
                  {packages.length}
                </span>
              )}
            </h2>

            {packages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No packages yet</h2>
                <p>This user hasn&apos;t published any packages.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
              }}>
                {packages.map((pkg: { id: string; title: string; slug: string; summary: string; version: string; icon: string; stars: number; downloads: number }) => (
                  <Link key={pkg.id} href={`/marketplace/${pkg.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="profile-package-card">
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                        {pkg.icon ? (
                          <img src={pkg.icon} alt="" style={{ width: 40, height: 40, borderRadius: 10 }} />
                        ) : (
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 'var(--text-lg)', fontWeight: 700, color: 'white',
                          }}>
                            {pkg.title.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)' }}>{pkg.title}</h3>
                          <span className="badge badge-success" style={{ fontSize: '10px' }}>v{pkg.version}</span>
                        </div>
                      </div>
                      {pkg.summary && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                          {pkg.summary.length > 100 ? pkg.summary.slice(0, 100) + '…' : pkg.summary}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        <span>⭐ {pkg.stars}</span>
                        <span>⬇️ {pkg.downloads}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
