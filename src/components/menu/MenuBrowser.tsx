'use client';

import { useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { ALL_CATEGORIES, countByCategory, filterProducts } from '@/domain/search';
import type { Catalog } from '@/types/menu';

export default function MenuBrowser({ catalog }: { catalog: Catalog }) {
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES);
  const [query, setQuery] = useState('');
  const searchId = useId();

  const counts = useMemo(() => countByCategory(catalog.products), [catalog.products]);
  const visible = useMemo(
    () => filterProducts(catalog.products, { categoryId, query }),
    [catalog.products, categoryId, query],
  );

  const activeCategory = catalog.categories.find((c) => c.id === categoryId);

  return (
    <section className="shell pb-20 pt-10 md:pt-14" aria-labelledby="menu-heading">
      <h2 id="menu-heading" className="display-m">
        The menu
      </h2>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            Search the menu by dish or ingredient
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a dish or an ingredient"
            className="tap w-full rounded-full border border-rule bg-raised pl-11 pr-4 text-[0.9375rem] placeholder:text-subtle"
          />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by category">
          <CategoryChip
            label="Everything"
            count={catalog.products.length}
            active={categoryId === ALL_CATEGORIES}
            onClick={() => setCategoryId(ALL_CATEGORIES)}
          />
          {catalog.categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.label}
              count={counts.get(category.id) ?? 0}
              active={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            />
          ))}
        </div>
      </div>

      {activeCategory && (
        <p className="mt-6 text-[0.9375rem] text-muted">{activeCategory.description}</p>
      )}

      <p aria-live="polite" className="label mt-6 text-subtle">
        {visible.length} {visible.length === 1 ? 'dish' : 'dishes'}
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-xl border border-rule bg-raised p-8 text-center">
          <p className="display-s">Nothing matches that</p>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-muted">
            Try a shorter word, or clear the filters to see the whole menu.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategoryId(ALL_CATEGORIES);
            }}
            className="tap pressable mt-6 inline-flex items-center rounded-full bg-ember px-6 text-[0.9375rem] font-medium text-ember-ink"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} restaurant={catalog.restaurant} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`tap pressable shrink-0 rounded-full border px-4 text-[0.875rem] ${
        active
          ? 'border-ember bg-ember text-ember-ink'
          : 'border-rule bg-raised text-muted hover:border-rule-strong'
      }`}
    >
      {label} <span aria-hidden="true">({count})</span>
    </button>
  );
}
