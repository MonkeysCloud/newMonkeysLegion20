'use client';

import { AnimatedSection } from './ui';
import type { SecurityFeatureData, StatusValue } from '@/lib/types';

interface SecurityMatrixProps { 
  children?: React.ReactNode; 
  title?: string;
  subtitle?: string;
  footer_note?: string;
}

export default function SecurityMatrix({ children, title, subtitle, footer_note }: SecurityMatrixProps) {
  const displayTitle = title || "Secure by default — not \"secure once you install five packages.\"";
  const displaySubtitle = subtitle || "A direct, feature-by-feature comparison of what ships in the box versus what requires additional packages, configuration, or third-party bundles.";
  const displayFooter = footer_note || "Every ⚠️ or ❌ in Laravel or Symfony is a decision your team has to make: which package, which version, who maintains it, does it still work after the next major release, who reviewed its CVE history. MonkeysLegion removes those decisions from your backlog.";

  return (
    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            {displayTitle.includes('once you install five') ? (
              <>Secure by default —{' '}<span className="text-gradient">not &ldquo;secure once you install five packages.&rdquo;</span></>
            ) : (
              <span className="text-gradient">{displayTitle}</span>
            )}
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }}>
            {displaySubtitle}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Security Feature</th><th style={{ textAlign: 'center' }}>MonkeysLegion v2.0</th><th style={{ textAlign: 'center' }}>Laravel 11</th><th style={{ textAlign: 'center' }}>Symfony 7</th></tr></thead>
              <tbody>
                {children}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <div className="glass-card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-8)', borderLeft: '3px solid var(--color-primary)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', whiteSpace: 'pre-wrap' }}>
              {displayFooter}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
