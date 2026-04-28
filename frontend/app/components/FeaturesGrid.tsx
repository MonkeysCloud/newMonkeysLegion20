'use client';

import { FeatureTile, AnimatedSection } from './ui';
import type { FeatureTileData } from '@/lib/types';

interface FeaturesGridProps { 
  title?: string;
  tiles?: React.ReactNode; 
}

export default function FeaturesGrid({ 
  title = 'Nineteen capabilities. <span class="text-gradient">One <code style="font-family: var(--font-code); font-size: 0.85em">composer install</code></span>.',
  tiles 
}: FeaturesGridProps) {
  return (
    <section className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
        </AnimatedSection>
        {tiles && (
          <div className="grid-3" style={{ marginTop: 'var(--space-10)' }}>
            {tiles}
          </div>
        )}
      </div>
    </section>
  );
}
