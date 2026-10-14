import type { Product } from '@/types/menu';

/**
 * Menu filtering. Kept as a pure function so the behaviour that matters,
 * including "no results", can be tested without rendering anything.
 */

export const ALL_CATEGORIES = 'all';

/** Strips accents and case so "pao" finds "pão". */
function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function filterProducts(
  products: Product[],
  options: { categoryId?: string; query?: string } = {},
): Product[] {
  const categoryId = options.categoryId ?? ALL_CATEGORIES;
  const needle = fold(options.query ?? '');

  return products.filter((product) => {
    if (categoryId !== ALL_CATEGORIES && product.categoryId !== categoryId) return false;
    if (!needle) return true;
    return fold(product.name).includes(needle) || fold(product.description).includes(needle);
  });
}

/** How many products each category would show, for the filter counts. */
export function countByCategory(products: Product[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
  }
  return counts;
}
