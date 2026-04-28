'use client';

import { AnimatedSection } from '../ui';

interface CodeBlockProps {
  language?: string;
  header?: string;
  code: string;
}

export default function CodeBlock({ language = 'php', header, code }: CodeBlockProps) {
  return (
    <AnimatedSection>
      <div style={{ maxWidth: '800px', margin: 'var(--space-6) auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            </div>
            {header && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-code)' }}>{header}</span>}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{language}</span>
        </div>
        <pre style={{ margin: 0, padding: '1rem 1.25rem', background: 'hsl(240, 20%, 8%)', fontSize: 'var(--text-xs)', lineHeight: 1.7, overflowX: 'auto', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-code)' }}>
          <code>{code}</code>
        </pre>
      </div>
    </AnimatedSection>
  );
}
