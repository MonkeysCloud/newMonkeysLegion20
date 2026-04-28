'use client';

import { AnimatedSection } from './ui';

interface TestingProductionProps {
  title?: string;
  subtitle?: string;
  testDescription?: string;
  suitesSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
}

export function TestSuiteItem({ label }: { label: string }) {
  return (
    <li style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-5)', position: 'relative' }}>
      <span style={{ position: 'absolute', left: 0, color: 'var(--color-success)' }}>✓</span>{label}
    </li>
  );
}

export function ProductionCheckItem({ header, code }: { header: string; code: string }) {
  return (
    <div className="code-block">
      <div className="code-header">{header}</div>
      <div className="code-body" style={{ fontSize: 'var(--text-xs)' }}>
        <pre style={{ margin: 0 }}>{code}</pre>
      </div>
    </div>
  );
}

export default function TestingProduction({ 
  title = 'Tested. Compiled. <span class="text-gradient">Ready.</span>',
  subtitle,
  testDescription = 'Every package ships with its own PHPUnit 11 suite. The framework meta-test suite covers <strong style="color: var(--color-secondary)">182 tests across 440 assertions</strong>:',
  suitesSlot,
  checklistSlot
}: TestingProductionProps) {
  return (
    <section className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </AnimatedSection>
        <div className="grid-2" style={{ marginTop: 'var(--space-10)', gap: 'var(--space-8)' }}>
          <AnimatedSection delay={0.1}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Test Suite</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--line-height-relaxed)' }} dangerouslySetInnerHTML={{ __html: testDescription }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {suitesSlot}
            </ul>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Production Checklist</h3>
            {checklistSlot}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
