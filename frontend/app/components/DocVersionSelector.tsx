'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface DocVersionSelectorProps {
  currentVersion: string;
  availableVersions: string[];
}

/**
 * Client-side version selector for documentation pages.
 * When a different version is selected, navigates to the same doc page
 * with the ?v= query parameter to load that version.
 */
export default function DocVersionSelector({ currentVersion, availableVersions }: DocVersionSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (availableVersions.length <= 1) {
    // Only one version — show as static badge
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--color-primary-light)',
          background: 'hsla(250, 85%, 60%, 0.1)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid hsla(250, 85%, 60%, 0.2)',
        }}
      >
        v{currentVersion}
      </span>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <label
        htmlFor="doc-version-select"
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Version
      </label>
      <select
        id="doc-version-select"
        value={currentVersion}
        onChange={(e) => {
          const newVersion = e.target.value;
          router.push(`${pathname}?v=${newVersion}`);
        }}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          padding: '4px 28px 4px 10px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-primary-light)',
          background: `hsla(250, 85%, 60%, 0.1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`,
          border: '1px solid hsla(250, 85%, 60%, 0.25)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'hsla(250, 85%, 60%, 0.5)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'hsla(250, 85%, 60%, 0.25)'}
      >
        {availableVersions.map((v) => (
          <option key={v} value={v} style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            v{v}{v === availableVersions[0] ? ' (latest)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
