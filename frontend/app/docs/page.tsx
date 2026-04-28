import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getDocPages, getMenu } from '@/lib/drupal';
import type { DocPage } from '@/lib/drupal';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for MonkeysLegion v2.0 — Getting started, API reference, packages, and guides.',
  openGraph: {
    title: 'MonkeysLegion Documentation',
    description: 'Getting started guides, API reference, package docs, and architectural patterns for MonkeysLegion v2.0.',
    url: '/docs',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/docs' },
};

// Icon map for known categories
const categoryIcons: Record<string, string> = {
  'Getting Started': '🚀',
  'Packages': '📦',
  'API Reference': '📐',
  'Guides': '📖',
  'HTTP & Routing': '🌐',
  'Auth & Security': '🔐',
  'Data Layer': '💾',
  'Templates & Assets': '🎨',
  'Background & Events': '⚡',
  'Operations': '🛠️',
  'AI (Apex)': '🤖',
  'Tooling': '🔧',
};

export default async function DocsPage() {
  const [docs, menuItems] = await Promise.all([
    getDocPages(),
    getMenu('main'),
  ]);

  // Two-level grouping: Group (Packages, API, etc.) → Category (Data Layer, HTTP, etc.) → Docs
  const groupedByGroup = docs.reduce((acc, doc) => {
    const grp = doc.group?.name || 'Uncategorized';
    if (!acc[grp]) acc[grp] = [];
    acc[grp].push(doc);
    return acc;
  }, {} as Record<string, DocPage[]>);

  // Build dynamic group list (only groups with content)
  const groups = Object.keys(groupedByGroup)
    .filter((name) => name !== 'Uncategorized')
    .map((name) => ({
      name,
      icon: categoryIcons[name] || '📄',
      count: groupedByGroup[name].length,
    }));

  // If no groups assigned yet, fall back to category grouping
  const hasGroups = groups.length > 0;

  // For category-based fallback
  const grouped = docs.reduce((acc, doc) => {
    const cat = doc.category?.name || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, DocPage[]>);

  const categories = hasGroups ? groups : Object.keys(grouped)
    .filter((name) => name !== 'Uncategorized')
    .map((name) => ({
      name,
      icon: categoryIcons[name] || '📄',
      count: grouped[name].length,
    }));

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main style={{ paddingTop: 'calc(60px + var(--space-16))' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="eyebrow" style={{ margin: '0 auto var(--space-4)', justifyContent: 'center' }}>Documentation</div>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
              MonkeysLegion <span className="text-gradient">Docs</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 'var(--line-height-relaxed)' }}>
              Everything you need to build high-performance PHP applications with MonkeysLegion v2.0.
            </p>
          </div>

          {/* Group/Category cards — dynamic from Drupal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
            {categories.map((cat) => (
              <Link key={cat.name} href={`#${cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '')}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', transition: 'transform var(--transition-base), border-color var(--transition-base)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{cat.icon}</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>{cat.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{cat.count} {cat.count === 1 ? 'page' : 'pages'}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Doc listing — two-level when groups exist */}
          {docs.length > 0 ? (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>All Pages</h2>
              {hasGroups ? (
                // Two-level: Group → Category → Docs
                Object.entries(groupedByGroup).map(([groupName, groupDocs]) => {
                  // Sub-group by category within this group
                  const subGrouped = groupDocs.reduce((acc, doc) => {
                    const cat = doc.category?.name || 'General';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(doc);
                    return acc;
                  }, {} as Record<string, DocPage[]>);

                  return (
                    <div key={groupName} id={groupName.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '')} style={{ marginBottom: 'var(--space-8)', scrollMarginTop: '120px' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span>{categoryIcons[groupName] || '📄'}</span> {groupName}
                      </h3>
                      {Object.entries(subGrouped).map(([catName, catDocs]) => (
                        <div key={catName} style={{ marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)', borderLeft: '2px solid var(--color-border)' }}>
                          <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{catName}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {catDocs.map((doc) => (
                              <Link key={doc.id} href={`/docs/${doc.slug}`} style={{ display: 'block', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color var(--transition-base)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                {doc.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                // Fallback: single-level category grouping
                Object.entries(grouped).map(([category, categoryDocs]) => (
                  <div key={category} id={category.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '')} style={{ marginBottom: 'var(--space-6)', scrollMarginTop: '120px' }}>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>{category}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {categoryDocs.map((doc) => (
                        <Link key={doc.id} href={`/docs/${doc.slug}`} style={{ display: 'block', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color var(--transition-base)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
                          {doc.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>📚</div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Documentation Coming Soon</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 'var(--line-height-relaxed)' }}>
                Create documentation pages in the Drupal admin. They&apos;ll appear here with full sidebar navigation and search support.
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
