'use client';

import { AnimatedSection, FeatureTile } from './ui';
import type { FeatureTileData } from '@/lib/types';

interface ApexSpotlightProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  proofText?: string;
  docsUrl?: string;
  githubUrl?: string;
  mainTiles?: React.ReactNode;
  secondaryTiles?: React.ReactNode;
  comparisonRows?: React.ReactNode;
}

export default function ApexSpotlight({
  title = 'The first PHP framework with an AI orchestration engine <span class="text-gradient-orange">built in.</span>',
  subtitle = 'Not a wrapper. A <strong style="color: var(--color-text)">complete AI infrastructure layer</strong> with multi-model routing, declarative pipelines, guardrails, and cost optimization.',
  eyebrow = 'First in PHP · monkeyslegion-apex@1.0.1',
  proofText = 'Apex ships with <strong style="color: var(--color-secondary)">363 tests across 705 assertions</strong>.',
  docsUrl = 'https://monkeyslegion.com/docs/apex',
  githubUrl = 'https://github.com/MonkeysCloud/MonkeysLegion-Apex',
  mainTiles,
  secondaryTiles,
  comparisonRows
}: ApexSpotlightProps) {
  return (
    <section id="apex" className="section" style={{ background: 'linear-gradient(180deg, hsl(250, 30%, 8%) 0%, hsl(230, 25%, 7%) 50%, hsl(250, 30%, 8%) 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, hsla(250, 85%, 50%, 0.1), transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <AnimatedSection>
          <div className="eyebrow" style={{ margin: '0 auto var(--space-4)', justifyContent: 'center' }}>{eyebrow}</div>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: 'var(--text-4xl)' }} dangerouslySetInnerHTML={{ __html: title }} />
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-12)', maxWidth: 800 }} dangerouslySetInnerHTML={{ __html: subtitle }} />
        </AnimatedSection>
        
        {mainTiles && (
          <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
            {mainTiles}
          </div>
        )}
        
        {secondaryTiles && (
          <div className="grid-4" style={{ marginBottom: 'var(--space-12)' }}>
            {secondaryTiles}
          </div>
        )}

        {proofText && (
          <AnimatedSection delay={0.1}>
            <div className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center', marginBottom: 'var(--space-12)', border: '1px solid hsla(250, 85%, 60%, 0.2)' }}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }} dangerouslySetInnerHTML={{ __html: proofText }} />
            </div>
          </AnimatedSection>
        )}

        {comparisonRows && (
          <AnimatedSection delay={0.15}>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              What used to take <span className="text-gradient-orange">5 packages</span>
            </h3>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Capability</th><th style={{ textAlign: 'center' }}>Apex</th><th>Python</th><th>Node.js</th><th>Laravel</th></tr></thead>
                <tbody>
                  {comparisonRows}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
        <AnimatedSection delay={0.2}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-10)' }}>
            <a href="https://monkeyslegion.com/docs/apex" className="btn btn-primary">Read the Apex docs →</a>
            <a href="https://github.com/MonkeysCloud/MonkeysLegion-Apex" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View on GitHub →</a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
