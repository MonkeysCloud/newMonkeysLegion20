import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import DocContent from '../../components/DocContent';
import { getNewsPost, getMenu } from '@/lib/drupal';

interface NewsDetailProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const postSlug = slug[slug.length - 1];
  const post = await getNewsPost(postSlug);
  if (!post) return { title: 'Not Found | MonkeysLegion News' };
  return {
    title: `${post.title} | MonkeysLegion News`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
    },
  };
}

export default async function NewsDetailPage({
  params,
}: NewsDetailProps) {
  const { slug } = await params;
  const postSlug = slug[slug.length - 1];
  const [post, menuItems] = await Promise.all([
    getNewsPost(postSlug),
    getMenu('main'),
  ]);
  if (!post) notFound();

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main
        style={{
          paddingTop: 'calc(60px + var(--space-16))',
          paddingBottom: 'var(--space-20)',
        }}
      >
        <article className="container" style={{ maxWidth: 780 }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <Link
              href="/news"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-primary-light)',
                marginBottom: 'var(--space-4)',
                display: 'block',
              }}
            >
              ← Back to News
            </Link>

            {/* Featured image */}
            {post.featuredImage && (
              <div
                style={{
                  width: '100%',
                  height: 340,
                  marginBottom: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: `url(${post.featuredImage}) center/cover no-repeat`,
                  border: '1px solid var(--color-border)',
                }}
              />
            )}

            <h1
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 900,
                lineHeight: 'var(--line-height-tight)',
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'center',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>{post.author}</span>
              {post.created && (
                <>
                  <span>·</span>
                  <time dateTime={post.created}>
                    {new Date(post.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <DocContent
            body={post.body}
            className="prose"
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              fontSize: 'var(--text-base)',
            }}
          />
        </article>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
