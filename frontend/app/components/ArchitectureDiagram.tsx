'use client';

import { AnimatedSection } from './ui';
import type { ArchitectureLine } from '@/lib/types';

interface ArchitectureDiagramProps {
  title?: string;
  subtitle?: string;
  pipelineSteps: ArchitectureLine[];
  bootSteps: ArchitectureLine[];
}

export default function ArchitectureDiagram({ 
  title = 'How a request <span class="text-gradient">flows.</span>',
  subtitle,
  pipelineSteps, 
  bootSteps 
}: ArchitectureDiagramProps) {
  return (
    <section className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </AnimatedSection>
        <div className="grid-2" style={{ marginTop: 'var(--space-10)', gap: 'var(--space-8)' }}>
          <AnimatedSection delay={0.1}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Request Pipeline</h3>
            <div className="glass-card" style={{ padding: 'var(--space-5)', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', lineHeight: 2 }}>
              {pipelineSteps.map((line, idx) => <div key={idx} style={{ paddingLeft: line.indent * 20, color: line.color || 'var(--color-text-secondary)' }}>{line.label}</div>)}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Boot Sequence</h3>
            <div className="glass-card" style={{ padding: 'var(--space-5)', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', lineHeight: 2 }}>
              {bootSteps.map((line, idx) => <div key={idx} style={{ paddingLeft: line.indent * 16, color: line.color || 'var(--color-text-secondary)' }}>{line.label}</div>)}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
