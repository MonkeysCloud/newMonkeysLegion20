export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getDocPages, getDocVersions } from '@/lib/drupal';
import DocSidebar from '../components/docs/DocSidebar';

export const metadata = {
  title: 'Documentation — MonkeysLegion Framework',
  description: 'Complete documentation for the MonkeysLegion PHP 8.4 framework. Guides, API references, and tutorials.',
};

export default async function DocuIndexPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const params = await searchParams;
  const version = params.v || '2.0';
  const [pages, versions] = await Promise.all([
    getDocPages(version),
    getDocVersions(),
  ]);

  // If there are pages, redirect to the first one
  if (pages.length > 0) {
    const firstSlug = pages[0].slug;
    redirect(`/docs/${firstSlug}${version !== '2.0' ? `?v=${version}` : ''}`);
  }

  // Empty state
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 128px)' }}>
      <DocSidebar pages={pages} activeSlug="" versions={versions} currentVersion={version} />
      <main style={{ flex: 1, padding: 'var(--space-12) var(--space-10)', maxWidth: 900 }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📚</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Documentation <span className="text-gradient">v{version}</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto', lineHeight: 'var(--line-height-relaxed)' }}>
            No documentation pages have been published yet for this version.
            Create pages in the Drupal admin at <code style={{ background: 'var(--color-surface)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>/admin/content</code>
          </p>
        </div>
      </main>
    </div>
  );
}
