'use client';

import { TerminalAnimation, AnimatedSection } from './ui';
import type { HeroData } from '@/lib/types';

interface HeroProps {
  data: HeroData;
  children?: React.ReactNode;
}

export default function Hero({ data, children }: HeroProps) {
  return (
    <section id="hero" className="section" style={{
      paddingTop: 'calc(var(--space-32) + 60px)',
      paddingBottom: 'var(--space-24)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: 800,
        background: 'radial-gradient(ellipse 70% 60% at 50% 30%, hsla(250, 95%, 45%, 0.15), hsla(250, 95%, 25%, 0.05), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <AnimatedSection>
          {(() => {
            const raw = data as any;
            const badgesProp = raw.badges;
            let badgesArr: string[] = [];
            if (Array.isArray(badgesProp)) badgesArr = badgesProp;
            else if (typeof badgesProp === 'string') badgesArr = badgesProp.split(',').map((s: string) => s.trim()).filter(Boolean);

            if (badgesArr.length > 1) {
              // Multiple badges → render as individual pills
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                  {badgesArr.map((badge, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      padding: '0.35rem 1rem',
                      borderRadius: '999px',
                      background: 'hsla(250, 40%, 12%, 0.8)',
                      border: '1px solid hsla(250, 70%, 55%, 0.35)',
                      color: 'hsla(250, 90%, 78%, 1)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                      fontFamily: 'var(--font-code)',
                    }}>{badge}</span>
                  ))}
                </div>
              );
            }

            // Single badge or versionBadge → show as eyebrow pill
            return (
              <div className="eyebrow animate-pulse-glow" style={{
                margin: '0 auto var(--space-8)',
                padding: 'var(--space-2) var(--space-5)',
                background: 'hsla(250, 90%, 65%, 0.1)',
                border: '1px solid hsla(250, 90%, 65%, 0.25)',
                boxShadow: '0 0 20px hsla(250, 90%, 65%, 0.15), inset 0 0 10px hsla(250, 90%, 65%, 0.1)',
              }}>
                <span style={{ color: '#fff', marginRight: 'var(--space-2)' }}>✨</span> {badgesArr[0] || data.versionBadge}
              </div>
            );
          })()}
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900,
            lineHeight: 1.05, marginBottom: 'var(--space-6)', letterSpacing: '-0.04em',
            textShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}>
            {data.title.includes('PHP 8.4') ? (
              <>The attribute-first PHP framework{' '}<span className="text-gradient" style={{ background: 'linear-gradient(135deg, hsl(0, 0%, 100%), hsl(250, 95%, 75%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>built for PHP 8.4.</span></>
            ) : (
              <span className="text-gradient" style={{ background: 'linear-gradient(135deg, hsl(0, 0%, 100%), hsl(250, 95%, 75%), hsl(250, 95%, 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{data.title}</span>
            )}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p style={{
            fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)',
            maxWidth: 800, margin: '0 auto var(--space-8)', lineHeight: 'var(--line-height-relaxed)',
          }}
            dangerouslySetInnerHTML={{ __html: data.subtitle }}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            {children ? children : (() => {
              let btns = [];
              const raw = data as any;
              
              // Map sequential CTA fields from CMS
              for (let i = 1; i <= 4; i++) {
                if (raw[`cta_${i}_text`]) {
                  btns.push({ 
                    text: raw[`cta_${i}_text`], 
                    url: raw[`cta_${i}_url`] || '#', 
                    style: raw[`cta_${i}_style`] || 'primary' 
                  });
                }
              }
              
              // Fallback for legacy Next.js data if empty
              if (btns.length === 0) {
                btns = [
                  { text: raw.primaryCtaText || 'Read More', url: raw.primaryCtaUrl || '#', style: 'primary' },
                  { text: raw.secondaryCtaText || 'Learn More', url: raw.secondaryCtaUrl || '#', style: 'secondary' }
                ];
              }

              return btns.map((btn: any, idx: number) => {
                const isPrimary = btn.style === 'primary';
                const className = isPrimary ? "btn btn-primary btn-lg animate-pulse-glow" : "btn btn-secondary btn-lg";
                return (
                  <a key={idx} href={btn.url} target={!isPrimary ? "_blank" : undefined} rel={!isPrimary ? "noopener noreferrer" : undefined} className={className}>
                    {btn.text}
                  </a>
                );
              });
            })()}
          </div>
        </AnimatedSection>



        <AnimatedSection delay={0.5}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TerminalAnimation />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
