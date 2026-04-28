'use client';

import { AnimatedSection } from '../ui';

interface ProseSectionProps {
  title?: string;
  children: React.ReactNode;
  id?: string;
}

export default function ProseSection({ title, children, id }: ProseSectionProps) {
  return (
    <AnimatedSection>
      <section id={id} style={{ padding: 'var(--space-10) 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {title && (
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>
              {title}
            </h2>
          )}
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
            {children}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
