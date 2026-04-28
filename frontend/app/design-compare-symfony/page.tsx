'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import ComparisonTable from '../components/docs/ComparisonTable';
import MigrationTable from '../components/docs/MigrationTable';
import { AnimatedSection } from '../components/ui';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

export function CompareSymfonyContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <CompareSymfonyInner menuItems={menuItems} />;
}



const symfonyWins = [
  { icon: '🏢', title: 'Enterprise track record', desc: 'Symfony powers Drupal, eZ Platform, Shopware 6, Sylius. If "will this still be maintained in 10 years" is a board-level question, Symfony has a decade of proof. MonkeysLegion is building that record now.' },
  { icon: '🗄️', title: 'Doctrine ORM', desc: 'Entity manager, unit of work, change tracking, lazy loading, inheritance mapping, DQL. If your domain model is complex, Doctrine has thought about your edge case.' },
  { icon: '🔬', title: 'Debug toolbar & Profiler', desc: 'Request timing, query counts, mailer previews, cache hits — all visible in a sticky panel. Unmatched for dev debugging.' },
  { icon: '🧩', title: 'Bundles ecosystem', desc: 'KnpMenu, NelmioCors, LexikJWT, VichUploader, SonataAdmin — a deep bench of enterprise-flavored bundles.' },
  { icon: '🔒', title: 'LTS stability commitment', desc: '3+ years of security patches per LTS release. MonkeysLegion is enterprise-grade but hasn\'t shipped an LTS yet — that\'s coming.' },
  { icon: '📋', title: 'Standards conformance', desc: 'Symfony is often where PSRs get drafted. Rigorously standards-driven — an asset in regulated industries.' },
];

const mlWins = [
  { icon: '🪶', title: 'Lighter footprint', desc: 'Cold-boot memory is ~4MB vs Symfony\'s ~14MB. Entity creation benchmarks come in ~114× faster (MonkeysLegion entities are POPOs; Doctrine wraps them in reflection-backed proxies).' },
  { icon: '🏷️', title: 'Attribute-native. Not "also supports attributes."', desc: 'Symfony added attribute support on top of YAML/XML/annotation-based configuration. MonkeysLegion is attribute-first from the ground up — no YAML routing, no annotation fallback, no "three ways to define the same thing."' },
  { icon: '✂️', title: 'Less ceremony', desc: 'Fewer abstraction layers between you and the response. No AbstractController hierarchy, no FormType builders, no Configuration tree classes for config files.' },
  { icon: '🔮', title: 'PHP 8.4 baseline', desc: 'Property hooks used across the framework. Symfony supports PHP 8.2+ and can\'t commit to 8.4 features as baseline yet.' },
  { icon: '🤖', title: 'AI orchestration in the box', desc: 'Apex is first-party. Symfony requires a custom bundle + an OpenAI wrapper + LexikJWT-style patterns for multi-provider routing.' },
  { icon: '🚀', title: 'Simpler dev experience', desc: 'composer create-project to a running app in 90 seconds. Symfony\'s learning curve is steeper — the service container, bundles, event subscribers, and form types take weeks to fully internalize.' },
];

