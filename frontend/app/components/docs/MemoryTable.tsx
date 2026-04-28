'use client';

import { AnimatedSection } from '../ui';

interface MemoryTableProps {
  title?: string;
  rows: { strategy: string; useCase: string }[];
}

export default function MemoryTable({ title, rows }: MemoryTableProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '800px', margin: 'var(--space-6) auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        {title && <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, padding: '0.75rem 1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', margin: 0 }}>{title}</h3>}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface)' }}>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>Strategy</th>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>Use case</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '0.6rem 1rem', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)' }}>{row.strategy}</td>
                <td style={{ padding: '0.6rem 1rem', color: 'var(--color-text-secondary)' }}>{row.useCase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedSection>
  );
}
