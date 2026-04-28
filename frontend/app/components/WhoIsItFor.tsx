'use client';

import { AnimatedSection } from './ui';

interface WhoIsItForProps {
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  tilesSlot?: React.ReactNode;
}

export default function WhoIsItFor({ 
  title = 'Built for ',
  titleGradient = 'five kinds of teams.',
  subtitle,
  tilesSlot
}: WhoIsItForProps) {
  return (
    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            <span dangerouslySetInnerHTML={{ __html: title }} />{' '}
            <span className="text-gradient" dangerouslySetInnerHTML={{ __html: titleGradient }} />
          </h2>
          {subtitle && <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
          {tilesSlot}
        </div>
      </div>
    </section>
  );
}