const featureComparison = [
  { capability: 'PHP minimum', values: ['8.4', '8.2'] },
  { capability: 'Routing', values: ['✅ Attribute-first', '⚠️ Attribute or YAML'] },
  { capability: 'DTO validation', values: ['✅ #[Assert\\*] with DTO binding', '✅ Validator component (mature)'] },
  { capability: 'DI container', values: ['✅ Compiled, attribute-discovered', '✅ Compiled, YAML/XML/attribute'] },
  { capability: 'Argon2id password default', values: ['✅', '⚠️ Configurable (bcrypt default)'] },
  { capability: 'JWT authentication', values: ['✅ Core', '❌ LexikJWTAuthenticationBundle'] },
  { capability: 'TOTP 2FA', values: ['✅ Core', '❌ scheb/2fa-bundle'] },
  { capability: 'OAuth2', values: ['✅ Core (Google, GitHub)', '❌ KnpUOAuth2ClientBundle'] },
  { capability: 'OWASP security headers', values: ['✅ Default middleware', '⚠️ NelmioSecurityBundle'] },
  { capability: 'CORS', values: ['✅ Default middleware', '⚠️ NelmioCorsBundle'] },
  { capability: 'Rate limiting', values: ['✅ Default middleware', '⚠️ RateLimiter component wiring'] },
  { capability: 'AI orchestration', values: ['✅ Apex (first-party)', '❌ Not available'] },
  { capability: 'MCP server + client', values: ['✅ Apex', '❌ Not available'] },
  { capability: 'OpenAPI v3', values: ['✅ Core', '⚠️ NelmioApiDocBundle'] },
  { capability: 'Queue system', values: ['✅ Core', '✅ Messenger component'] },
  { capability: 'Mature ORM', values: ['⚠️ QueryBuilder + Entity', '✅ Doctrine'] },
  { capability: 'Debug toolbar', values: ['❌ Telemetry-based', '✅ Web Profiler'] },
  { capability: 'Admin generator', values: ['❌ Not available', '✅ EasyAdmin, Sonata'] },
  { capability: 'LTS policy', values: ['Not yet', '✅ 3-year LTS'] },
];

const migrationRows = [
  { from: 'Controller + route attributes', to: 'Controller + #[Route] attributes (similar)' },
  { from: 'FormType classes', to: 'readonly DTOs with #[Assert\\*] attributes' },
  { from: 'Doctrine entities', to: 'Entity classes with #[Entity], #[Field] (simpler)' },
  { from: 'services.yaml', to: '#[Provider]-discovered service providers' },
  { from: 'config/packages/*.yaml', to: 'config/*.mlc files' },
  { from: 'bin/console', to: 'php ml' },
  { from: 'Twig templates', to: 'MLView templates ({{ }} and @ directives)' },
  { from: 'Event subscribers', to: '#[Listener]-discovered PSR-14 listeners' },
  { from: 'Messenger queues', to: 'monkeyslegion-queue (similar patterns)' },
  { from: 'Validator component', to: 'monkeyslegion-validation (attribute-based)' },
  { from: 'Security bundle', to: 'monkeyslegion-auth (JWT + OAuth2 + 2FA)' },
];

