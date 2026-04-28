'use client';

import type { PackageCategory } from '@/lib/types';

interface Props {
  categories: PackageCategory[];
  active: string | null;
  onSelect: (name: string | null) => void;
}

export default function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <div className="category-pills">
      <button
        className={`category-pill${active === null ? ' active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill${active === cat.name ? ' active' : ''}`}
          onClick={() => onSelect(cat.name)}
        >
          {cat.name}
          {cat.count !== undefined && (
            <span className="pill-count">({cat.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
