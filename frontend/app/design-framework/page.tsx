'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import CodeBlock from '../components/docs/CodeBlock';
import { AnimatedSection, BenchmarkRow } from '../components/ui';
import Benchmarks from '../components/Benchmarks';
import { fallbackBenchmarks } from '@/lib/fallback-data';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

/* ═══════════════════════════════════════════════════════════════════════════
   Section 1 — Core Traits
   ═══════════════════════════════════════════════════════════════════════════ */

const coreTraits = [
  {
    icon: '⚡',
    title: 'PHP 8.4 Baseline',
    description: 'Property hooks and strict typing are first-class design inputs, not future compatibility goals. Every package targets PHP 8.4+.',
  },
  {
    icon: '🏷️',
    title: 'Attribute-First Architecture',
    description: 'Routes, validation, providers, listeners, and commands live next to the code they control — no YAML, no route files, no registration layers.',
  },
  {
    icon: '🔧',
    title: 'Compiled Container & Config',
    description: 'Autowiring in dev, compiled static PHP arrays in production. Zero runtime reflection, zero parsing overhead.',
  },
  {
    icon: '📐',
    title: 'PSR-Aligned Internals',
    description: 'PSR-7, 11, 14, 15, 16, and 17 are part of the architecture. Replacement and modular adoption stay easy.',
  },
  {
    icon: '🛡️',
    title: 'Integrated Security & Auth',
    description: 'JWT, OAuth2, TOTP 2FA, RBAC, rate limiting, CSRF, CORS, security headers — first-party, not scattered across packages.',
  },
  {
    icon: '🤖',
    title: 'AI-Native Direction',
    description: 'Apex is a full orchestration layer — multi-provider routing, schemas, pipelines, crews, guardrails, budgeting, and MCP support.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Section 2 — Architecture
   ═══════════════════════════════════════════════════════════════════════════ */

const architectureTree = `my-app/
├─ app/
│  ├─ Controller/
│  ├─ Dto/
│  ├─ Entity/
│  └─ Auth/
├─ config/
│  ├─ app.php
│  ├─ database.php
│  └─ *.mlc
├─ public/
├─ resources/
│  └─ views/
├─ var/
│  ├─ cache/
│  └─ migrations/
├─ storage/
├─ tests/
└─ bin/`;

/* ═══════════════════════════════════════════════════════════════════════════
   Section 3 — Package Ecosystem (7 categories, 28 packages)
   ═══════════════════════════════════════════════════════════════════════════ */

const packageGroups = [
  {
    category: 'Core Runtime & Configuration',
    color: '#8b5cf6',
    packages: [
      { icon: '📦', name: 'monkeyslegion', desc: 'The meta-package — installs the full framework stack from one dependency.' },
      { icon: '⚙️', name: 'monkeyslegion-core', desc: 'Shared utilities, collections, string/array helpers, env readers, base exceptions.' },
      { icon: '🔧', name: 'monkeyslegion-di', desc: 'PSR-11 container with autowiring in dev and compiled static container in production.' },
      { icon: '📝', name: 'monkeyslegion-mlc', desc: 'Typed configuration system behind .mlc files — environment interpolation, nesting, caching.' },
      { icon: '⌨️', name: 'monkeyslegion-cli', desc: 'The command kernel — scaffolding, diagnostics, caching, and operational tooling.' },
      { icon: '🚀', name: 'monkeyslegion-dev-server', desc: 'Local development server support for first-run setup and serving.' },
    ],
  },
  {
    category: 'HTTP, Routing & Presentation',
    color: '#3b82f6',
    packages: [
      { icon: '🌐', name: 'monkeyslegion-http', desc: 'PSR-7/15/17 HTTP layer plus security-oriented middleware stack.' },
      { icon: '🧭', name: 'monkeyslegion-router', desc: 'Attribute-based routing — auto-discovery, groups, constraints, and route caching.' },
      { icon: '🖼️', name: 'monkeyslegion-template', desc: 'MLView template engine — compiled-to-PHP views with layouts, directives, and caching.' },
      { icon: '📖', name: 'monkeyslegion-openapi', desc: 'Automatic OpenAPI v3 documentation from route metadata and attributes.' },
    ],
  },
  {
    category: 'Data Layer & Persistence',
    color: '#10b981',
    packages: [
      { icon: '🗄️', name: 'monkeyslegion-database', desc: 'PDO connection management, transactions, and multi-database support.' },
      { icon: '🔍', name: 'monkeyslegion-query', desc: 'Fluent query builder — driver-aware SQL composition without ORM overhead.' },
      { icon: '📋', name: 'monkeyslegion-entity', desc: 'Attribute-defined entities with metadata extraction and POPO-style modeling.' },
      { icon: '📦', name: 'monkeyslegion-migration', desc: 'Schema diffing, generated migrations, reversible runs, environment-aware execution.' },
    ],
  },
  {
    category: 'Auth, Validation & Security',
    color: '#ef4444',
    packages: [
      { icon: '🔐', name: 'monkeyslegion-auth', desc: 'JWT, OAuth2, TOTP 2FA, API keys, RBAC, policies, Argon2id — the complete auth subsystem.' },
      { icon: '✅', name: 'monkeyslegion-validation', desc: 'Attribute-based validation with immutable DTO binding and automatic 422 responses.' },
      { icon: '🔒', name: 'monkeyslegion-session', desc: 'Session management with CSRF support and request-flow integration.' },
    ],
  },
  {
    category: 'Background, Messaging & Operations',
    color: '#06b6d4',
    packages: [
      { icon: '📡', name: 'monkeyslegion-events', desc: 'PSR-14 event dispatcher with attribute-discovered listeners.' },
      { icon: '⚙️', name: 'monkeyslegion-queue', desc: 'Background jobs, workers, retries, delayed execution with multiple drivers.' },
      { icon: '⏰', name: 'monkeyslegion-schedule', desc: 'Cron-style scheduling in PHP — overlap protection, hooks, server coordination.' },
      { icon: '📧', name: 'monkeyslegion-mail', desc: 'SMTP + API transports, DKIM signing, template mailables, queueable delivery.' },
      { icon: '📊', name: 'monkeyslegion-logger', desc: 'PSR-3 logging with rotating handlers and structured output.' },
      { icon: '🔭', name: 'monkeyslegion-telemetry', desc: 'Prometheus metrics, distributed tracing, structured logs, OTLP exporters.' },
    ],
  },
  {
    category: 'Caching, Files & i18n',
    color: '#f59e0b',
    packages: [
      { icon: '💾', name: 'monkeyslegion-cache', desc: 'PSR-16 caching — Redis, file, Memcached, array. Tagging and stampede protection.' },
      { icon: '📁', name: 'monkeyslegion-files', desc: 'Unified file storage, image processing, garbage collection across local and cloud.' },
      { icon: '🌍', name: 'monkeyslegion-i18n', desc: 'File + database loaders, ICU plurals, locale detection, translator workflows.' },
    ],
  },
  {
    category: 'AI Orchestration (Apex)',
    color: '#a855f7',
    packages: [
      { icon: '🤖', name: 'monkeyslegion-apex', desc: 'Multi-provider AI orchestration — structured output, tool calling, pipelines, crews, guardrails, MCP.' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Section 4 — Middleware Pipeline
   ═══════════════════════════════════════════════════════════════════════════ */

const pipelineLayers = [
  { name: 'SecurityHeaders', color: '#ef4444' },
  { name: 'TrustedProxy', color: '#f97316' },
  { name: 'RequestId', color: '#f59e0b' },
  { name: 'CORS', color: '#84cc16' },
  { name: 'RateLimit', color: '#10b981' },
  { name: 'Maintenance', color: '#06b6d4' },
  { name: 'Session', color: '#3b82f6' },
  { name: 'CSRF', color: '#6366f1' },
  { name: 'Auth', color: '#8b5cf6' },
  { name: 'Router', color: '#a855f7' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Section 5 — Philosophy
   ═══════════════════════════════════════════════════════════════════════════ */

const philosophyCards = [
  {
    icon: '🧩',
    title: 'Packages as Product Boundaries',
    description: 'Each capability has a package identity and its own scope. Nothing is hidden inside one opaque core.',
  },
  {
    icon: '🔗',
    title: 'Integrated at the Experience Layer',
    description: 'Separate packages, one coherent platform. The skeleton and docs treat them as a unified development experience.',
  },
  {
    icon: '🚀',
    title: 'Modern PHP, Not Backward Compat',
    description: 'Property hooks, attributes, readonly DTOs, compiled DI, strict types — these shape the framework\'s personality.',
  },
  {
    icon: '🛡️',
    title: 'Security & AI as First-Class',
    description: 'Auth/security is deep and broad. Apex gives the ecosystem a category-defining story no other PHP framework has.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════════════════════ */

export function FrameworkContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <FrameworkPageInner menuItems={menuItems} />;
}

function FrameworkPageInner({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        {/* ── Hero ── */}
        <PageHero
          eyebrow="monkeyslegion@2.0 · PHP 8.4+ · 28 packages"
          title="A Modern PHP Platform."
          titleGradient="Not Just a Framework."
          subtitle="Attribute-first architecture, compiled infrastructure, PSR-aligned internals, first-party auth & security, and a unique AI orchestration engine — all delivered through a modular 26-package ecosystem."
        />

        {/* ── What Defines MonkeysLegion v2 ── */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">What Defines <span className="text-gradient">MonkeysLegion v2</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-10)' }}>
                Not a minimal micro-framework. Not a legacy enterprise stack. A modern PHP application platform.
              </p>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {coreTraits.map((trait, i) => (
                <AnimatedSection key={i} delay={i * 0.06}>
                  <div className="glass-card" style={{
                    padding: 'var(--space-6)',
                    height: '100%',
                    display: 'flex',
                    gap: 'var(--space-4)',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-md)',
                      background: 'hsla(250, 85%, 60%, 0.1)',
                    }}>
                      {trait.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{trait.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{trait.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Architecture at a Glance ── */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Architecture <span className="text-gradient">at a Glance</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-10)' }}>
                Convention-based discovery, compiled configuration, and a clear separation of concerns.
              </p>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
              <AnimatedSection>
                <CodeBlock language="text" code={architectureTree} />
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>How it works</h3>
                  <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', paddingLeft: 'var(--space-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <li><strong style={{ color: 'var(--color-text)' }}>Controllers & DTOs</strong> are discovered automatically via attributes</li>
                    <li><strong style={{ color: 'var(--color-text)' }}>Configuration</strong> lives in <code style={{ background: 'var(--color-surface)', padding: '0.1em 0.3em', borderRadius: '4px', fontSize: '0.9em' }}>.mlc</code> files with typed parsing and caching</li>
                    <li><strong style={{ color: 'var(--color-text)' }}>Templates</strong> compile to optimized PHP under <code style={{ background: 'var(--color-surface)', padding: '0.1em 0.3em', borderRadius: '4px', fontSize: '0.9em' }}>resources/views</code></li>
                    <li><strong style={{ color: 'var(--color-text)' }}>Migrations</strong> are generated into <code style={{ background: 'var(--color-surface)', padding: '0.1em 0.3em', borderRadius: '4px', fontSize: '0.9em' }}>var/migrations</code> from entity diffs</li>
                    <li><strong style={{ color: 'var(--color-text)' }}>Runtime artifacts</strong> compile into cache directories for zero-overhead production</li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── Package Ecosystem Promo ── */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                <h2 className="section-title">The Package <span className="text-gradient">Ecosystem</span></h2>
                <p className="section-subtitle" style={{ margin: '0 auto var(--space-8)' }}>
                  MonkeysLegion isn't a monolith. It's built from 26 independently-versioned packages that compose beautifully together.
                </p>
                
                {/* Stats Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Composer Packages', value: '26' },
                    { label: 'PHP Minimum', value: '8.4' },
                    { label: 'PSR Standards', value: '6 Supported' },
                    { label: 'Architecture', value: 'Decoupled' },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center', background: 'var(--color-surface)', padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', minWidth: 160 }}>
                      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }} className="text-gradient">{stat.value}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              {/* Highlight Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-10)' }}>
                {[
                  { icon: '🤖', name: 'Apex AI', desc: 'First-party AI orchestration, agent crews, and tool calling built directly into the framework.', color: '#a855f7' },
                  { icon: '🔐', name: 'Auth & Security', desc: 'JWT, OAuth2, TOTP 2FA, API keys, RBAC, and Argon2id out of the box.', color: '#ef4444' },
                  { icon: '🚀', name: 'Core & Router', desc: 'Attribute-based HTTP routing, compiled DI, and rapid boot lifecycle.', color: '#3b82f6' },
                ].map(pkg => (
                  <div key={pkg.name} className="glass-card" style={{ padding: 'var(--space-5)', borderTop: `3px solid ${pkg.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{pkg.icon}</div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{pkg.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>{pkg.desc}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', background: 'linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(6,182,212,0.05) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(139,92,246,0.1)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Get everything with one command</h3>
                <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-6)', textAlign: 'left' }}>
                  <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                  <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer require monkeyscloud/monkeyslegion-skeleton my-app</span></div></div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="/packages" className="btn btn-primary btn-lg">Explore all 28 packages →</a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── PSR-15 Middleware Pipeline ── */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">The Request <span className="text-gradient">Pipeline</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-10)' }}>
                Every HTTP request flows through a PSR-15 middleware stack before reaching your controller.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <div style={{ maxWidth: 700, margin: '0 auto' }}>
                {pipelineLayers.map((layer, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-5)',
                    background: i % 2 === 0 ? 'hsla(250, 30%, 15%, 0.5)' : 'hsla(250, 30%, 12%, 0.5)',
                    borderLeft: `3px solid ${layer.color}`,
                    borderRadius: i === 0 ? 'var(--radius-lg) var(--radius-lg) 0 0' : i === pipelineLayers.length - 1 ? '0 0 var(--radius-lg) var(--radius-lg)' : '0',
                    position: 'relative',
                  }}>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: layer.color,
                      fontFamily: 'var(--font-code)',
                      width: 24,
                      textAlign: 'center',
                      opacity: 0.7,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      fontFamily: 'var(--font-code)',
                      color: 'var(--color-text)',
                    }}>
                      {layer.name}
                    </span>
                    {i < pipelineLayers.length - 1 && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                        opacity: 0.5,
                      }}>
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-6)', maxWidth: 550, marginLeft: 'auto', marginRight: 'auto', lineHeight: 'var(--line-height-relaxed)' }}>
                Middleware is the main composition layer — not a bolt-on edge feature. Security headers, CORS, rate limiting, auth, and CSRF are all enabled by default.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Benchmarks ── */}
        <Benchmarks>
          {fallbackBenchmarks.map((bench) => (
            <BenchmarkRow
              key={bench.id}
              operation={bench.operation}
              mlValue={bench.mlValue}
              mlSuffix={bench.mlSuffix}
              vsLaravel={bench.vsLaravel}
              vsSymfony={bench.vsSymfony}
            />
          ))}
        </Benchmarks>

        {/* ── Philosophy ── */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Design <span className="text-gradient">Philosophy</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {philosophyCards.map((card, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-4)' }}>{card.icon}</div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{card.title}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{card.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg-alt) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Ready to <span className="text-gradient">build?</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>
                The entire platform ships as one <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px' }}>composer create-project</code> command.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body">
                  <div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer create-project monkeyscloud/monkeyslegion-skeleton my-app</span></div>
                  <div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">cd my-app && php ml serve</span></div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/features" className="btn btn-primary btn-lg">Explore features →</a>
                <a href="/packages" className="btn btn-secondary btn-lg">Browse packages →</a>
                <a href="/apex" className="btn btn-secondary btn-lg">Apex AI →</a>
                <a href="/docs" className="btn btn-secondary btn-lg">Documentation →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignFrameworkPage() {
  return <FrameworkPageInner menuItems={designMenu} />;
}
