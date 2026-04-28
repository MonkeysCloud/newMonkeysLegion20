'use client';

import { useState, useCallback } from 'react';
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

export default function MarketplaceClient({ initialPackages, initialTotal, categories }: Props) {
  const [packages, setPackages] = useState(initialPackages);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState('newest');
  const [license, setLicense] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPackages = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`/api/search?type=marketplace&${qs}`);
      // Fallback: direct to Drupal via our proxy
      const drupalRes = await fetch(`/jsonapi/node/marketplace_package?sort=-created`);
      // Use our custom API
      const apiUrl = `/api/marketplace-proxy?${qs}`;
      // Simplify: use the server-side function via a simple endpoint
      const response = await fetch(`${window.location.origin}/api/marketplace?${qs}`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Keep current state
    } finally {
      setLoading(false);
    }
  }, []);

  const doSearch = useCallback(async () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (license) params.license = license;
    if (sort) params.sort = sort;
    params.page = String(page);

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

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
    // Debounced search would go here in production
  };

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
    setPage(0);
    setTimeout(doSearch, 50);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setPage(0);
    setTimeout(doSearch, 50);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <main>
      {/* Hero */}
      <section className="marketplace-hero">
        <div className="container">
          <span className="eyebrow">📦 Package Marketplace</span>
          <h1>Discover <span className="text-gradient">Packages</span></h1>
          <p>Browse community packages, tools, and extensions for the MonkeysLegion ecosystem.</p>

          <div className="marketplace-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            />
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
                  <li className={!license ? 'active' : ''} onClick={() => { setLicense(null); setTimeout(doSearch, 50); }}>All Licenses</li>
                  {LICENSES.map((l) => (
                    <li key={l} className={license === l ? 'active' : ''} onClick={() => { setLicense(l); setTimeout(doSearch, 50); }}>
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
                  <button disabled={page === 0} onClick={() => { setPage(page - 1); setTimeout(doSearch, 50); }}>← Prev</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <button key={i} className={page === i ? 'active' : ''} onClick={() => { setPage(i); setTimeout(doSearch, 50); }}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); setTimeout(doSearch, 50); }}>Next →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
