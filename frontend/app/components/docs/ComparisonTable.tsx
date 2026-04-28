'use client';

import { AnimatedSection } from '../ui';

interface ComparisonTableProps {
  title?: string;
  columns: string[];
  rows: { capability: string; values: string[] }[];
}

function statusStyle(val: string): React.CSSProperties {
  if (val.startsWith('✅')) return { color: 'var(--color-success)', fontWeight: 600 };
  if (val.startsWith('⚠️')) return { color: 'var(--color-warning)' };
  if (val.startsWith('❌')) return { color: 'hsl(0, 70%, 60%)' };
  return { color: 'var(--color-text-secondary)' };
}

export default function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '900px', margin: 'var(--space-10) auto', overflow: 'hidden' }}>
        {title && <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{title}</h3>}
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                {columns.map((col, i) => (
                  <th key={i} style={{ padding: '0.75rem 1rem', textAlign: i === 0 ? 'left' : 'center', fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td style={{ padding: '0.6rem 1rem', fontWeight: 500, color: 'var(--color-text)' }}>{row.capability}</td>
                  {row.values.map((val, vi) => (
                    <td key={vi} style={{ padding: '0.6rem 1rem', textAlign: 'center', ...statusStyle(val) }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedSection>
  );
}
