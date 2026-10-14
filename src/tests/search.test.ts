import { describe, expect, it } from 'vitest';
import { ALL_CATEGORIES, countByCategory, filterProducts } from '@/domain/search';
import { catalog } from '@/data/catalog';

const products = catalog.products;

describe('filterProducts', () => {
  it('returns everything with no filters', () => {
    expect(filterProducts(products)).toHaveLength(products.length);
  });

  it('filters by category', () => {
    const pasta = filterProducts(products, { categoryId: 'pasta' });
    expect(pasta.length).toBeGreaterThan(0);
    expect(pasta.every((p) => p.categoryId === 'pasta')).toBe(true);
  });

  it('treats the all-categories token as no category filter', () => {
    expect(filterProducts(products, { categoryId: ALL_CATEGORIES })).toHaveLength(products.length);
  });

  it('searches the name', () => {
    const found = filterProducts(products, { query: 'ribeye' });
    expect(found.map((p) => p.id)).toContain('ribeye');
  });

  it('searches the description too', () => {
    const found = filterProducts(products, { query: 'pecorino' });
    expect(found.map((p) => p.id)).toContain('cacio-e-pepe');
  });

  it('ignores case and accents', () => {
    expect(filterProducts(products, { query: 'CACIO' }).map((p) => p.id)).toContain('cacio-e-pepe');
    expect(filterProducts(products, { query: 'farofa' }).length).toBeGreaterThanOrEqual(0);
  });

  it('returns an empty list when nothing matches, rather than everything', () => {
    expect(filterProducts(products, { query: 'zzzzz-not-on-the-menu' })).toEqual([]);
  });

  it('combines category and query', () => {
    const none = filterProducts(products, { categoryId: 'drinks', query: 'ribeye' });
    expect(none).toEqual([]);
  });

  it('counts products per category', () => {
    const counts = countByCategory(products);
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(products.length);
  });
});
