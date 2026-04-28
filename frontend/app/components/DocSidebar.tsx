'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarDoc {
  id: string;
  title: string;
  slug: string;
  category?: { id: string; name: string };
}

interface SidebarGroup {
  label: string;
  items: SidebarDoc[];
}

interface DocSidebarProps {
  items: SidebarDoc[];
  currentSlug: string;
}

/**
 * Multi-level documentation sidebar.
 * Automatically groups docs by path structure:
 *   - "getting-started" → top-level
 *   - "package/core" → grouped under "Packages"
 *   - "guide/routing" → grouped under "Guides"
 */
export default function DocSidebar({ items, currentSlug }: DocSidebarProps) {
  // Build groups from slug path segments
  const groups: SidebarGroup[] = [];
  const topLevel: SidebarDoc[] = [];

  const groupMap = new Map<string, SidebarDoc[]>();

  for (const item of items) {
    const parts = item.slug.split('/');
    if (parts.length > 1) {
      // Nested: first segment is the group key
      const groupKey = parts[0];
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(item);
    } else {
      topLevel.push(item);
    }
  }

  // Convert group keys to readable labels
  const labelMap: Record<string, string> = {
    package: 'Packages',
    packages: 'Packages',
    guide: 'Guides',
    guides: 'Guides',
    api: 'API Reference',
    tutorial: 'Tutorials',
    tutorials: 'Tutorials',
  };

  for (const [key, docs] of groupMap) {
    groups.push({
      label: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
      items: docs,
    });
  }

  // Track which groups are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand the group containing the current page
    const init: Record<string, boolean> = {};
    for (const g of groups) {
      const isActive = g.items.some((i) => i.slug === currentSlug);
      init[g.label] = isActive;
    }
    return init;
  });

  const toggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const linkStyle = (slug: string) => ({
    display: 'block',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: slug === currentSlug ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
    background: slug === currentSlug ? 'hsla(250, 85%, 60%, 0.1)' : 'transparent',
    fontWeight: slug === currentSlug ? 600 : 400,
    textDecoration: 'none' as const,
    transition: 'all 0.15s ease',
  });

  return (
    <aside
      className="doc-sidebar"
      style={{
        position: 'sticky',
        top: 'calc(60px + var(--space-8))',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        padding: 'var(--space-4) 0',
      }}
    >
      <Link
        href="/docs"
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          color: 'var(--color-primary-light)',
          marginBottom: 'var(--space-4)',
          display: 'block',
        }}
      >
        ← All Docs
      </Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {/* Top-level items */}
        {topLevel.map((item) => (
          <Link key={item.id} href={`/docs/${item.slug}`} style={linkStyle(item.slug)}>
            {item.title}
          </Link>
        ))}

        {/* Grouped items */}
        {groups.map((group) => (
          <div key={group.label} style={{ marginTop: 'var(--space-3)' }}>
            <button
              onClick={() => toggle(group.label)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-3)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-text-muted)',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.15s ease',
              }}
            >
              <span>{group.label}</span>
              <span
                style={{
                  transform: expanded[group.label] ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  fontSize: '0.7em',
                }}
              >
                ▶
              </span>
            </button>

            {expanded[group.label] && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  paddingLeft: 'var(--space-3)',
                  borderLeft: '1px solid var(--color-border)',
                  marginLeft: 'var(--space-3)',
                  marginTop: 'var(--space-1)',
                }}
              >
                {group.items.map((item) => (
                  <Link key={item.id} href={`/docs/${item.slug}`} style={linkStyle(item.slug)}>
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
