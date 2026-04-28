'use client';

import { AnimatedSection } from '../ui';

interface FeatureListProps {
  title?: string;
  items: { icon?: string; text: string }[];
  columns?: number;
}

export default function FeatureList({ title, items, columns = 1 }: FeatureListProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '800px', margin: 'var(--space-6) auto' }}>
        {title && <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{title}</h3>}
        <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 'var(--space-3)', padding: 0, margin: 0 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
              <span style={{ flexShrink: 0, color: item.icon ? 'inherit' : 'var(--color-success)', marginTop: '2px' }}>{item.icon || '✓'}</span>
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
