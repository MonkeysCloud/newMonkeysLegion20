'use client';

import type { MenuItem } from './layout/Navbar';

/* ─── Social icons (inline SVG for zero-dependency rendering) ─── */

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const SlackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/></svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

/* ─── Resources links ─── */
const resources = [
  { label: 'Documentation', url: '/docs' },
  { label: 'Starter Kits', url: '/packages' },
  { label: 'Release Notes', url: '/blog' },
  { label: 'Blog', url: '/blog' },
  { label: 'News', url: '/news' },
  { label: 'Community', url: '/events' },
];

const socials = [
  { icon: <GithubIcon />, url: 'https://github.com/MonkeysCloud', label: 'GitHub' },
  { icon: <TwitterIcon />, url: 'https://x.com/monkeyscloud', label: 'Twitter' },
  { icon: <SlackIcon />, url: 'https://monkeyscloud.slack.com', label: 'Slack' },
  { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/monkeyscloud', label: 'LinkedIn' },
];

interface FooterProps {
  menuItems?: MenuItem[];
}

export default function Footer({ menuItems = [] }: FooterProps) {
  return (
    <footer style={{
      padding: 'var(--space-12) 0 var(--space-6)',
      borderTop: '1px solid var(--color-border)',
      background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(230, 25%, 6%) 100%)',
    }}>
      <div className="container">
        {/* ═══ MAIN GRID ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: 'var(--space-8)',
          paddingBottom: 'var(--space-10)',
          borderBottom: '1px solid hsla(230, 20%, 20%, 0.4)',
        }}>
          {/* ─── BRAND COLUMN ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <img
                src="/monkeyslegion-icon.svg"
                alt="MonkeysLegion"
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 'var(--radius-lg)',
                  filter: 'drop-shadow(0 0 16px hsla(250, 80%, 60%, 0.35))',
                }}
              />
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-code)',
              }}>
                v2.0 · PHP 8.4+ · MIT
              </div>
            </div>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              maxWidth: 320,
              margin: 0,
            }}>
              The enterprise PHP framework that ships with everything.
              28 packages. Zero compromises.
            </p>

            {/* SOCIAL ICONS */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(250, 95%, 75%)';
                    e.currentTarget.style.borderColor = 'hsl(250, 95%, 65%)';
                    e.currentTarget.style.background = 'hsla(250, 95%, 65%, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.background = 'var(--color-surface)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ─── NAVIGATION COLUMN ─── */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-4)', margin: '0 0 var(--space-4)',
            }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {(menuItems.length > 0
                ? menuItems.filter(m => m.url !== '#').map(m => ({ label: m.title, url: m.url }))
                : [
                    { label: 'Home', url: '/' },
                    { label: 'Features', url: '/features' },
                    { label: 'Packages', url: '/packages' },
                    { label: 'Apex AI', url: '/apex' },
                    { label: 'Documentation', url: '/docs' },
                  ]
              ).map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    style={{
                      fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── RESOURCES COLUMN ─── */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-4)', margin: '0 0 var(--space-4)',
            }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    style={{
                      fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── COMPARE COLUMN ─── */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-4)', margin: '0 0 var(--space-4)',
            }}>
              Compare
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'vs Laravel', url: '/compare-laravel' },
                { label: 'vs Symfony', url: '/compare-symfony' },
              ].map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    style={{
                      fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* STATS */}
            <div style={{ marginTop: 'var(--space-6)' }}>
              <h4 style={{
                fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-3)', margin: '0 0 var(--space-3)',
              }}>
                Stats
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {[
                  { label: 'Packages', value: '28' },
                  { label: 'Tests', value: '545' },
                  { label: 'Assertions', value: '1,145' },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{stat.label}</span>
                    <span style={{ fontFamily: 'var(--font-code)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM BAR ═══ */}
        <div style={{
          marginTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
        }}>
          <span>© {new Date().getFullYear()} MonkeysCloud. All rights reserved.</span>
          <span style={{ fontFamily: 'var(--font-code)' }}>
            Built with MonkeysLegion · Drupal · Next.js
          </span>
        </div>
      </div>

      {/* ═══ RESPONSIVE STYLES ═══ */}
      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
