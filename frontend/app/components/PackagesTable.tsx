'use client';

import { AnimatedSection } from './ui';
import type { PackageData } from '@/lib/types';

interface PackagesTableProps { 
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PackagesTable({ 
  title = 'The <span class="text-gradient">ecosystem.</span>',
  subtitle = "MonkeysLegion is not a monolith. It's 26 independently-versioned Composer packages.",
  children
}: PackagesTableProps) {
  return (
    <section id="packages" className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />
        </AnimatedSection>
        {children && (
          <AnimatedSection delay={0.1}>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Package</th><th style={{ textAlign: 'center' }}>Version</th><th>Purpose</th><th style={{ textAlign: 'center' }}>Link</th></tr></thead>
                <tbody>
                  {children}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
