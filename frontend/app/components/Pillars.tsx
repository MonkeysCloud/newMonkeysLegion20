'use client';

import { AnimatedSection } from './ui';
import type { PillarData } from '@/lib/types';

interface PillarsProps { children?: React.ReactNode; }

export default function Pillars({ children }: PillarsProps) {
  return (
    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Three promises.{' '}<span className="text-gradient">Kept by design.</span>
          </h2>
        </AnimatedSection>
        <div className="grid-3" style={{ marginTop: 'var(--space-12)' }}>
          {children}
        </div>
      </div>
    </section>
  );
}
