'use client';

import { AnimatedSection } from '../ui';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleGradient?: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function PageHero({ eyebrow, title, titleGradient, subtitle, children }: PageHeroProps) {
  return (
    <section style={{ padding: 'calc(var(--space-20) + 4rem) 0 var(--space-16)', background: 'linear-gradient(180deg, hsl(250, 30%, 8%) 0%, var(--color-bg) 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.08) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <AnimatedSection>
          {eyebrow && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              {eyebrow.split(/[\|·,]/).map((badge) => badge.trim()).filter(Boolean).map((badge, i) => (
                <span key={i} style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.01em', fontFamily: 'var(--font-code)', background: 'hsla(250, 40%, 12%, 0.8)', color: 'hsla(250, 90%, 78%, 1)', border: '1px solid hsla(250, 70%, 55%, 0.35)' }}>
                  {badge}
                </span>
              ))}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, maxWidth: '900px', margin: '0 auto var(--space-6)' }}>
            <span dangerouslySetInnerHTML={{ __html: title }} />{' '}
            {titleGradient && <span className="text-gradient" dangerouslySetInnerHTML={{ __html: titleGradient }} />}
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', maxWidth: '750px', margin: '0 auto var(--space-8)' }}>
            {subtitle}
          </p>
          {children && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', justifyContent: 'center' }}>
              {children}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
