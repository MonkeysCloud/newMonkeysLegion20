'use client';

import { AnimatedSection, CountUpNumber } from './ui';
import type { BenchmarkData } from '@/lib/types';

interface BenchmarksProps { 
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  test_environment?: string;
}

const reasons = [
  { bold: 'Zero-magic architecture', text: '— Entities, DTOs, and enums are plain PHP objects.' },
  { bold: 'PHP 8.4 property hooks', text: '— Validation and formatting run as native engine hooks.' },
  { bold: 'No ORM hydration overhead', text: '— Entities are POPOs. No Doctrine or Eloquent proxies.' },
  { bold: 'Attribute routing', text: '— Compiled once at cache time. No regex matching at runtime.' },
  { bold: 'Lean PSR-15 pipeline', text: "— ~12.5K req/s HTTP throughput vs Laravel's ~2.1K req/s." },
];

export default function Benchmarks({ children, title, subtitle, test_environment }: BenchmarksProps) {
  const displayTitle = title || "Benchmarked, not marketed.";
  const displaySubtitle = subtitle || test_environment || "All numbers produced on Apple Silicon with PHP 8.5.3, no opcache preloading, warm JIT, identical test harnesses.";

  return (
    <section id="benchmarks" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            <span className="text-gradient">{displayTitle}</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }}>
            {displaySubtitle}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="table-wrapper" style={{ marginBottom: 'var(--space-10)' }}>
            <table>
              <thead><tr><th>Operation</th><th style={{ textAlign: 'right' }}>MonkeysLegion Ops/sec</th><th>vs Laravel</th><th>vs Symfony</th></tr></thead>
              <tbody>
                {children}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
        <div className="grid-2" style={{ gap: 'var(--space-10)' }}>
          <AnimatedSection delay={0.2}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Why we win</h3>
            <ol style={{ listStyle: 'none', counterReset: 'reasons' }}>
              {reasons.map((r, idx) => (
                <li key={idx} style={{ marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-6)', position: 'relative', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                  <span style={{ position: 'absolute', left: 0, top: 1, color: 'var(--color-primary-light)', fontWeight: 700, fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)' }}>{String(idx + 1).padStart(2, '0')}</span>
                  <strong style={{ color: 'var(--color-text)' }}>{r.bold}</strong> {r.text}
                </li>
              ))}
            </ol>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Great frameworks, different trade-offs</h3>
            <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', lineHeight: 'var(--line-height-relaxed)' }}>
                <strong style={{ color: 'hsl(10, 85%, 65%)' }}>Laravel</strong> built an incredible ecosystem — Forge, Vapor, Nova, Cashier — and the largest PHP community. If you need a batteries-included SaaS starter, it&apos;s hard to beat.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', lineHeight: 'var(--line-height-relaxed)' }}>
                <strong style={{ color: 'hsl(190, 70%, 55%)' }}>Symfony</strong> powers some of the most mission-critical enterprise systems on earth. Its profiler, debug toolbar, and rigorous release cycle are best-in-class.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--line-height-relaxed)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <strong style={{ color: 'var(--color-primary-light)' }}>MonkeysLegion</strong> is built for a different moment: when you need raw throughput, zero-magic PHP 8.4+ code, and a framework that gets out of your way. No 22 MB boot. No runtime proxies. Just your code.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
