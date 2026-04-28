'use client';

import { AnimatedSection } from './ui';

interface DeveloperExperienceProps { 
  title?: string;
  subtitle?: string;
  scaffoldingSlot?: React.ReactNode;
  databaseSlot?: React.ReactNode;
  operationsSlot?: React.ReactNode;
}

function CommandColumn({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div>
      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {children}
      </div>
    </div>
  );
}

export function CliCommandItem({ command }: { command: string }) {
  return (
    <code style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', display: 'block' }}>{command}</code>
  );
}

export default function DeveloperExperience({ 
  title = 'Seventeen scaffolders. <span class="text-gradient">One CLI.</span>',
  subtitle = 'Every major framework object has a make:* command.',
  scaffoldingSlot,
  databaseSlot,
  operationsSlot
}: DeveloperExperienceProps) {
  return (
    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />
        </AnimatedSection>
        <div className="grid-3">
          <AnimatedSection delay={0.1}><CommandColumn title="Scaffolding">{scaffoldingSlot}</CommandColumn></AnimatedSection>
          <AnimatedSection delay={0.2}><CommandColumn title="Database">{databaseSlot}</CommandColumn></AnimatedSection>
          <AnimatedSection delay={0.3}><CommandColumn title="Operations">{operationsSlot}</CommandColumn></AnimatedSection>
        </div>
      </div>
    </section>
  );
}
