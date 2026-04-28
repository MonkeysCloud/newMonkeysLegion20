'use client';

import { useState } from 'react';
import type { DocPage } from '@/lib/drupal';

interface DocSidebarProps {
  pages: DocPage[];
  activeSlug: string;
  versions: string[];
  currentVersion: string;
}

export default function DocSidebar({ pages, activeSlug, versions, currentVersion }: DocSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Group pages by category
  const grouped = pages.reduce((acc, page) => {
    const cat = page.category?.name || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {} as Record<string, DocPage[]>);

  return (
    <aside className="doc-sidebar" style={{
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-bg)',
      padding: 'var(--space-6) 0',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: 64,
      overflowY: 'auto',
      fontSize: 'var(--text-sm)',
    }}>
      {/* Version Switcher */}
      {versions.length > 1 && (
        <div style={{ padding: '0 var(--space-5) var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Version
          </label>
          <select
            value={currentVersion}
            onChange={(e) => {
              const v = e.target.value;
              window.location.href = activeSlug
                ? `/docs/${activeSlug}?v=${v}`
                : `/docs?v=${v}`;
            }}
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-code)',
              cursor: 'pointer',
            }}
          >
            {versions.map((v) => (
              <option key={v} value={v}>v{v}</option>
            ))}
          </select>
        </div>
      )}

      {/* Version badge if single */}
      {versions.length <= 1 && (
        <div style={{ padding: '0 var(--space-5) var(--space-4)' }}>
          <span style={{
            display: 'inline-block',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-code)',
            fontWeight: 600,
            padding: '0.2rem 0.5rem',
            borderRadius: '999px',
            background: 'hsla(250, 95%, 65%, 0.12)',
            color: 'hsl(250, 95%, 75%)',
          }}>
            v{currentVersion}
          </span>
        </div>
      )}

      {/* Category Groups */}
      {Object.entries(grouped).map(([category, categoryPages]) => (
        <div key={category} style={{ marginBottom: 'var(--space-2)' }}>
          <button
            onClick={() => setCollapsed(prev => ({ ...prev, [category]: !prev[category] }))}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: 'var(--space-2) var(--space-5)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.05em', color: 'var(--color-text-muted)',
              textAlign: 'left',
            }}
          >
            {category}
            <span style={{ transform: collapsed[category] ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.15s', fontSize: '0.6rem' }}>▼</span>
          </button>

          {!collapsed[category] && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categoryPages.map((page) => {
                const isActive = page.slug === activeSlug;
                return (
                  <li key={page.id}>
                    <a
                      href={`/docs/${page.slug}${currentVersion !== '2.0' ? `?v=${currentVersion}` : ''}`}
                      style={{
                        display: 'block',
                        padding: '0.35rem var(--space-5) 0.35rem var(--space-7)',
                        color: isActive ? 'hsl(250, 95%, 75%)' : 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? '2px solid hsl(250, 95%, 65%)' : '2px solid transparent',
                        background: isActive ? 'hsla(250, 95%, 65%, 0.06)' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {page.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}

      {/* Empty State */}
      {pages.length === 0 && (
        <div style={{ padding: 'var(--space-8) var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>No documentation pages yet.</p>
          <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>Create pages in Drupal admin.</p>
        </div>
      )}
    </aside>
  );
}
