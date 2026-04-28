'use client';

import { AnimatedSection } from '../ui';

interface MigrationTableProps {
  title?: string;
  fromLabel: string;
  toLabel: string;
  rows: { from: string; to: string }[];
}

export default function MigrationTable({ title, fromLabel, toLabel, rows }: MigrationTableProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '800px', margin: 'var(--space-6) auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        {title && <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, padding: '0.75rem 1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', margin: 0 }}>{title}</h3>}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface)' }}>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', width: '50%' }}>{fromLabel}</th>
              <th style={{ padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(250, 95%, 75%)', borderBottom: '1px solid var(--color-border)', width: '50%' }}>{toLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '0.6rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)' }}>{row.from}</td>
                <td style={{ padding: '0.6rem 1rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)' }}>{row.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedSection>
  );
}
