import { getChoice, getProduct } from '@/domain/catalog';
import type { CartItem, Cents, Product } from '@/types/menu';

/** Hard limits. A menu is not a place to order 10,000 of anything. */
export const MAX_QUANTITY = 20;
export const MAX_NOTES = 200;

/**
 * Price of one unit: the product plus every selected choice.
 * Unknown choice ids contribute nothing rather than throwing, so a stale
 * stored cart degrades to the base price instead of breaking the page.
 */
export function unitPrice(product: Product, selectedChoiceIds: string[]): Cents {
  return selectedChoiceIds.reduce((total, id) => total + (getChoice(id)?.priceDelta ?? 0), product.price);
}

export type PricedLine = {
  item: CartItem;
  product: Product;
  /** Labels of the selected choices, in the order the menu lists them. */
  choiceLabels: string[];
  unit: Cents;
  total: Cents;
};

/**
 * Prices a cart against the *current* catalog.
 *
 * Stored prices are deliberately not trusted: a cart can sit in localStorage
 * for weeks, and the menu is reprinted far more often than that. Lines whose
 * product no longer exists, or is no longer available, are reported separately
 * so the interface can tell the customer instead of silently charging them.
 */
export function priceCart(items: CartItem[]): {
  lines: PricedLine[];
  dropped: CartItem[];
  subtotal: Cents;
  itemCount: number;
} {
  const lines: PricedLine[] = [];
  const dropped: CartItem[] = [];

  for (const item of items) {
    const product = getProduct(item.productId);
    if (!product || !product.available) {
      dropped.push(item);
      continue;
    }

    const ordered = product.optionGroups
      .flatMap((group) => group.choices)
      .filter((choice) => item.selectedChoiceIds.includes(choice.id));

    const unit = unitPrice(product, item.selectedChoiceIds);
    lines.push({
      item,
      product,
      choiceLabels: ordered.map((c) => c.label),
      unit,
      total: unit * item.quantity,
    });
  }

  return {
    lines,
    dropped,
    subtotal: lines.reduce((sum, line) => sum + line.total, 0),
    itemCount: lines.reduce((sum, line) => sum + line.item.quantity, 0),
  };
}
