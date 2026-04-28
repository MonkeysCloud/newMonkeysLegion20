'use client';

import { AnimatedSection } from './ui';

interface CommunityProps {
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  ctaHeading?: string;
  terminalCommand?: string;
  linksSlot?: React.ReactNode;
  buttonsSlot?: React.ReactNode;
}

export function CommunityLinkItem({ icon, label, url }: { icon: string; label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>{label}
    </a>
  );
}

export function CtaButtonItem({ label, url, variant = 'primary' }: { label: string; url: string; variant?: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`btn btn-${variant} btn-lg`}>{label}</a>
  );
}

export default function Community({ 
  title = 'Join the',
  titleGradient = 'build.',
  subtitle = 'MonkeysLegion is MIT-licensed and actively developed in the open.',
  ctaHeading = 'Ready to ship?',
  terminalCommand = 'composer create-project monkeyscloud/monkeyslegion-skeleton my-app',
  linksSlot,
  buttonsSlot
}: CommunityProps) {
  return (
    <section id="docs" className="section" style={{ background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <AnimatedSection>
          <h2 className="section-title">
            <span dangerouslySetInnerHTML={{ __html: title }} />{' '}
            <span className="text-gradient" dangerouslySetInnerHTML={{ __html: titleGradient }} />
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto var(--space-10)' }} dangerouslySetInnerHTML={{ __html: subtitle }} />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
            {linksSlot}
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-5)' }} dangerouslySetInnerHTML={{ __html: ctaHeading }} />
          <div className="terminal" style={{ maxWidth: 650, margin: '0 auto var(--space-6)' }}>
            <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
            <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">{terminalCommand}</span></div></div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {buttonsSlot}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
