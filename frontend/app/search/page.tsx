'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import type { SearchResult, SearchContentType } from '@/lib/types';

const TYPE_CONFIG: Record<SearchContentType, { label: string; icon: string; color: string; bg: string }> = {
  package: { label: 'Packages', icon: '📦', color: 'hsl(140, 70%, 55%)', bg: 'hsla(140, 70%, 50%, 0.15)' },
  user: { label: 'Users', icon: '👤', color: 'hsl(200, 80%, 65%)', bg: 'hsla(200, 80%, 50%, 0.15)' },
  documentation: { label: 'Docs', icon: '📚', color: 'hsl(250, 95%, 75%)', bg: 'hsla(250, 85%, 60%, 0.15)' },
  blog: { label: 'Blog', icon: '📝', color: 'hsl(35, 90%, 65%)', bg: 'hsla(35, 90%, 50%, 0.15)' },
  news: { label: 'News', icon: '📰', color: 'hsl(170, 75%, 55%)', bg: 'hsla(170, 75%, 50%, 0.15)' },
  event: { label: 'Event', icon: '📅', color: 'hsl(300, 70%, 65%)', bg: 'hsla(300, 70%, 50%, 0.15)' },
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<SearchContentType | 'all'>('all');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); setTotalCount(0); return; }
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      setResults(data.results || []);
      setTotalCount(data.total || 0);
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // Initial search from URL
  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, [initialQuery, performSearch]);

  // Debounced live search as user types
  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        performSearch(value);
        window.history.replaceState(null, '', `/search?q=${encodeURIComponent(value)}`);
      } else if (value.trim().length === 0) {
        setResults([]);
        setSearched(false);
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(query);
    window.history.replaceState(null, '', `/search?q=${encodeURIComponent(query)}`);
  };

  // Filter results by active type
  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter((r) => r.type === activeFilter);

  // Count per type for filter badges
  const typeCounts = results.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(60px + var(--space-12))', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
              Search <span className="text-gradient">MonkeysLegion</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Search across packages, users, documentation, blog, news, and events
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-2) var(--space-4)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.2)',
            }}>
              {/* Search icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.4 }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search packages, users, docs, blog…"
                autoFocus
                id="search-input"
                style={{
                  flex: 1, padding: 'var(--space-3) 0',
                  background: 'transparent', border: 'none',
                  color: 'var(--color-text)', fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-primary)', outline: 'none',
                }}
              />
              {loading && (
                <div style={{
                  width: 20, height: 20, border: '2px solid var(--color-border)',
                  borderTopColor: 'hsl(250, 85%, 60%)', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}/>
              )}
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus(); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', fontSize: '1.2rem', padding: '0 4px',
                  }}
                  aria-label="Clear search"
                >×</button>
              )}
              <button
                type="submit"
                style={{
                  padding: 'var(--space-2) var(--space-5)',
                  background: 'hsl(250, 85%, 60%)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)',
                  fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Search
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <kbd style={{
                padding: '1px 6px', border: '1px solid var(--color-border)',
                borderRadius: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                background: 'var(--color-surface)',
              }}>⌘K</kbd>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>for quick search</span>
            </div>
          </form>

          {/* Type filter tabs */}
          {searched && results.length > 0 && (
            <div style={{
              display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => setActiveFilter('all')}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: '999px', border: '1px solid',
                  borderColor: activeFilter === 'all' ? 'hsl(250, 85%, 60%)' : 'var(--color-border)',
                  background: activeFilter === 'all' ? 'hsla(250, 85%, 60%, 0.15)' : 'transparent',
                  color: activeFilter === 'all' ? 'hsl(250, 95%, 75%)' : 'var(--color-text-secondary)',
                  fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                All ({totalCount})
              </button>
              {(Object.keys(TYPE_CONFIG) as SearchContentType[]).map((type) => {
                const count = typeCounts[type] || 0;
                if (count === 0) return null;
                const cfg = TYPE_CONFIG[type];
                const isActive = activeFilter === type;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: '999px', border: '1px solid',
                      borderColor: isActive ? cfg.color : 'var(--color-border)',
                      background: isActive ? cfg.bg : 'transparent',
                      color: isActive ? cfg.color : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                    }}
                  >
                    {cfg.icon} {cfg.label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Results */}
          {searched && (
            <div>
              <p style={{
                fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-4)',
              }}>
                {filteredResults.length === 0
                  ? 'No results found.'
                  : `${filteredResults.length} result${filteredResults.length === 1 ? '' : 's'}${activeFilter !== 'all' ? ` in ${TYPE_CONFIG[activeFilter].label}` : ''}`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {filteredResults.map((result) => {
                  const cfg = TYPE_CONFIG[result.type];
                  return (
                    <Link key={result.id} href={result.url} style={{ textDecoration: 'none' }}>
                      <div
                        id={`result-${result.id}`}
                        style={{
                          padding: 'var(--space-5)',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'all 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = cfg.color;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 4px 16px hsla(0, 0%, 0%, 0.2)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Meta row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 'var(--text-xs)', fontWeight: 600,
                            padding: '2px 8px', borderRadius: '999px',
                            background: cfg.bg, color: cfg.color,
                          }}>
                            {cfg.icon} {cfg.label}
                          </span>
                          {result.category && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {result.category}
                            </span>
                          )}
                          {result.version && (
                            <span style={{
                              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)',
                              padding: '1px 6px', borderRadius: '999px',
                              background: 'hsla(250, 85%, 60%, 0.1)', color: 'hsl(250, 95%, 75%)',
                            }}>
                              v{result.version}
                            </span>
                          )}
                          {result.date && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: 'var(--text-base)', fontWeight: 700,
                          color: 'var(--color-text)', marginBottom: 'var(--space-1)',
                          lineHeight: 'var(--line-height-tight)',
                        }}>
                          {result.title}
                        </h3>

                        {/* Excerpt */}
                        {result.excerpt && (
                          <p style={{
                            fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                            lineHeight: 'var(--line-height-relaxed)', margin: 0,
                          }}>
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!searched && !loading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}>🔍</div>
              <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
                Search across all MonkeysLegion content
              </p>
              <div style={{
                display: 'flex', gap: 'var(--space-4)', justifyContent: 'center',
                marginTop: 'var(--space-6)', flexWrap: 'wrap',
              }}>
                {(Object.keys(TYPE_CONFIG) as SearchContentType[]).map((type) => {
                  const cfg = TYPE_CONFIG[type];
                  return (
                    <div key={type} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      fontSize: 'var(--text-sm)', color: cfg.color,
                    }}>
                      <span>{cfg.icon}</span> {cfg.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 'calc(60px + var(--space-16))', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading search…</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
