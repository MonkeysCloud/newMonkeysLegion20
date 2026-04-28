export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getNewsPosts, newsUrl, getMenu } from '@/lib/drupal';

export const metadata: Metadata = {
  title: 'News — MonkeysLegion',
  description:
    'The latest news, announcements, and release updates from the MonkeysLegion team.',
  openGraph: {
    title: 'MonkeysLegion News',
    description:
      'Announcements, milestones, and release notes from the MonkeysLegion ecosystem.',
    url: '/news',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/news' },
};

export default async function NewsPage() {
  const [newsResult, menuItems] = await Promise.all([
    getNewsPosts(),
    getMenu('main'),
  ]);
  const posts = newsResult?.posts || [];

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main
        style={{
          paddingTop: 'calc(60px + var(--space-16))',
          paddingBottom: 'var(--space-20)',
        }}
      >
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div
              className="eyebrow"
              style={{
                margin: '0 auto var(--space-4)',
                justifyContent: 'center',
              }}
            >
              News
            </div>
            <h1
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Announcements &amp;{' '}
              <span className="text-gradient">Updates</span>
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 'var(--line-height-relaxed)',
              }}
            >
              Milestones, release notes, and important updates from the
              MonkeysLegion ecosystem.
            </p>
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 'var(--space-8)',
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={newsUrl(post.created, post.slug, post.pathAlias)}
                  style={{ textDecoration: 'none' }}
                >
                  <article
                    className="glass-card blog-card"
                    style={{
                      height: '100%',
                      overflow: 'hidden',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    {/* Featured image */}
                    {post.featuredImage ? (
                      <div
                        style={{
                          width: '100%',
                          height: 200,
                          background: `url(${post.featuredImage}) center/cover no-repeat`,
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: 200,
                          background:
                            'linear-gradient(135deg, hsla(170, 50%, 20%, 0.5), hsla(220, 50%, 15%, 0.5))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          opacity: 0.3,
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      >
                        📰
                      </div>
                    )}

                    <div style={{ padding: 'var(--space-6)' }}>
                      <h2
                        style={{
                          fontSize: 'var(--text-xl)',
                          fontWeight: 700,
                          marginBottom: 'var(--space-2)',
                          color: 'var(--color-text)',
                          lineHeight: 'var(--line-height-tight)',
                        }}
                      >
                        {post.title}
                      </h2>

                      {post.created && (
                        <time
                          dateTime={post.created}
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-primary-light)',
                            display: 'block',
                            marginBottom: 'var(--space-3)',
                          }}
                        >
                          {new Date(post.created).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}

                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 'var(--line-height-relaxed)',
                          marginBottom: 'var(--space-4)',
                        }}
                      >
                        {post.summary}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        <span>{post.author}</span>
                        <span
                          style={{
                            color: 'var(--color-primary-light)',
                            fontWeight: 600,
                          }}
                        >
                          Read more →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-20) 0',
              }}
            >
              <div
                style={{
                  fontSize: '4rem',
                  marginBottom: 'var(--space-6)',
                }}
              >
                📰
              </div>
              <h2
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-4)',
                }}
              >
                News Coming Soon
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  maxWidth: 500,
                  margin: '0 auto var(--space-8)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                We&apos;re preparing announcements, release notes, and
                ecosystem updates. Check back soon!
              </p>
              <Link href="/" className="btn btn-primary">
                ← Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
