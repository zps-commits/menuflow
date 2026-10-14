import { catalog } from '@/data/catalog';
import type { Catalog, Category, OptionChoice, Product } from '@/types/menu';

/**
 * Catalog lookups. Everything that reads the menu goes through here, so the
 * data shape is known in one place rather than spread across components.
 */

const productsById = new Map<string, Product>(catalog.products.map((p) => [p.id, p]));
const categoriesById = new Map<string, Category>(catalog.categories.map((c) => [c.id, c]));

const choicesById = new Map<string, OptionChoice>(
  catalog.products.flatMap((p) => p.optionGroups.flatMap((g) => g.choices.map((c) => [c.id, c] as const))),
);

export function getCatalog(): Catalog {
  return catalog;
}

export function getProduct(id: string): Product | undefined {
  return productsById.get(id);
}

export function getCategory(id: string): Category | undefined {
  return categoriesById.get(id);
}

export function getChoice(id: string): OptionChoice | undefined {
  return choicesById.get(id);
}

/** The choices a product actually offers, as a set, for validating input. */
export function choiceIdsFor(product: Product): Set<string> {
  return new Set(product.optionGroups.flatMap((g) => g.choices.map((c) => c.id)));
}

/**
 * Structural problems in the catalog, as a list of messages. Used by a test so
 * a malformed menu fails the build rather than reaching a customer.
 */
export function catalogProblems(source: Catalog = catalog): string[] {
  const problems: string[] = [];
  const categoryIds = new Set(source.categories.map((c) => c.id));
  const seenProducts = new Set<string>();
  const seenChoices = new Set<string>();

  if (!/^\d{10,15}$/.test(source.restaurant.whatsapp)) {
    problems.push('restaurant.whatsapp must be 10 to 15 digits, international format, no symbols');
  }

  for (const product of source.products) {
    if (seenProducts.has(product.id)) problems.push(`duplicate product id: ${product.id}`);
    seenProducts.add(product.id);

    if (!categoryIds.has(product.categoryId)) {
      problems.push(`${product.id} points at a category that does not exist: ${product.categoryId}`);
    }
    if (!Number.isInteger(product.price) || product.price < 0) {
      problems.push(`${product.id} price must be a non-negative integer of cents`);
    }

    for (const group of product.optionGroups) {
      if (group.min < 0 || group.max < group.min) {
        problems.push(`${product.id}/${group.id} has an impossible min/max`);
      }
      if (group.max > group.choices.length) {
        problems.push(`${product.id}/${group.id} allows more selections than it has choices`);
      }
      for (const choice of group.choices) {
        if (seenChoices.has(choice.id)) problems.push(`duplicate choice id: ${choice.id}`);
        seenChoices.add(choice.id);
        if (!Number.isInteger(choice.priceDelta) || choice.priceDelta < 0) {
          problems.push(`${choice.id} priceDelta must be a non-negative integer of cents`);
        }
      }
    }
  }

  return problems;
}
