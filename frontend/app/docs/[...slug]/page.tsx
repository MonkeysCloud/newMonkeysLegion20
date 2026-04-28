export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import DocContent from '../../components/DocContent';
import DocSidebar from '../../components/DocSidebar';
import DocVersionSelector from '../../components/DocVersionSelector';
import { getDocPage, getDocSidebar, getMenu } from '@/lib/drupal';

interface DocDetailPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ v?: string }>;
}

export async function generateMetadata({ params, searchParams }: DocDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { v } = await searchParams;
  const result = await getDocPage(slug.join('/'), v);
  if (!result) return { title: 'Not Found | MonkeysLegion Docs' };
  return {
    title: `${result.doc.title} | MonkeysLegion Docs`,
    description: `Documentation for ${result.doc.title} — MonkeysLegion v${result.doc.version}`,
  };
}

export default async function DocDetailPage({ params, searchParams }: DocDetailPageProps) {
  const { slug } = await params;
  const { v } = await searchParams;
  const slugStr = slug.join('/');
  const [result, sidebar, menuItems] = await Promise.all([
    getDocPage(slugStr, v),
    getDocSidebar(v),
    getMenu('main'),
  ]);

  if (!result) notFound();

  const { doc, availableVersions } = result;

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main style={{ paddingTop: 'calc(60px + var(--space-8))' }}>
        <div className="container doc-grid">
          {/* Sidebar */}
          <DocSidebar items={sidebar} currentSlug={slugStr} />

          {/* Content */}
          <article style={{ minWidth: 0, padding: 'var(--space-8) 0 var(--space-20)' }}>
            {/* Top bar: category badge + version selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              {doc.category && (
                <span className="badge" style={{ fontSize: 'var(--text-xs)', background: 'hsla(250, 85%, 60%, 0.15)', color: 'var(--color-primary-light)' }}>
                  {doc.category.name}
                </span>
              )}
              <DocVersionSelector
                currentVersion={doc.version}
                availableVersions={availableVersions}
              />
            </div>

            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, lineHeight: 'var(--line-height-tight)', letterSpacing: '-0.02em', marginBottom: 'var(--space-6)' }}>{doc.title}</h1>

            <DocContent
              body={doc.body}
              format={doc.bodyFormat}
              className="doc-content"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--text-base)' }}
            />
          </article>
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
