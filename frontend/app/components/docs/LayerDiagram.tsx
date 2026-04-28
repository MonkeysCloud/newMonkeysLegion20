'use client';

import { AnimatedSection } from '../ui';

interface LayerDiagramProps {
  title?: string;
  layers: { label: string; detail: string; color: string }[];
}

export default function LayerDiagram({ title, layers }: LayerDiagramProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
        {title && <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-5)', textAlign: 'center' }}>{title}</h3>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {layers.map((layer, idx) => (
            <div key={idx} style={{
              padding: '1rem 1.5rem',
              background: `${layer.color}15`,
              border: `1px solid ${layer.color}30`,
              borderRadius: idx === 0 ? '12px 12px 4px 4px' : idx === layers.length - 1 ? '4px 4px 12px 12px' : '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-sm)', fontWeight: 600, color: layer.color }}>{layer.label}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'right' }}>{layer.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
