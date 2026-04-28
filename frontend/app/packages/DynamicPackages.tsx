'use client';

import { useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import { AnimatedSection } from '../components/ui';
import type { MenuItem } from '../components/layout/Navbar';
import type { PackageInfo } from '@/lib/drupal';
import { packageCategoryColors, packageCategoryIcons } from '@/lib/drupal';

interface DynamicPackagesProps {
  menuItems: MenuItem[];
  packages: PackageInfo[];
}

export default function DynamicPackages({ menuItems, packages }: DynamicPackagesProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);

  const allCategories = useMemo(
    () => [...new Set(packages.map((p) => p.category))],
    [packages],
  );

  const filtered = useMemo(() => {
    let result = packages;
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [packages, search, activeCategory]);

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
          subtitle="MonkeysLegion is not a monolith. It's independently-versioned Composer packages. Install the skeleton to get all of them, or require only the ones you need."
        >
          <a
            href="https://packagist.org/packages/monkeyscloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            View on Packagist →
          </a>
        </PageHero>

        {/* STATS BAR */}
        <section
          style={{
            padding: 'var(--space-8) 0',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-10)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'Packages', value: String(packages.length) },
                { label: 'PHP Minimum', value: '8.4' },
                { label: 'PSR Interfaces', value: '7, 11, 14, 15, 16, 17' },
                { label: 'License', value: 'MIT' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div
                    style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}
                    className="text-gradient"
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH + FILTER BAR */}
        <section
          style={{
            padding: 'var(--space-8) 0 var(--space-4)',
            background: 'var(--color-bg)',
            position: 'sticky',
            top: 60,
            zIndex: 50,
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            {/* SEARCH INPUT */}
            <div
              style={{
                position: 'relative',
                maxWidth: 600,
                margin: '0 auto var(--space-5)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search packages by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 3rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(250, 95%, 65%)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px hsla(250,95%,65%,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* CATEGORY FILTERS */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${!activeCategory ? 'hsl(250,95%,65%)' : 'var(--color-border)'}`,
                  background: !activeCategory
                    ? 'hsla(250,95%,65%,0.12)'
                    : 'transparent',
                  color: !activeCategory
                    ? 'hsl(250,95%,75%)'
                    : 'var(--color-text-secondary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                All ({packages.length})
              </button>
              {allCategories.map((cat) => {
                const count = packages.filter((p) => p.category === cat).length;
                const isActive = activeCategory === cat;
                const color = packageCategoryColors[cat] || '#6366f1';
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${isActive ? color : 'var(--color-border)'}`,
                      background: isActive ? `${color}18` : 'transparent',
                      color: isActive ? color : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {packageCategoryIcons[cat] || '📦'} {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESULT COUNT */}
        <section
          style={{
            padding: 'var(--space-4) 0 0',
            background: 'var(--color-bg)',
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                margin: 0,
              }}
            >
              Showing{' '}
              <strong style={{ color: 'var(--color-text)' }}>
                {filtered.length}
              </strong>{' '}
              {filtered.length === 1 ? 'package' : 'packages'}
              {activeCategory && (
                <>
                  {' '}
                  in{' '}
                  <span
                    style={{
                      color: packageCategoryColors[activeCategory] || '#6366f1',
                    }}
                  >
                    {activeCategory}
                  </span>
                </>
              )}
              {search && (
                <>
                  {' '}
                  matching &ldquo;
                  <span style={{ color: 'var(--color-text)' }}>{search}</span>
                  &rdquo;
                </>
              )}
            </p>
          </div>
        </section>

        {/* PACKAGE LIST */}
        <section
          style={{
            padding: 'var(--space-6) 0 var(--space-12)',
            background: 'var(--color-bg)',
          }}
        >
          <div className="container">
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
                <span
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  🔍
                </span>
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  No packages found
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  Try a different search term or clear your filters.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory(null);
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                {filtered.map((pkg, idx) => {
                  const color = packageCategoryColors[pkg.category] || '#6366f1';
                  const icon = packageCategoryIcons[pkg.category] || '📦';
                  const install = `composer require monkeyscloud/${pkg.name}`;
                  const github = `https://github.com/MonkeysCloud/${pkg.name
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join('-')}`;

                  return (
                    <AnimatedSection key={pkg.name} delay={idx * 0.02}>
                      <div
                        className="glass-card"
                        style={{
                          padding: 'var(--space-5) var(--space-6)',
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: 'var(--space-4)',
                          alignItems: 'start',
                          borderLeft: `3px solid ${color}`,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow = `0 4px 24px ${color}15`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() =>
                          (window.location.href = `/docs/${pkg.docsSlug}`)
                        }
                      >
                        {/* LEFT: Content */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                          }}
                        >
                          {/* Header row */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-3)',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                            <h3
                              style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: 700,
                                fontFamily: 'var(--font-code)',
                                margin: 0,
                              }}
                            >
                              {pkg.name}
                            </h3>
                            <span
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontFamily: 'var(--font-code)',
                                color,
                                fontWeight: 600,
                                background: `${color}15`,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                              }}
                            >
                              v{pkg.version}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-muted)',
                                background: 'var(--color-surface)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                              }}
                            >
                              {pkg.category}
                            </span>
                          </div>

                          {/* Install + Links */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-3)',
                              marginTop: 'var(--space-1)',
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(install, pkg.name);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.3rem 0.6rem',
                                cursor: 'pointer',
                                transition: 'border-color 0.15s',
                                fontFamily: 'inherit',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = color)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor =
                                  'var(--color-border)')
                              }
                            >
                              <code
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  color: 'var(--color-text-muted)',
                                }}
                              >
                                {install}
                              </code>
                              <span
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  color:
                                    copiedPkg === pkg.name
                                      ? '#10b981'
                                      : 'var(--color-text-muted)',
                                  transition: 'color 0.15s',
                                  flexShrink: 0,
                                }}
                              >
                                {copiedPkg === pkg.name ? '✓ Copied' : '📋'}
                              </span>
                            </button>
                            <a
                              href={github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                              }}
                            >
                              GitHub →
                            </a>
                          </div>
                        </div>

                        {/* RIGHT: Docs link arrow */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            paddingTop: 'var(--space-1)',
                          }}
                        >
                          <a
                            href={`/docs/${pkg.docsSlug}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: 'var(--radius-lg)',
                              background: `${color}12`,
                              border: `1px solid ${color}30`,
                              color,
                              textDecoration: 'none',
                              transition: 'background 0.15s, transform 0.15s',
                              fontSize: '1.1rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${color}25`;
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = `${color}12`;
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            →
                          </a>
                          <span
                            style={{
                              fontSize: '0.6rem',
                              color: 'var(--color-text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Docs
                          </span>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* INSTALL ALL CTA */}
        <section
          className="section"
          style={{
            textAlign: 'center',
            background:
              'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)',
          }}
        >
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">
                All packages. <span className="text-gradient">One command.</span>
              </h2>
              <p
                className="section-subtitle"
                style={{ margin: '0 auto var(--space-6)' }}
              >
                The skeleton includes all framework packages preconfigured and
                ready to go.
              </p>
              <div
                className="terminal"
                style={{
                  maxWidth: 550,
                  margin: '0 auto var(--space-8)',
                  textAlign: 'left',
                }}
              >
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                </div>
                <div className="terminal-body">
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-command">
                      composer create-project monkeyscloud/monkeyslegion-skeleton
                      my-app
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <a href="/" className="btn btn-primary btn-lg">
                  Framework home →
                </a>
                <a href="/features" className="btn btn-secondary btn-lg">
                  Feature deep-dives →
                </a>
                <a href="/docs" className="btn btn-secondary btn-lg">
                  Documentation →
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
