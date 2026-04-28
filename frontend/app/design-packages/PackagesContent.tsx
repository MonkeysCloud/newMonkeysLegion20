'use client';

import { useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import { AnimatedSection } from '../components/ui';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

export function PackagesContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <PackagesPageInner menuItems={menuItems} />;
}

interface Pkg {
  name: string;
  version: string;
  tagline: string;
  bullets: string[];
  install: string;
  github: string;
  docs: string;
  category: string;
  icon: string;
  highlight?: boolean;
}

const packages: Pkg[] = [
  { name: 'monkeyslegion-core', version: 'v2.0', icon: '⚙️', tagline: 'The foundation every other package builds on.', bullets: ['Boot lifecycle management', 'Provider scanner with topological sort', '#[BootAfter] dependency ordering', 'Maintenance mode middleware'], install: 'composer require monkeyscloud/monkeyslegion-core', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Core', docs: '/docs/core', category: 'Foundation' },
  { name: 'monkeyslegion-di', version: 'v2.0', icon: '💉', tagline: 'PSR-11 container with a production compiler.', bullets: ['Zero-reflection in production', 'Autowiring in development', '#[Provider] attribute discovery', 'Compiled static PHP arrays'], install: 'composer require monkeyscloud/monkeyslegion-di', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Di', docs: '/docs/di', category: 'Foundation' },
  { name: 'monkeyslegion-mlc', version: 'v3.2', icon: '📄', tagline: 'MLC — the configuration format for MonkeysLegion.', bullets: ['Typed config objects', 'Env variable interpolation', 'Nested merging from presets', 'Compiled caching'], install: 'composer require monkeyscloud/monkeyslegion-mlc', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Mlc', docs: '/docs/mlc', category: 'Foundation' },
  { name: 'monkeyslegion-http', version: 'v2.0', icon: '🌐', tagline: 'PSR-7, PSR-15, PSR-17. With OWASP defaults.', bullets: ['SecurityHeaders middleware', 'Trusted proxy handling', 'CORS with wildcard control', 'Rate limiting per route'], install: 'composer require monkeyscloud/monkeyslegion-http', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Http', docs: '/docs/http', category: 'HTTP & Routing' },
  { name: 'monkeyslegion-router', version: 'v2.1', icon: '🧭', tagline: 'Attribute-based HTTP router for PHP 8.4+.', bullets: ['#[Route], #[Get], #[Post] attributes', 'Compiled route table — zero regex', 'Named routes with url() helper', 'Route groups and middleware stacks'], install: 'composer require monkeyscloud/monkeyslegion-router', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Router', docs: '/docs/router', category: 'HTTP & Routing' },
  { name: 'monkeyslegion-database', version: 'v2.0', icon: '🗄️', tagline: 'PDO connection management. Multi-driver. Transactional.', bullets: ['MySQL, PostgreSQL, SQLite drivers', 'Connection pooling', 'Nested transactions (savepoints)', 'Read/write splitting'], install: 'composer require monkeyscloud/monkeyslegion-database', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Database', docs: '/docs/database', category: 'Data Layer' },
  { name: 'monkeyslegion-query', version: 'v2.0', icon: '🔍', tagline: 'Fluent query builder and micro-ORM for PHP 8.4+.', bullets: ['Chainable select/where/join/order', '140× faster than Doctrine hydration', 'Aggregate & subquery support', 'Raw expression escaping'], install: 'composer require monkeyscloud/monkeyslegion-query', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Query', docs: '/docs/query', category: 'Data Layer' },
  { name: 'monkeyslegion-entity', version: 'v2.0', icon: '📋', tagline: 'Attribute-defined entities. Metadata extraction. Zero proxies.', bullets: ['#[Entity], #[Field], #[Id] attributes', 'Property hooks for getters', 'No lazy-loading proxies', 'Schema diffing integration'], install: 'composer require monkeyscloud/monkeyslegion-entity', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Entity', docs: '/docs/entity', category: 'Data Layer' },
  { name: 'monkeyslegion-migration', version: 'v2.0', icon: '🔄', tagline: 'Schema diffing. Generated migrations. Reversible runs.', bullets: ['Entity-to-schema auto-diff', 'Reversible up/down migrations', 'Foreign key constraint handling', 'CLI: schema:update, migrate'], install: 'composer require monkeyscloud/monkeyslegion-migration', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Migration', docs: '/docs/migration', category: 'Data Layer' },
  { name: 'monkeyslegion-auth', version: 'v2.1', icon: '🔐', tagline: 'Drop-in authentication and authorization.', bullets: ['JWT + Session guards', 'OAuth2 + TOTP 2FA', 'RBAC with policies', 'Argon2id password hashing'], install: 'composer require monkeyscloud/monkeyslegion-auth', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Auth', docs: '/docs/auth', category: 'Auth & Security' },
  { name: 'monkeyslegion-validation', version: 'v2.0', icon: '✅', tagline: 'Attribute-driven validation with DTO binding.', bullets: ['#[Assert\\NotBlank], #[Assert\\Email]', 'Auto DTO hydration from request', 'Custom validator attributes', 'Nested object validation'], install: 'composer require monkeyscloud/monkeyslegion-validation', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Validation', docs: '/docs/validation', category: 'Auth & Security' },
  { name: 'monkeyslegion-session', version: 'v2.0', icon: '🍪', tagline: 'Session management with CSRF middleware built in.', bullets: ['File, Redis, database drivers', 'CSRF token middleware', 'Flash message support', 'Secure cookie defaults'], install: 'composer require monkeyscloud/monkeyslegion-session', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Session', docs: '/docs/session', category: 'Auth & Security' },
  { name: 'monkeyslegion-template', version: 'v2.0', icon: '📝', tagline: 'MLView — a lightweight template engine compiled to PHP.', bullets: ['@extends, @section, @yield', '@foreach, @if, @unless', 'Compiled to static PHP', 'Component includes'], install: 'composer require monkeyscloud/monkeyslegion-template', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Template', docs: '/docs/template', category: 'Rendering' },
  { name: 'monkeyslegion-cache', version: 'v2.0', icon: '💾', tagline: 'PSR-16 cache with multiple drivers.', bullets: ['Redis, file, Memcached, array', 'Tag-based invalidation', 'Stampede protection (locking)', 'remember() helper'], install: 'composer require monkeyscloud/monkeyslegion-cache', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Cache', docs: '/docs/cache', category: 'Infrastructure' },
  { name: 'monkeyslegion-events', version: 'v2.0', icon: '📡', tagline: 'PSR-14 event dispatcher with attribute-discovered listeners.', bullets: ['#[Listener] attribute discovery', 'Priority ordering', 'Wildcard subscriptions', 'Queueable listeners'], install: 'composer require monkeyscloud/monkeyslegion-events', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Events', docs: '/docs/events', category: 'Infrastructure' },
  { name: 'monkeyslegion-queue', version: 'v1.2', icon: '⚙️', tagline: 'Background jobs with retry, timeout, and batching.', bullets: ['Redis, database, array drivers', 'Exponential backoff retry', 'Job batching and chaining', 'Timeout and memory limits'], install: 'composer require monkeyscloud/monkeyslegion-queue', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Queue', docs: '/docs/queue', category: 'Infrastructure' },
  { name: 'monkeyslegion-schedule', version: 'v1.1', icon: '⏰', tagline: 'Cron-like task scheduling in PHP.', bullets: ['Fluent frequency API', 'Overlap prevention', 'Output to file or callback', 'Timezone-aware scheduling'], install: 'composer require monkeyscloud/monkeyslegion-schedule', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Schedule', docs: '/docs/schedule', category: 'Infrastructure' },
  { name: 'monkeyslegion-sockets', version: 'v1.0', icon: '🔌', tagline: 'WebSocket server with real-time broadcasting.', bullets: ['Multi-driver: Ratchet, Swoole, ReactPHP', 'Channel-based pub/sub', 'Presence tracking', 'Client SDK (JS/TS)'], install: 'composer require monkeyscloud/monkeyslegion-sockets', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Sockets', docs: '/docs/sockets', category: 'Infrastructure' },
  { name: 'monkeyslegion-logger', version: 'v2.0', icon: '📊', tagline: 'PSR-3 logger built on Monolog with opinionated defaults.', bullets: ['Structured JSON output', 'Daily rotation', 'Context enrichment', 'Slack/email channel alerts'], install: 'composer require monkeyscloud/monkeyslegion-logger', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Logger', docs: '/docs/logger', category: 'Operations' },
  { name: 'monkeyslegion-telemetry', version: 'v2.0', icon: '📈', tagline: 'OpenTelemetry-compatible metrics, tracing, and structured logging.', bullets: ['Prometheus metrics export', 'Jaeger/Tempo tracing', 'Histogram and counter types', 'Auto-instrumented spans'], install: 'composer require monkeyscloud/monkeyslegion-telemetry', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Telemetry', docs: '/docs/telemetry', category: 'Operations' },
  { name: 'monkeyslegion-files', version: 'v2.0', icon: '📁', tagline: 'Unified file storage and image processing.', bullets: ['Local, S3, GCS adapters', 'Image resize/crop/webp', 'Garbage collection daemon', 'URL generation'], install: 'composer require monkeyscloud/monkeyslegion-files', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Files', docs: '/docs/files', category: 'Operations' },
  { name: 'monkeyslegion-mail', version: 'v1.1', icon: '📧', tagline: 'Email with SMTP, API transports, and DKIM signing.', bullets: ['SMTP + API (Postmark, SES)', 'DKIM signing built in', 'Template-backed mailables', 'Queue integration'], install: 'composer require monkeyscloud/monkeyslegion-mail', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Mail', docs: '/docs/mail', category: 'Operations' },
  { name: 'monkeyslegion-i18n', version: 'v2.1', icon: '🌍', tagline: 'Internationalization with file + database loaders.', bullets: ['ICU-style plurals', 'Nested keys with dot notation', 'Locale middleware auto-detect', 'Database + file loaders'], install: 'composer require monkeyscloud/monkeyslegion-i18n', github: 'https://github.com/MonkeysCloud/MonkeysLegion-I18n', docs: '/docs/i18n', category: 'Operations' },
  { name: 'monkeyslegion-openapi', version: 'v1.0', icon: '📖', tagline: 'Auto-generated OpenAPI v3 documentation.', bullets: ['Routes + DTOs = spec', 'Swagger UI endpoint', 'No hand-maintained YAML', 'Tag-based grouping'], install: 'composer require monkeyscloud/monkeyslegion-openapi', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Openapi', docs: '/docs/openapi', category: 'Operations' },
  { name: 'monkeyslegion-cli', version: 'v2.0', icon: '⌨️', tagline: 'The ml binary. A reflection-driven CLI kernel.', bullets: ['17+ scaffolders', 'DB migrations, queue workers', 'Interactive REPL (tinker)', 'Custom command registration'], install: 'composer require monkeyscloud/monkeyslegion-cli', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Cli', docs: '/docs/cli', category: 'Tooling' },
  { name: 'monkeyslegion-dev-server', version: 'v1.0', icon: '🚀', tagline: 'Built-in development server with hot-reload.', bullets: ['Zero-config startup', 'File watcher with hot-reload', 'Request logging', 'SSL certificate support'], install: 'composer require --dev monkeyscloud/monkeyslegion-dev-server', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Dev-Server', docs: '/docs/dev-server', category: 'Tooling' },
  { name: 'monkeyslegion-apex', version: 'v1.0.1', icon: '🧠', tagline: 'AI orchestration engine for PHP 8.4.', bullets: ['Multi-provider routing (OpenAI, Anthropic, Google)', 'Declarative pipelines', 'Agent crews with MCP', 'Cost tracking and guardrails'], install: 'composer require monkeyscloud/monkeyslegion-apex', github: 'https://github.com/MonkeysCloud/MonkeysLegion-Apex', docs: '/apex', category: 'AI', highlight: true },
];

const categoryColors: Record<string, string> = {
  Foundation: '#8b5cf6',
  'HTTP & Routing': '#3b82f6',
  'Data Layer': '#06b6d4',
  'Auth & Security': '#10b981',
  Rendering: '#f59e0b',
  Infrastructure: '#ec4899',
  Operations: '#f97316',
  Tooling: '#6b7280',
  AI: '#a855f7',
};

const categoryIcons: Record<string, string> = {
  Foundation: '🏗️',
  'HTTP & Routing': '🌐',
  'Data Layer': '🗄️',
  'Auth & Security': '🔐',
  Rendering: '📝',
  Infrastructure: '⚡',
  Operations: '📊',
  Tooling: '🔧',
  AI: '🧠',
};

const allCategories = [...new Set(packages.map(p => p.category))];

function PackagesPageInner({ menuItems }: { menuItems: MenuItem[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = packages;
    if (activeCategory) result = result.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.bullets.some(b => b.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, activeCategory]);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPkg(name);
    setTimeout(() => setCopiedPkg(null), 2000);
  };

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        <PageHero
          eyebrow={`${packages.length} packages · All open source · MIT licensed`}
          title="Every package."
          titleGradient="One ecosystem."
          subtitle="MonkeysLegion is not a monolith. It's 26 independently-versioned Composer packages. Install the skeleton to get all of them, or require only the ones you need."
        >
          <a href="https://packagist.org/packages/monkeyscloud/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">View on Packagist →</a>
        </PageHero>

        {/* STATS BAR */}
        <section style={{ padding: 'var(--space-8) 0', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              {[
                { label: 'Packages', value: '27' },
                { label: 'PHP Minimum', value: '8.4' },
                { label: 'PSR Interfaces', value: '7, 11, 14, 15, 16, 17' },
                { label: 'License', value: 'MIT' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }} className="text-gradient">{stat.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH + FILTER BAR */}
        <section style={{ padding: 'var(--space-8) 0 var(--space-4)', background: 'var(--color-bg)', position: 'sticky', top: 60, zIndex: 50, backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            {/* SEARCH INPUT */}
            <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto var(--space-5)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search packages by name, feature, or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)', color: 'var(--color-text)',
                  fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'hsl(250, 95%, 65%)'; e.currentTarget.style.boxShadow = '0 0 0 3px hsla(250,95%,65%,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>
              )}
            </div>

            {/* CATEGORY FILTERS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                  border: `1px solid ${!activeCategory ? 'hsl(250,95%,65%)' : 'var(--color-border)'}`,
                  background: !activeCategory ? 'hsla(250,95%,65%,0.12)' : 'transparent',
                  color: !activeCategory ? 'hsl(250,95%,75%)' : 'var(--color-text-secondary)',
                  fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                All ({packages.length})
              </button>
              {allCategories.map(cat => {
                const count = packages.filter(p => p.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    style={{
                      padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                      border: `1px solid ${isActive ? categoryColors[cat] : 'var(--color-border)'}`,
                      background: isActive ? `${categoryColors[cat]}18` : 'transparent',
                      color: isActive ? categoryColors[cat] : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                  >
                    {categoryIcons[cat]} {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESULT COUNT */}
        <section style={{ padding: 'var(--space-4) 0 0', background: 'var(--color-bg)' }}>
          <div className="container">
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Showing <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> {filtered.length === 1 ? 'package' : 'packages'}
              {activeCategory && <> in <span style={{ color: categoryColors[activeCategory] }}>{activeCategory}</span></>}
              {search && <> matching &ldquo;<span style={{ color: 'var(--color-text)' }}>{search}</span>&rdquo;</>}
            </p>
          </div>
        </section>

        {/* PACKAGE LIST */}
        <section style={{ padding: 'var(--space-6) 0 var(--space-12)', background: 'var(--color-bg)' }}>
          <div className="container">
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>🔍</span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>No packages found</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Try a different search term or clear your filters.</p>
                <button onClick={() => { setSearch(''); setActiveCategory(null); }} className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {filtered.map((pkg, idx) => (
                  <AnimatedSection key={pkg.name} delay={idx * 0.02}>
                    <div
                      className="glass-card"
                      style={{
                        padding: 'var(--space-5) var(--space-6)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 'var(--space-4)',
                        alignItems: 'start',
                        borderLeft: `3px solid ${categoryColors[pkg.category]}`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 24px ${categoryColors[pkg.category]}15`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      onClick={() => window.location.href = pkg.docs}
                    >
                      {/* LEFT: Content */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.3rem' }}>{pkg.icon}</span>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, fontFamily: 'var(--font-code)', margin: 0 }}>{pkg.name}</h3>
                          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: categoryColors[pkg.category], fontWeight: 600, background: `${categoryColors[pkg.category]}15`, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{pkg.version}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{pkg.category}</span>
                          {pkg.highlight && <span style={{ fontSize: 'var(--text-xs)', color: '#a855f7', background: 'rgba(168,85,247,0.12)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>⭐ Featured</span>}
                        </div>

                        {/* Tagline */}
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{pkg.tagline}</p>

                        {/* Bullet points */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-4)', marginTop: 'var(--space-1)' }}>
                          {pkg.bullets.map((b, bi) => (
                            <span key={bi} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                              <span style={{ color: categoryColors[pkg.category], fontSize: '0.5rem' }}>●</span> {b}
                            </span>
                          ))}
                        </div>

                        {/* Install + Links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(pkg.install, pkg.name); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.6rem',
                              cursor: 'pointer', transition: 'border-color 0.15s', fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = categoryColors[pkg.category]}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                          >
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{pkg.install}</code>
                            <span style={{ fontSize: 'var(--text-xs)', color: copiedPkg === pkg.name ? '#10b981' : 'var(--color-text-muted)', transition: 'color 0.15s', flexShrink: 0 }}>
                              {copiedPkg === pkg.name ? '✓ Copied' : '📋'}
                            </span>
                          </button>
                          <a href={pkg.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                            GitHub →
                          </a>
                        </div>
                      </div>

                      {/* RIGHT: Docs link arrow */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-1)' }}>
                        <a
                          href={pkg.docs}
                          onClick={e => e.stopPropagation()}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                            background: `${categoryColors[pkg.category]}12`, border: `1px solid ${categoryColors[pkg.category]}30`,
                            color: categoryColors[pkg.category], textDecoration: 'none',
                            transition: 'background 0.15s, transform 0.15s', fontSize: '1.1rem',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${categoryColors[pkg.category]}25`; e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${categoryColors[pkg.category]}12`; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          →
                        </a>
                        <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Docs</span>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* INSTALL ALL CTA */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">All packages. <span className="text-gradient">One command.</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>The skeleton includes all framework packages preconfigured and ready to go.</p>
              <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer create-project monkeyscloud/monkeyslegion-skeleton my-app</span></div></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/" className="btn btn-primary btn-lg">Framework home →</a>
                <a href="/features" className="btn btn-secondary btn-lg">Feature deep-dives →</a>
                <a href="/apex" className="btn btn-secondary btn-lg">Apex AI →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignPackagesPage() {
  return <PackagesPageInner menuItems={designMenu} />;
}
