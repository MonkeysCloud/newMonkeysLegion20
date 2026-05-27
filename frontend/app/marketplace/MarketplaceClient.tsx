'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { MarketplacePackage, PackageCategory } from '@/lib/types';
import PackageCard from '../components/marketplace/PackageCard';
import CategoryFilter from '../components/marketplace/CategoryFilter';
import Link from 'next/link';

interface Props {
  initialPackages: MarketplacePackage[];
  initialTotal: number;
  categories: PackageCategory[];
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'stars', label: 'Most Starred' },
  { value: 'alpha', label: 'Alphabetical' },
];

const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3', 'ISC'];

const PAGE_SIZE = 24;

export default function MarketplaceClient({ initialPackages, initialTotal, categories }: Props) {
  const [packages, setPackages] = useState(initialPackages);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState('newest');
  const [license, setLicense] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Auto-suggestions state
  const [suggestions, setSuggestions] = useState<MarketplacePackage[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const doSearch = useCallback(async (overrides?: Record<string, string>) => {
    const params: Record<string, string> = {};
    const s = overrides?.search ?? search;
    if (s) params.search = s;
    if (overrides?.category ?? category) params.category = (overrides?.category ?? category)!;
    if (overrides?.license ?? license) params.license = (overrides?.license ?? license)!;
    params.sort = overrides?.sort ?? sort;
    params.page = overrides?.page ?? String(page);
    params.pageSize = String(PAGE_SIZE);

    setLoading(true);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/marketplace?${qs}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
        setTotal(data.total || 0);
      }
    } catch { /* keep state */ }
    finally { setLoading(false); }
  }, [search, category, license, sort, page]);

  // Debounced auto-suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const res = await fetch(`/api/marketplace?search=${encodeURIComponent(query)}&page=0`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions((data.packages || []).slice(0, 5));
        setShowSuggestions(true);
      }
    } catch { /* ignore */ }
    finally { setSuggestionsLoading(false); }
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);

    // Debounce suggestions
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
    setPage(0);
    setTimeout(() => doSearch({ category: cat || '', page: '0' }), 50);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setPage(0);
    setTimeout(() => doSearch({ sort: s, page: '0' }), 50);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => doSearch({ page: String(newPage) }), 50);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Build a sliding window of page buttons around the current page
  const getPageNumbers = (): number[] => {
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, page - half);
    let end = start + maxVisible - 1;
    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <main>
      {/* Hero */}
      <section className="marketplace-hero">
        <div className="container">
          <span className="eyebrow">📦 Package Marketplace</span>
          <h1>Discover <span className="text-gradient">Packages</span></h1>
          <p>Browse community packages, tools, and extensions for the MonkeysLegion ecosystem.</p>

          <div className="marketplace-search" ref={suggestionsRef}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setShowSuggestions(false); doSearch({ page: '0' }); } }}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            />

            {/* Auto-suggestions dropdown */}
            {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
              <div className="search-suggestions">
                {suggestionsLoading && <div className="search-suggestion-item loading">Searching...</div>}
                {suggestions.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/marketplace/${pkg.slug}`}
                    className="search-suggestion-item"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <span className="suggestion-icon">{pkg.icon || '📦'}</span>
                    <div className="suggestion-info">
                      <span className="suggestion-title">{pkg.title}</span>
                      <span className="suggestion-summary">{pkg.summary}</span>
                    </div>
                    <span className="suggestion-version">v{pkg.version}</span>
                  </Link>
                ))}
                {!suggestionsLoading && suggestions.length > 0 && (
                  <button
                    className="search-suggestion-item search-suggestion-all"
                    onClick={() => { setShowSuggestions(false); doSearch({ page: '0' }); }}
                  >
                    View all results for &ldquo;{search}&rdquo; →
                  </button>
                )}
              </div>
            )}
          </div>

          <CategoryFilter categories={categories} active={category} onSelect={handleCategoryChange} />
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="marketplace-content">
            {/* Sidebar */}
            <aside className="marketplace-sidebar">
              <div className="filter-section">
                <h3>Sort By</h3>
                <ul className="filter-list">
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt.value} className={sort === opt.value ? 'active' : ''} onClick={() => handleSortChange(opt.value)}>
                      {opt.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-section">
                <h3>License</h3>
                <ul className="filter-list">
                  <li className={!license ? 'active' : ''} onClick={() => { setLicense(null); setTimeout(() => doSearch({ license: '', page: '0' }), 50); }}>All Licenses</li>
                  {LICENSES.map((l) => (
                    <li key={l} className={license === l ? 'active' : ''} onClick={() => { setLicense(l); setPage(0); setTimeout(() => doSearch({ license: l, page: '0' }), 50); }}>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 'var(--space-8)' }}>
                <Link href="/dashboard/publish" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  + Publish Package
                </Link>
              </div>
            </aside>

            {/* Main grid */}
            <div className="marketplace-main">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {total} package{total !== 1 ? 's' : ''} found
                </span>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</div>
              )}

              {!loading && packages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h2>No packages found</h2>
                  <p>Be the first to publish a package to the marketplace!</p>
                  <Link href="/dashboard/publish" className="btn btn-primary">Publish a Package</Link>
                </div>
              )}

              {!loading && packages.length > 0 && (
                <div className="packages-grid">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>← Prev</button>
                  {getPageNumbers()[0] > 0 && (
                    <>
                      <button className={page === 0 ? 'active' : ''} onClick={() => handlePageChange(0)}>1</button>
                      {getPageNumbers()[0] > 1 && <span className="pagination-ellipsis">…</span>}
                    </>
                  )}
                  {getPageNumbers().map((i) => (
                    <button key={i} className={page === i ? 'active' : ''} onClick={() => handlePageChange(i)}>
                      {i + 1}
                    </button>
                  ))}
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <>
                      {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 2 && <span className="pagination-ellipsis">…</span>}
                      <button className={page === totalPages - 1 ? 'active' : ''} onClick={() => handlePageChange(totalPages - 1)}>
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>Next →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
