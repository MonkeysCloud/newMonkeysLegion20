'use client';

import { FeatureTile, AnimatedSection } from './ui';
import type { FeatureTileData } from '@/lib/types';

interface WhatsNewProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function WhatsNew({ title, description, children }: WhatsNewProps) {
  const displayTitle = title || "Everything changed. Nothing feels heavy.";
  const displayDesc = description || "v2.0 is a full architectural pass across the entire ecosystem. Every package is pinned to v2.0+ for API consistency, the DI container compiles to zero-overhead resolution, and PHP 8.4 property hooks replace magic across the board.";

  return (
    <section id="features" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            {displayTitle.includes('Nothing feels heavy.') ? (
              <>Everything changed.{' '}<span className="text-gradient">Nothing feels heavy.</span></>
            ) : (
              <span className="text-gradient">{displayTitle}</span>
            )}
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-12)' }}>
            {displayDesc}
          </p>
        </AnimatedSection>
        <div className="grid-3">
          {children}
        </div>
      </div>
    </section>
  );
}
