import { getProduct } from '@/domain/catalog';
import { clampNotes, clampQuantity, makeLineId } from '@/domain/cart';
import type { CartItem } from '@/types/menu';

/**
 * Cart persistence.
 *
 * The schema is versioned, and every value read back is validated against the
 * current catalog before it is trusted. A cart that has been sitting in a
 * browser for weeks, or edited by hand in devtools, must not be able to put a
 * price or a product into the order that the menu does not currently offer.
 */
const KEY = 'menuflow.cart.v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Keeps only lines that still make sense; silently drops the rest. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.items)) return [];

  const items: CartItem[] = [];
  const seen = new Set<string>();

  for (const entry of parsed.items) {
    if (!isRecord(entry)) continue;

    const productId = typeof entry.productId === 'string' ? entry.productId : null;
    if (!productId) continue;

    const product = getProduct(productId);
    if (!product) continue;

    const offered = new Set(product.optionGroups.flatMap((g) => g.choices.map((c) => c.id)));
    const selectedChoiceIds = Array.isArray(entry.selectedChoiceIds)
      ? [...new Set(entry.selectedChoiceIds.filter((id): id is string => typeof id === 'string' && offered.has(id)))].sort()
      : [];

    const lineId = makeLineId(productId, selectedChoiceIds);
    if (seen.has(lineId)) continue;
    seen.add(lineId);

    items.push({
      lineId,
      productId,
      quantity: clampQuantity(typeof entry.quantity === 'number' ? entry.quantity : 1),
      selectedChoiceIds,
      notes: clampNotes(typeof entry.notes === 'string' ? entry.notes : ''),
    });
  }

  return items;
}

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseStoredCart(window.localStorage.getItem(KEY));
  } catch {
    // Private mode, disabled storage, quota: the menu still has to work.
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: 1, items }));
  } catch {
    // Nothing to do, and nothing worth interrupting the customer for.
  }
}

export const CART_STORAGE_KEY = KEY;
