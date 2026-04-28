'use client';

import { AnimatedSection, CodeTabs } from './ui';
import type { CodeTabData } from '@/lib/types';

interface CodeShowcaseProps { 
  title?: string;
  subtitle?: string;
  tabs: CodeTabData[]; 
}

export default function CodeShowcase({ 
  title = 'Show, <span class="text-gradient">don\'t tell.</span>',
  subtitle = 'Four representative patterns that define the v2.0 developer experience.',
  tabs 
}: CodeShowcaseProps) {
  return (
    <section className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />
        </AnimatedSection>
        <AnimatedSection delay={0.15}><CodeTabs tabs={tabs} /></AnimatedSection>
      </div>
    </section>
  );
}
