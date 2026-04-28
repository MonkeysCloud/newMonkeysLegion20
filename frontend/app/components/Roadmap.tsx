'use client';

import { AnimatedSection } from './ui';

interface RoadmapProps {
  title?: string;
  titleGradient?: string;
  shippedSlot?: React.ReactNode;
  comingSlot?: React.ReactNode;
  visionSlot?: React.ReactNode;
}

export function RoadmapItem({ label, accentColor = 'var(--color-primary-light)' }: { label: string; accentColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${accentColor}`, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
      {label}
    </div>
  );
}

export default function Roadmap({ 
  title = "Where we're",
  titleGradient = 'going.',
  shippedSlot,
  comingSlot,
  visionSlot
}: RoadmapProps) {
  return (
    <section className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            <span dangerouslySetInnerHTML={{ __html: title }} />{' '}
            <span className="text-gradient" dangerouslySetInnerHTML={{ __html: titleGradient }} />
          </h2>
        </AnimatedSection>
        <div className="grid-3" style={{ marginTop: 'var(--space-10)', gap: 'var(--space-8)' }}>
          <AnimatedSection delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Shipped in v2.0</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {shippedSlot}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: '1.5rem' }}>🔜</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Coming in v2.1</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {comingSlot}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: '1.5rem' }}>🔮</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>v3.0 vision</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {visionSlot}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
