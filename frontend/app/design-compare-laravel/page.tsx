'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import ComparisonTable from '../components/docs/ComparisonTable';
import MigrationTable from '../components/docs/MigrationTable';
import { AnimatedSection } from '../components/ui';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

export function CompareLaravelContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <CompareLaravelInner menuItems={menuItems} />;
}



const laravelWins = [
  { icon: '📦', title: 'Ecosystem depth', desc: 'Forge, Vapor, Nova, Cashier, Sanctum, Scout, Socialite, Horizon, Telescope, Pulse — Laravel\'s first-party product suite is in a different weight class.' },
  { icon: '👥', title: 'Community size', desc: 'More packages on Packagist, more StackOverflow answers, more YouTube tutorials, more jobs on LinkedIn. If you hit a weird problem at 3am, Laravel has more Google results.' },
  { icon: '🧑‍💻', title: 'Hiring pool', desc: 'Finding a mid-level Laravel developer is easier than finding a MonkeysLegion developer — and will be for a long time. This is a real consideration for teams.' },
  { icon: '✨', title: 'Eloquent ORM', desc: 'For all its __get() overhead, Eloquent is still one of the most expressive ORMs in any language. Lazy loading, eager loading, relationship graphs, soft deletes, observers — mature in a way MonkeysLegion\'s Query Builder isn\'t yet.' },
  { icon: '🔧', title: 'Mature ecosystem patterns', desc: 'Scheduler, queues, notifications, broadcasting, events — Laravel has been refining these for a decade. MonkeysLegion covers the same ground, but with fewer edge cases battle-tested in the wild.' },
  { icon: '🤝', title: '"Everybody knows it"', desc: 'If you\'re hiring a contractor for a two-week spike, you can say "it\'s Laravel" and they can start Monday.' },
];

const mlWins = [
  { icon: '⚡', title: 'Raw performance', desc: '~6.3M entity creations/sec vs Laravel\'s ~45K — roughly 140× faster. Full-stack HTTP throughput lands at ~12.5K req/s vs ~2.1K. Cold-boot memory is ~4MB vs ~22MB.' },
  { icon: '🔮', title: 'PHP 8.4 as the baseline', desc: 'Property hooks, asymmetric visibility, and strict types are used throughout the framework, not retrofitted. Laravel still supports PHP 8.2+ and can\'t lean on 8.4 features until it drops older versions.' },
  { icon: '🏷️', title: 'Attribute-first, not config-file-heavy', desc: 'Routes on methods, validation on DTO properties, providers with #[Provider], CLI commands with #[Command]. No routes/web.php, no FormRequest classes, no service provider boilerplate.' },
  { icon: '📦', title: 'Compiled DI container', desc: 'Production builds have zero runtime reflection. Laravel\'s container does partial caching; MonkeysLegion\'s compiler emits a static PHP array.' },
  { icon: '🤖', title: 'AI orchestration built in', desc: 'Apex ships multi-provider routing, pipelines, crews, guardrails, and MCP as one Composer package. Laravel requires Sanctum + a custom OpenAI wrapper + cost tracker + routing logic — none of which is first-party.' },
  { icon: '🛡️', title: 'OWASP security defaults', desc: 'Security headers, token blacklisting, Argon2id, trusted proxy middleware — all enabled by default. Laravel requires additional packages or manual configuration for several of these.' },
];

const featureComparison = [
  { capability: 'PHP minimum', values: ['8.4', '8.2'] },
  { capability: 'Attribute routing', values: ['✅ Core', '⚠️ via spatie/laravel-route-attributes'] },
  { capability: 'DTO validation via attributes', values: ['✅ Core', '⚠️ FormRequests (runtime-based)'] },
  { capability: 'Compiled DI container', values: ['✅ Production default', '⚠️ Partial cache'] },
  { capability: 'Argon2id password default', values: ['✅', '⚠️ bcrypt (Argon2id opt-in)'] },
  { capability: 'JWT authentication', values: ['✅ Core', '❌ Sanctum / Passport required'] },
  { capability: 'TOTP 2FA', values: ['✅ Core', '❌ Fortify + package required'] },
  { capability: 'OAuth2 (Google, GitHub)', values: ['✅ Core', '❌ Socialite required'] },
  { capability: 'OWASP security headers', values: ['✅ Default', '❌ Third-party package'] },
  { capability: 'AI orchestration', values: ['✅ Apex (first-party)', '❌ Custom code'] },
  { capability: 'MCP server + client', values: ['✅ Apex', '❌ Not available'] },
  { capability: 'OpenAPI v3 auto-generation', values: ['✅ Core', '⚠️ via knuckleswtf/scribe'] },
  { capability: 'CLI scaffolders', values: ['✅ 17 make:*', '✅ 20+ make:*'] },
  { capability: 'Queue system', values: ['✅ Core', '✅ Core'] },
  { capability: 'Scheduler', values: ['✅ Core', '✅ Core'] },
  { capability: 'Eloquent-style ORM', values: ['⚠️ QueryBuilder + Entity (simpler)', '✅ Eloquent (more features)'] },
  { capability: 'Ecosystem packages', values: ['~50 (growing)', '10,000+'] },
  { capability: 'Community size', values: ['Small, early', 'Massive, mature'] },
];

