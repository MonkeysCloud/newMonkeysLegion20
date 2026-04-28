export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getBlogPosts, getBlogCategories, blogUrl, getMenu } from '@/lib/drupal';

export const metadata: Metadata = {
  title: 'Blog — Insights & Updates',
  description: 'Tutorials, deep dives, release notes, and updates from the MonkeysLegion team.',
  openGraph: {
    title: 'MonkeysLegion Blog — Insights & Updates',
    description: 'Tutorials, architecture deep dives, release notes, and thoughts on modern PHP development.',
    url: '/blog',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const [blogResult, categories, menuItems] = await Promise.all([
    getBlogPosts(),
    getBlogCategories().catch(() => []),
    getMenu('main'),
  ]);
  const posts = blogResult?.posts || [];

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main style={{ paddingTop: 'calc(60px + var(--space-16))', paddingBottom: 'var(--space-20)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="eyebrow" style={{ margin: '0 auto var(--space-4)', justifyContent: 'center' }}>Blog</div>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
              Insights & <span className="text-gradient">Updates</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 'var(--line-height-relaxed)' }}>
              Tutorials, architecture deep dives, release notes, and thoughts on modern PHP development.
            </p>
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' }}>
              <Link href="/blog" className="badge badge-success" style={{ textDecoration: 'none', background: 'var(--color-primary)', color: 'white' }}>All</Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/blog?category=${cat.slug}`} className="badge" style={{ textDecoration: 'none', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Posts grid */}
          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-8)' }}>
              {posts.map((post) => (
                <Link key={post.id} href={blogUrl(post.created, post.slug, post.pathAlias)} style={{ textDecoration: 'none' }}>
                  <article className="glass-card blog-card" style={{ height: '100%', overflow: 'hidden', transition: 'all var(--transition-base)' }}>
                    {/* Featured image */}
                    {post.featuredImage ? (
                      <div style={{
                        width: '100%', height: 200,
                        background: `url(${post.featuredImage}) center/cover no-repeat`,
                        borderBottom: '1px solid var(--color-border)',
                      }} />
                    ) : (
                      <div style={{
                        width: '100%', height: 200,
                        background: 'linear-gradient(135deg, hsla(250, 50%, 20%, 0.5), hsla(200, 50%, 15%, 0.5))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', opacity: 0.3,
                        borderBottom: '1px solid var(--color-border)',
                      }}>📝</div>
                    )}

                    <div style={{ padding: 'var(--space-6)' }}>
                      {post.category && <span className="badge" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)', display: 'inline-block', background: 'hsla(250, 85%, 60%, 0.15)', color: 'var(--color-primary-light)' }}>{post.category}</span>}
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)', lineHeight: 'var(--line-height-tight)' }}>{post.title}</h2>

                      {/* Date */}
                      {post.created && (
                        <time dateTime={post.created} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-light)', display: 'block', marginBottom: 'var(--space-3)' }}>
                          {new Date(post.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      )}

                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)' }}>{post.summary}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        <span>{post.author}</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state when no blog posts exist yet */
            <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>📝</div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Blog Coming Soon</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 'var(--line-height-relaxed)' }}>
                We&apos;re working on tutorials, deep dives, and release notes. Create blog posts in the Drupal admin to populate this page.
              </p>
              <Link href="/" className="btn btn-primary">← Back to home</Link>
            </div>
          )}
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
