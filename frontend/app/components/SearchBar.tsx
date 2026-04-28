'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'documentation' | 'blog' | 'news' | 'event' | 'package' | 'user';
  title: string;
  excerpt?: string;
  url: string;
  category?: string;
  version?: string;
  date?: string;
  avatarUrl?: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  package:       { label: 'Packages',      icon: '📦', color: 'hsl(140, 70%, 55%)', bg: 'hsla(140, 70%, 50%, 0.15)' },
  user:          { label: 'Users',         icon: '👤', color: 'hsl(200, 80%, 65%)', bg: 'hsla(200, 80%, 50%, 0.15)' },
  documentation: { label: 'Documentation', icon: '📚', color: 'hsl(250, 95%, 75%)', bg: 'hsla(250, 85%, 60%, 0.15)' },
  blog:          { label: 'Blog',          icon: '📝', color: 'hsl(35, 90%, 65%)',  bg: 'hsla(35, 90%, 50%, 0.15)' },
  news:          { label: 'News',          icon: '📰', color: 'hsl(170, 75%, 55%)', bg: 'hsla(170, 75%, 50%, 0.15)' },
  event:         { label: 'Events',        icon: '📅', color: 'hsl(300, 70%, 65%)', bg: 'hsla(300, 70%, 50%, 0.15)' },
};

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build a flat list of all result items for keyboard navigation
  const flatResults = results;

  // Group results by type
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Open modal
  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Close modal
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
  }, []);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) close(); else open();
      }
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close]);

  // Live search with debounce
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 250);
  };

  // Navigate to result
  const navigateTo = useCallback((url: string) => {
    close();
    router.push(url);
  }, [close, router]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        navigateTo(flatResults[activeIndex].url);
      } else if (query.trim()) {
        navigateTo(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0) {
      const el = document.getElementById(`search-result-${activeIndex}`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  // The trigger button
  const triggerButton = (
    <button
      onClick={open}
      id="search-trigger"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'hsla(230, 20%, 14%, 0.7)',
        border: '1px solid hsla(230, 20%, 30%, 0.4)',
        borderRadius: '9999px',
        cursor: 'pointer',
        color: 'hsla(230, 15%, 60%, 1)',
        fontSize: '0.875rem',
        fontFamily: 'inherit',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'hsla(250, 85%, 60%, 0.4)';
        e.currentTarget.style.background = 'hsla(230, 20%, 16%, 0.8)';
        e.currentTarget.style.color = 'hsla(230, 15%, 80%, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'hsla(230, 20%, 30%, 0.4)';
        e.currentTarget.style.background = 'hsla(230, 20%, 14%, 0.7)';
        e.currentTarget.style.color = 'hsla(230, 15%, 60%, 1)';
      }}
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ opacity: 0.7 }}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Search
      <kbd style={{
        fontSize: '0.65rem', opacity: 0.5, marginLeft: '0.25rem',
        padding: '1px 5px', border: '1px solid hsla(230, 20%, 30%, 0.5)',
        borderRadius: 4, fontFamily: 'inherit', lineHeight: '1.4',
      }}>⌘K</kbd>
    </button>
  );

  if (compact && !isOpen) {
    return triggerButton;
  }

  return (
    <>
      {triggerButton}

      {/* Modal overlay */}
      {isOpen && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0,
            background: 'transparent',
            zIndex: 99999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '12vh',
          }}
        >
          <div
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 640,
              background: 'hsl(230, 22%, 10%)',
              border: '1px solid hsla(250, 60%, 40%, 0.3)',
              borderRadius: 16,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.7), 0 0 120px 40px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              animation: 'searchModalIn 0.2s ease-out',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search input area */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 20px',
              gap: '12px',
              borderBottom: '1px solid hsla(230, 20%, 25%, 0.5)',
              flexShrink: 0,
            }}>
              {loading ? (
                <div style={{
                  width: 20, height: 20, flexShrink: 0,
                  border: '2px solid hsla(230, 20%, 30%, 0.5)',
                  borderTopColor: 'hsl(250, 85%, 60%)',
                  borderRadius: '50%',
                  animation: 'searchSpin 0.6s linear infinite',
                }} />
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, color: 'hsl(250, 85%, 60%)' }}>
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search packages, users, docs, blog…"
                autoFocus
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'hsl(0, 0%, 95%)', fontSize: '1rem',
                  fontFamily: 'inherit',
                  caretColor: 'hsl(250, 85%, 60%)',
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setResults([]); setActiveIndex(-1); inputRef.current?.focus(); }}
                  style={{
                    background: 'hsla(230, 20%, 25%, 0.6)', border: 'none',
                    borderRadius: '50%', width: 24, height: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'hsl(230, 15%, 60%)',
                    fontSize: '0.8rem', flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'hsla(230, 20%, 35%, 0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'hsla(230, 20%, 25%, 0.6)'; }}
                >×</button>
              )}
              <kbd style={{
                fontSize: '0.65rem', padding: '2px 6px',
                border: '1px solid hsla(230, 20%, 30%, 0.5)',
                borderRadius: 4, color: 'hsl(230, 15%, 45%)',
                fontFamily: 'inherit', flexShrink: 0,
              }}>ESC</kbd>
            </div>

            {/* Results area */}
            <div style={{
              overflowY: 'auto',
              flex: 1,
            }}>
              {/* Grouped results */}
              {Object.keys(grouped).length > 0 && (
                <div style={{ padding: '8px 0' }}>
                  {(['package', 'user', 'documentation', 'blog', 'news', 'event'] as const).map((type) => {
                    const items = grouped[type];
                    if (!items || items.length === 0) return null;
                    const cfg = TYPE_CONFIG[type];
                    return (
                      <div key={type}>
                        {/* Category header */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 20px 6px',
                          fontSize: '0.7rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          color: cfg.color,
                        }}>
                          <span>{cfg.icon}</span>
                          <span>{cfg.label}</span>
                          <span style={{
                            padding: '0 6px', borderRadius: '999px',
                            background: cfg.bg, fontSize: '0.65rem',
                            fontWeight: 600, lineHeight: '1.6',
                          }}>{items.length}</span>
                        </div>
                        {/* Items */}
                        {items.map((result) => {
                          const globalIdx = flatResults.indexOf(result);
                          const isActive = globalIdx === activeIndex;
                          return (
                            <button
                              key={result.id}
                              id={`search-result-${globalIdx}`}
                              onClick={() => navigateTo(result.url)}
                              onMouseEnter={() => setActiveIndex(globalIdx)}
                              style={{
                                display: 'flex', alignItems: 'flex-start', gap: '12px',
                                width: '100%', textAlign: 'left',
                                padding: '10px 20px',
                                margin: '0 8px',
                                maxWidth: 'calc(100% - 16px)',
                                background: isActive ? 'hsla(250, 85%, 60%, 0.1)' : 'transparent',
                                border: 'none', borderRadius: 8,
                                cursor: 'pointer',
                                transition: 'background 0.1s',
                                fontFamily: 'inherit',
                              }}
                            >
                              {/* Icon indicator */}
                              <div style={{
                                width: 36, height: 36, flexShrink: 0,
                                borderRadius: 8,
                                background: isActive ? cfg.bg : 'hsla(230, 20%, 18%, 0.8)',
                                border: `1px solid ${isActive ? cfg.color + '33' : 'hsla(230, 20%, 25%, 0.5)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem',
                                transition: 'all 0.15s',
                              }}>
                                {type === 'package' ? (
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                    <path d="M12 12l9-4.5M12 12v10M12 12L3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                                  </svg>
                                ) : type === 'user' ? (
                                  result.avatarUrl ? (
                                    <img src={result.avatarUrl} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                                  ) : (
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  )
                                ) : type === 'documentation' ? (
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                ) : type === 'blog' ? (
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                    <path d="M4 4l4 16 4-8 4 8 4-16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : type === 'news' ? (
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M7 7h4v4H7zM13 7h4M13 11h4M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: isActive ? cfg.color : 'hsl(230, 15%, 50%)' }}>
                                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                )}
                              </div>

                              {/* Text content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '0.875rem', fontWeight: 600,
                                  color: isActive ? 'hsl(0, 0%, 95%)' : 'hsl(230, 15%, 75%)',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                  transition: 'color 0.1s',
                                  lineHeight: '1.4',
                                }}>
                                  {result.title}
                                </div>
                                {result.excerpt && (
                                  <div style={{
                                    fontSize: '0.75rem',
                                    color: 'hsl(230, 15%, 45%)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    marginTop: 2,
                                    lineHeight: '1.4',
                                  }}>
                                    {result.excerpt}
                                  </div>
                                )}
                                {/* Meta tags */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 4 }}>
                                  {result.version && (
                                    <span style={{
                                      fontSize: '0.6rem', fontWeight: 600,
                                      padding: '1px 5px', borderRadius: '999px',
                                      background: 'hsla(250, 85%, 60%, 0.1)',
                                      color: 'hsl(250, 95%, 75%)',
                                      fontFamily: 'var(--font-code, monospace)',
                                    }}>v{result.version}</span>
                                  )}
                                  {result.category && (
                                    <span style={{
                                      fontSize: '0.6rem', fontWeight: 500,
                                      color: 'hsl(230, 15%, 45%)',
                                    }}>{result.category}</span>
                                  )}
                                  {result.date && (
                                    <span style={{
                                      fontSize: '0.6rem',
                                      color: 'hsl(230, 15%, 40%)',
                                    }}>{new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  )}
                                </div>
                              </div>

                              {/* Arrow indicator */}
                              {isActive && (
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                                  style={{ flexShrink: 0, marginTop: 6, color: 'hsl(250, 85%, 60%)', opacity: 0.7 }}>
                                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results state */}
              {query.trim().length >= 2 && !loading && results.length === 0 && (
                <div style={{
                  padding: '32px 20px', textAlign: 'center',
                  color: 'hsl(230, 15%, 45%)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.4 }}>🔍</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>No results found for &ldquo;{query}&rdquo;</div>
                  <div style={{ fontSize: '0.75rem', marginTop: 4, opacity: 0.7 }}>
                    Try different keywords or browse by category
                  </div>
                </div>
              )}

              {/* Empty / prompt state */}
              {query.trim().length < 2 && results.length === 0 && !loading && (
                <div style={{ padding: '24px 20px' }}>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'hsl(230, 15%, 40%)',
                    marginBottom: 12,
                  }}>Search across</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                      <div key={key} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: 'hsla(230, 20%, 14%, 0.5)',
                        border: '1px solid hsla(230, 20%, 25%, 0.3)',
                      }}>
                        <span style={{ fontSize: '1rem' }}>{cfg.icon}</span>
                        <span style={{ fontSize: '0.8rem', color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '10px 20px',
              borderTop: '1px solid hsla(230, 20%, 25%, 0.5)',
              fontSize: '0.7rem',
              color: 'hsl(230, 15%, 40%)',
              flexShrink: 0,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', border: '1px solid hsla(230, 20%, 30%, 0.5)', borderRadius: 3, fontSize: '0.65rem', lineHeight: '1.5' }}>↑↓</kbd>
                navigate
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', border: '1px solid hsla(230, 20%, 30%, 0.5)', borderRadius: 3, fontSize: '0.65rem', lineHeight: '1.5' }}>↵</kbd>
                select
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', border: '1px solid hsla(230, 20%, 30%, 0.5)', borderRadius: 3, fontSize: '0.65rem', lineHeight: '1.5' }}>esc</kbd>
                close
              </span>
              {results.length > 0 && (
                <button
                  onClick={() => navigateTo(`/search?q=${encodeURIComponent(query.trim())}`)}
                  style={{
                    marginLeft: 'auto',
                    background: 'none', border: 'none',
                    color: 'hsl(250, 85%, 65%)',
                    fontSize: '0.7rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'hsl(250, 95%, 75%)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(250, 85%, 65%)'; }}
                >
                  View all results →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes searchOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes searchSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
