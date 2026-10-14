import { describe, expect, it } from 'vitest';
import { catalogProblems, getCategory, getProduct } from '@/domain/catalog';
import { catalog } from '@/data/catalog';

describe('catalog', () => {
  it('is structurally valid', () => {
    expect(catalogProblems()).toEqual([]);
  });

  it('exposes every product by id', () => {
    for (const product of catalog.products) {
      expect(getProduct(product.id)?.name).toBe(product.name);
    }
  });

  it('gives every product a category that exists', () => {
    for (const product of catalog.products) {
      expect(getCategory(product.categoryId)).toBeDefined();
    }
  });

  it('keeps every price as an integer number of cents', () => {
    for (const product of catalog.products) {
      expect(Number.isInteger(product.price)).toBe(true);
    }
  });

  it('includes at least one unavailable product, so that path is exercised', () => {
    expect(catalog.products.some((p) => !p.available)).toBe(true);
  });
});
