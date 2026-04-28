'use client';

import { AnimatedSection } from './ui';

interface QuickStartProps {
  title?: string;
  subtitle?: string;
  stepsSlot?: React.ReactNode;
  requirementsSlot?: React.ReactNode;
}

export function QuickStartStepItem({ num, title, commands }: { num: string; title: string; commands: string[] }) {
  return (
    <AnimatedSection>
      <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--color-primary)', opacity: 0.3, marginBottom: 'var(--space-2)', fontFamily: 'var(--font-code)' }}>{num}</div>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {commands.map((cmd, ci) => (
            <code key={ci} style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', color: cmd.startsWith('#') ? 'var(--color-text-muted)' : 'var(--color-secondary)', padding: 'var(--space-2) var(--space-3)', background: 'hsla(230, 25%, 8%, 0.6)', borderRadius: 'var(--radius-sm)' }}>{cmd}</code>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

export function RequirementRowItem({ name, version }: { name: string; version: string }) {
  return (
    <tr>
      <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{name}</td>
      <td style={{ color: 'var(--color-text-secondary)' }}>{version}</td>
    </tr>
  );
}

export default function QuickStart({ 
  title = 'From zero to serving traffic <span class="text-gradient">in 90 seconds.</span>',
  subtitle,
  stepsSlot,
  requirementsSlot
}: QuickStartProps) {
  return (
    <section id="quickstart" className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </AnimatedSection>
        <div className="grid-3" style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-10)' }}>
          {stepsSlot}
        </div>
        <AnimatedSection delay={0.4}>
          <div className="table-wrapper" style={{ maxWidth: 600, margin: '0 auto' }}>
            <table>
              <thead><tr><th>Requirement</th><th>Version</th></tr></thead>
              <tbody>{requirementsSlot}</tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
