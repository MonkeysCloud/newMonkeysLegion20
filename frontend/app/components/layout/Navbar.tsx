'use client';

import { useState, useEffect, useRef } from 'react';
import SearchBar from '../SearchBar';
import { useAuth } from '../auth/AuthProvider';

export interface MenuItem {
  title: string;
  url: string;
  children?: MenuItem[];
}

interface NavbarProps {
  menuItems?: MenuItem[];
}

function DropdownItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: 'var(--text-sm)', fontWeight: 600,
          color: 'var(--color-text-secondary)', letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: '0.3em',
          padding: 0, fontFamily: 'inherit',
        }}
      >
        {item.title}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 0.5rem)', left: '50%', transform: 'translateX(-50%)',
          minWidth: 180, padding: 'var(--space-2)',
          background: 'rgba(18, 18, 30, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', gap: '2px',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {item.children!.map((child, ci) => (
            <a key={ci} href={child.url} onClick={() => setOpen(false)} style={{
              display: 'block', padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)', fontWeight: 500,
              color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-sm)',
              textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              {child.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Thin top utility bar ─── */
const topBarLinkStyle: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.02em',
  color: 'hsla(230, 15%, 55%, 1)', textDecoration: 'none',
  transition: 'color 0.15s',
  whiteSpace: 'nowrap',
};

function TopBar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const profileUrl = user?.slug ? `/u/${user.slug}` : user?.uuid ? `/u/${user.uuid}` : '#';

  return (
    <div className="topbar-desktop" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
      height: 32,
      background: 'hsla(230, 22%, 8%, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid hsla(230, 20%, 18%, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 1200,
        padding: '0 var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left side — secondary links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <a href="/marketplace" style={topBarLinkStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'hsl(140, 70%, 55%)'}
            onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
          >
            📦 Marketplace
          </a>
          <a href="https://github.com/MonkeysCloud/MonkeysLegion-Skeleton" target="_blank" rel="noopener noreferrer" style={topBarLinkStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'hsl(0, 0%, 85%)'}
            onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
          >
            ⭐ GitHub
          </a>
        </div>

        {/* Right side — auth / user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {isLoading ? null : isAuthenticated ? (
            <>
              <a href="/dashboard" style={topBarLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(250, 95%, 75%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
              >
                Dashboard
              </a>
              <a href="/dashboard/publish" style={topBarLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(250, 95%, 75%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
              >
                Publish
              </a>
              <a href="/dashboard/settings" style={topBarLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(250, 95%, 75%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
              >
                Settings
              </a>
              <span style={{ width: 1, height: 14, background: 'hsla(230, 20%, 30%, 0.6)' }} />
              <a href={profileUrl} style={{ ...topBarLinkStyle, display: 'flex', alignItems: 'center', gap: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(250, 95%, 75%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                ) : null}
                {user?.name || 'Profile'}
              </a>
              <button onClick={logout} style={{
                ...topBarLinkStyle,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', padding: 0,
                color: 'hsla(0, 60%, 55%, 0.8)',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(0, 70%, 65%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(0, 60%, 55%, 0.8)'}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={topBarLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(0, 0%, 85%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsla(230, 15%, 55%, 1)'}
              >
                Login
              </a>
              <a href="/register" style={{
                ...topBarLinkStyle,
                color: 'hsl(250, 95%, 80%)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid hsla(250, 85%, 60%, 0.3)',
                background: 'hsla(250, 85%, 60%, 0.08)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'hsla(250, 85%, 60%, 0.15)'; e.currentTarget.style.borderColor = 'hsla(250, 85%, 60%, 0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'hsla(250, 85%, 60%, 0.08)'; e.currentTarget.style.borderColor = 'hsla(250, 85%, 60%, 0.3)'; }}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ menuItems = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <TopBar />

      {/* Main pill navbar — offset below topbar (32px) */}
      <div style={{ position: 'fixed', top: 'calc(32px + var(--space-3))', left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <nav id="navbar" className={scrolled ? "glass-nav" : ""} style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-6)',
          width: 'calc(100% - var(--space-8))',
          maxWidth: '1200px',
          borderRadius: 'var(--radius-full)',
          background: scrolled ? undefined : 'transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.98)',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <img src="/monkeyslegion-logo.svg" alt="MonkeysLegion" style={{ height: 42 }} />
          </a>

          {/* Desktop Nav — framework links only */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            {menuItems.map((item, idx) =>
              item.children && item.children.length > 0 ? (
                <DropdownItem key={idx} item={item} />
              ) : (
                <a key={idx} href={item.url} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.02em' }}>
                  {item.title}
                </a>
              )
            )}

            <SearchBar compact />
          </div>

          {/* Mobile Hamburger Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }} className="mobile-only-flex">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', padding: 'var(--space-2)' }}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: 'var(--color-bg)',
          padding: 'var(--space-24) var(--space-6) var(--space-6)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
          overflowY: 'auto'
        }}>
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.children && item.children.length > 0 ? (
                <div>
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-3)' }}>{item.title}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 'var(--space-4)', borderLeft: '2px solid var(--color-border)' }}>
                    {item.children.map((child, ci) => (
                      <a key={ci} href={child.url} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--text-lg)', fontWeight: 500 }}>
                        {child.title}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.url} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--text-xl)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                  {item.title}
                </a>
              )}
            </div>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <SearchBar compact />
            <a href="https://github.com/MonkeysCloud/MonkeysLegion-Skeleton" target="_blank" rel="noopener noreferrer"
              className="btn btn-secondary w-full" style={{ marginTop: 'var(--space-4)', display: 'block', textAlign: 'center', borderRadius: 'var(--radius-full)' }}>
              ⭐ View on GitHub
            </a>
          </div>
        </div>
      )}
    </>
  );
}