const migrationRows = [
  { from: 'routes/web.php + controller methods', to: '#[Route] attributes on controller methods' },
  { from: 'FormRequest classes', to: 'readonly DTOs with #[Assert\\*] attributes' },
  { from: 'Eloquent models', to: 'Entity classes with #[Entity], #[Field] + QueryBuilder' },
  { from: 'Service providers', to: 'AbstractServiceProvider with #[Provider] attribute' },
  { from: 'php artisan', to: 'php ml' },
  { from: 'php artisan make:*', to: 'php ml make:*' },
  { from: 'Blade templates', to: 'MLView templates (same directive syntax)' },
  { from: 'Middleware', to: 'PSR-15 middleware (interface-compatible)' },
  { from: 'Events + listeners', to: 'PSR-14 events + attribute-discovered listeners' },
  { from: 'config/*.php files', to: 'config/*.mlc files' },
  { from: '.env', to: '.env + cascading variants (.env.local, .env.{APP_ENV})' },
];

function CompareLaravelInner({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        {/* HERO */}
        <PageHero
          eyebrow="Honest comparison · Last updated April 2026"
          title="Laravel vs MonkeysLegion: two frameworks,"
          titleGradient="different strengths."
          subtitle="Laravel is the most successful PHP framework of the last decade. MonkeysLegion is the enterprise-grade alternative built on PHP 8.4, designed for teams that need performance, AI orchestration, and modern defaults without the accumulated weight."
        />

        {/* WHERE LARAVEL WINS */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Where <span style={{ color: '#ff4444' }}>Laravel</span> wins.</h2>
              <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-4)' }}>Let&apos;s start here. Laravel has genuine advantages in ecosystem breadth and community size.</p>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}>
              {laravelWins.map((item, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.05}>
                  <div className="glass-card" style={{ padding: 'var(--space-5) var(--space-6)', height: '100%', borderLeft: '3px solid #ff4444' }}>
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
              <div style={{ textAlign: 'center', marginTop: 'var(--space-8)', padding: 'var(--space-5)', background: 'rgba(255,68,68,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,68,68,0.15)' }}>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', margin: 0 }}>If these are your constraints, <span style={{ color: '#ff4444' }}>pick Laravel. Seriously.</span></p>
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

        {/* FEATURE-BY-FEATURE TABLE */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Feature-by-feature.</h2>
            </AnimatedSection>
            <ComparisonTable
              columns={['Capability', 'MonkeysLegion', 'Laravel 11']}
              rows={featureComparison}
            />
          </div>
        </section>

        {/* MIGRATION TABLE */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Migrating from <span className="text-gradient">Laravel.</span></h2>
              <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-6)' }}>Most Laravel concepts port cleanly.</p>
            </AnimatedSection>
            <MigrationTable fromLabel="Laravel" toLabel="MonkeysLegion" rows={migrationRows} />
          </div>
        </section>

        {/* WHEN TO PICK */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>When to pick <span className="text-gradient">which.</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)', maxWidth: 900, margin: 'var(--space-8) auto 0' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', borderTop: '3px solid #ff4444' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', color: '#ff4444' }}>Pick Laravel if:</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                      'You need a massive talent pool and quick contractor onboarding.',
                      'Your product depends on Forge, Vapor, Nova, or Cashier.',
                      'You need Eloquent\'s relationship graph and observer patterns.',
                      'Your team has deep Laravel muscle memory.',
                      'You\'re building a CRUD SaaS and time-to-market is the only metric.',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: '#ff4444', flexShrink: 0 }}>→</span> {item}
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
                      'You\'re building enterprise or AI-native products that demand performance at scale.',
                      'HTTP throughput or boot memory matters to your infrastructure budget.',
                      'You want PHP 8.4 features as first-class citizens, not retrofitted.',
                      'You want security primitives (JWT, 2FA, OAuth2) in the framework, not as package archaeology.',
                      'You need AI orchestration built in (Apex is the deciding factor).',
                      'You\'re starting a new enterprise project and want modern defaults from day one.',
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

        {/* MAINTAINER NOTE */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <AnimatedSection>
              <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>A note from the <span className="text-gradient">maintainers.</span></h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--text-sm)' }}>
                  We built MonkeysLegion because enterprise teams deserve a modern PHP framework — one that doesn&apos;t carry the accumulated weight of a decade of backward compatibility. Both frameworks can power enterprise projects. We&apos;re offering a third option for teams that want attribute-first architecture, PHP-8.4-native performance, and AI-ready infrastructure out of the box.
                </p>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                  If this page convinced you Laravel is the right call for your project, that&apos;s fine too. The PHP ecosystem is better when developers pick the right tool instead of the loudest one.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Ready to <span className="text-gradient">try it?</span></h2>
              <div className="terminal" style={{ maxWidth: 550, margin: 'var(--space-6) auto', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer create-project monkeyscloud/monkeyslegion-skeleton my-app</span></div></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
                <a href="/" className="btn btn-primary btn-lg">Framework home →</a>
                <a href="/compare-symfony" className="btn btn-secondary btn-lg">Compare with Symfony →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignCompareLaravelPage() {
  return <CompareLaravelInner menuItems={designMenu} />;
}
