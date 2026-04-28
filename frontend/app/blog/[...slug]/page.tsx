import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import DocContent from '../../components/DocContent';
import { getBlogPost, getMenu } from '@/lib/drupal';

interface BlogPostPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // The last segment is the field_slug used to look up the post
  const postSlug = slug[slug.length - 1];
  const post = await getBlogPost(postSlug);
  if (!post) return { title: 'Not Found | MonkeysLegion Blog' };
  return {
    title: `${post.title} | MonkeysLegion Blog`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: 'article' },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  // Always resolve by last path segment (the slug)
  const postSlug = slug[slug.length - 1];
  const [post, menuItems] = await Promise.all([
    getBlogPost(postSlug),
    getMenu('main'),
  ]);
  if (!post) notFound();

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main style={{ paddingTop: 'calc(60px + var(--space-16))', paddingBottom: 'var(--space-20)' }}>
        <article className="container" style={{ maxWidth: 780 }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <Link href="/blog" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-light)', marginBottom: 'var(--space-4)', display: 'block' }}>← Back to Blog</Link>

            {/* Featured image */}
            {post.featuredImage && (
              <div style={{
                width: '100%', height: 340, marginBottom: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                background: `url(${post.featuredImage}) center/cover no-repeat`,
                border: '1px solid var(--color-border)',
              }} />
            )}

            {post.category && <span className="badge" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)', display: 'inline-block', background: 'hsla(250, 85%, 60%, 0.15)', color: 'var(--color-primary-light)' }}>{post.category}</span>}
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, lineHeight: 'var(--line-height-tight)', letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.readTime} min read</span>
              {post.created && <>
                <span>·</span>
                <time dateTime={post.created}>{new Date(post.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </>}
            </div>
          </div>

          {/* Body */}
          <DocContent
            body={post.body}
            className="prose"
            style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--text-base)' }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text-muted)' }}>Tags</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="badge" style={{ fontSize: 'var(--text-xs)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
