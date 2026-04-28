import { notFound } from 'next/navigation';
import { getDocPage, getDocPages, getDocVersions } from '@/lib/drupal';
import DocSidebar from '../../components/docs/DocSidebar';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ v?: string }> }) {
  const { slug } = await params;
  const { v } = await searchParams;
  const result = await getDocPage(slug, v || '2.0');
  if (!result) return { title: 'Not Found — MonkeysLegion Docs' };
  return {
    title: `${result.doc.title} — MonkeysLegion Docs`,
    description: `Documentation for ${result.doc.title} in MonkeysLegion v${result.doc.version}`,
  };
}

export default async function DocuSlugPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ v?: string }> }) {
  const { slug } = await params;
  const { v } = await searchParams;
  const version = v || '2.0';

  const [result, allPages, versions] = await Promise.all([
    getDocPage(slug, version),
    getDocPages(version),
    getDocVersions(),
  ]);

  if (!result) notFound();
  const page = result.doc;

  // Find prev/next for navigation
  const currentIndex = allPages.findIndex(p => p.slug === slug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;
  const vParam = version !== '2.0' ? `?v=${version}` : '';

  return (
    <div className="doc-layout">
      <DocSidebar pages={allPages} activeSlug={slug} versions={versions} currentVersion={version} />

      <main className="doc-main">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
            {page.category && (
              <span style={{
                fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: 'hsl(250, 95%, 75%)',
              }}>
                {page.category.name}
              </span>
            )}
            <span style={{
              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', fontWeight: 600,
              padding: '0.15rem 0.5rem', borderRadius: '999px',
              background: 'hsla(250, 95%, 65%, 0.12)', color: 'hsl(250, 95%, 75%)',
            }}>
              v{page.version}
            </span>
            {page.package && (
              <code style={{
                fontSize: 'var(--text-xs)', fontWeight: 500,
                padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface)', color: 'var(--color-text-muted)',
              }}>
                {page.package}
              </code>
            )}
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            {page.title}
          </h1>
        </div>

        {/* Content */}
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />

        {/* Prev / Next Navigation */}
        <div style={{
          marginTop: 'var(--space-12)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}>
          {prevPage ? (
            <a href={`/docs/${prevPage.slug}${vParam}`} style={{
              display: 'flex', flexDirection: 'column', gap: '0.2rem',
              padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)', textDecoration: 'none',
              transition: 'border-color 0.15s', flex: 1,
            }}
              onMouseEnter={(e: any) => e.currentTarget.style.borderColor = 'hsl(250, 95%, 65%)'}
              onMouseLeave={(e: any) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>← Previous</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{prevPage.title}</span>
            </a>
          ) : <div />}
          {nextPage ? (
            <a href={`/docs/${nextPage.slug}${vParam}`} style={{
              display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end',
              padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)', textDecoration: 'none',
              transition: 'border-color 0.15s', flex: 1,
            }}
              onMouseEnter={(e: any) => e.currentTarget.style.borderColor = 'hsl(250, 95%, 65%)'}
              onMouseLeave={(e: any) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Next →</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{nextPage.title}</span>
            </a>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