function CompareSymfonyInner({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        {/* HERO */}
        <PageHero
          eyebrow="Honest comparison · Last updated April 2026"
          title="Symfony vs MonkeysLegion: two enterprise-grade"
          titleGradient="approaches."
          subtitle="Symfony is the PHP framework enterprise bet on for the last decade. MonkeysLegion is the one built for the next. This page compares them directly so you can make an informed choice."
        />

        {/* WHERE SYMFONY WINS */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Where <span style={{ color: '#18b2e0' }}>Symfony</span> wins.</h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}>
              {symfonyWins.map((item, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.05}>
                  <div className="glass-card" style={{ padding: 'var(--space-5) var(--space-6)', height: '100%', borderLeft: '3px solid #18b2e0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.title}</h3>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection delay={0.3}>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-8)', padding: 'var(--space-5)', background: 'rgba(24,178,224,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(24,178,224,0.15)' }}>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', margin: 0 }}>If Doctrine, existing Symfony platforms, or the bundle ecosystem are hard dependencies, <span style={{ color: '#18b2e0' }}>Symfony is still the right call.</span></p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* WHERE ML WINS */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Where <span className="text-gradient">MonkeysLegion</span> wins.</h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}>
              {mlWins.map((item, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.05}>
                  <div className="glass-card" style={{ padding: 'var(--space-5) var(--space-6)', height: '100%', borderLeft: '3px solid hsl(250, 95%, 70%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.title}</h3>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE TABLE */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Feature-by-feature.</h2>
            </AnimatedSection>
            <ComparisonTable columns={['Capability', 'MonkeysLegion', 'Symfony 7']} rows={featureComparison} />
          </div>
        </section>

        {/* DOCTRINE WARNING */}
        <section style={{ padding: 'var(--space-10) 0', background: 'var(--color-bg-alt)' }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <AnimatedSection>
              <div style={{ padding: 'var(--space-6)', background: 'rgba(245,158,11,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)', color: '#f59e0b' }}>⚠️ The Doctrine gap is real.</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  If your project depends on Doctrine&apos;s unit of work, inheritance mapping, or DQL, MonkeysLegion isn&apos;t a drop-in. QueryBuilder is lighter and faster but has a smaller feature set.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* MIGRATION TABLE */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Migrating from <span className="text-gradient">Symfony.</span></h2>
            </AnimatedSection>
            <MigrationTable fromLabel="Symfony" toLabel="MonkeysLegion" rows={migrationRows} />
          </div>
        </section>

        {/* WHEN TO PICK */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>When to pick <span className="text-gradient">which.</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)', maxWidth: 900, margin: 'var(--space-8) auto 0' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', borderTop: '3px solid #18b2e0' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', color: '#18b2e0' }}>Pick Symfony if:</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                      'You\'re extending Drupal, Shopware, or another Symfony-based platform.',
                      'Your domain model requires Doctrine\'s unit of work and DQL.',
                      'You need the web profiler for complex request debugging.',
                      'Your team has years of Symfony experience and muscle memory.',
                      'LTS guarantees are a board-level requirement today.',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: '#18b2e0', flexShrink: 0 }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', borderTop: '3px solid hsl(250, 95%, 70%)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'hsl(250, 95%, 75%)' }}>Pick MonkeysLegion if:</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                      'You\'re building enterprise software that demands modern PHP 8.4 defaults.',
                      'You\'re building AI-native products (Apex is the deciding factor).',
                      'Boot time and memory matter to your infrastructure and deployment cost.',
                      'You want a faster ramp-up for new teams without Symfony\'s steep learning curve.',
                      'You want security primitives (JWT, 2FA, OAuth2) first-party instead of via bundles.',
                      'You need enterprise-grade performance at scale — 140× faster entity ops, 3× less memory.',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: 'hsl(250, 95%, 75%)', flexShrink: 0 }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>A note on <span className="text-gradient">philosophy.</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-3)', color: '#18b2e0' }}>Symfony&apos;s philosophy</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                    <strong style={{ color: 'var(--color-text)' }}>Explicit, composable, standards-driven.</strong> Every component works on its own. Configuration is external. The DI container is the hub.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'hsl(250, 95%, 75%)' }}>MonkeysLegion&apos;s philosophy</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                    <strong style={{ color: 'var(--color-text)' }}>Attribute-first, convention over configuration, PHP-native.</strong> Configuration lives next to the code it governs. Providers auto-discover. The framework trusts PHP 8.4&apos;s type system instead of layering its own abstractions on top.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* STILL UNSURE */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg-alt) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container" style={{ maxWidth: 650 }}>
            <AnimatedSection>
              <h2 className="section-title">Still <span className="text-gradient">unsure?</span></h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                Both frameworks can power enterprise projects. The question is which trade-offs fit <em>your</em> team. If you need <strong style={{ color: 'var(--color-text)' }}>Doctrine, Symfony-based platforms, or an established LTS track record</strong>, go Symfony. If you need <strong style={{ color: 'var(--color-text)' }}>modern PHP, AI integration, lower infrastructure costs, and faster developer onboarding</strong>, MonkeysLegion delivers enterprise-grade results with less overhead.
              </p>
              <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-6)', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer create-project monkeyscloud/monkeyslegion-skeleton my-app</span></div></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/" className="btn btn-primary btn-lg">Framework home →</a>
                <a href="/compare-laravel" className="btn btn-secondary btn-lg">Compare with Laravel →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignCompareSymfonyPage() {
  return <CompareSymfonyInner menuItems={designMenu} />;
}
