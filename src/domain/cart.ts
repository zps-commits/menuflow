import { choiceIdsFor } from '@/domain/catalog';
import { MAX_NOTES, MAX_QUANTITY } from '@/domain/pricing';
import type { CartItem, Product } from '@/types/menu';

/**
 * Identity of a cart line.
 *
 * Two of the same dish are only the same line when every choice matches, so a
 * rare ribeye and a well-done ribeye sit side by side instead of merging into
 * "2x ribeye" and arriving wrong. Ids are sorted so selection order cannot
 * produce two lines that are really the same thing.
 */
export function makeLineId(productId: string, selectedChoiceIds: string[]): string {
  return [productId, ...[...selectedChoiceIds].sort()].join('|');
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value)));
}

export function clampNotes(value: string): string {
  return value.slice(0, MAX_NOTES);
}

/** Why a selection cannot be ordered. Empty means it can. */
export function selectionProblems(product: Product, selectedChoiceIds: string[]): string[] {
  const problems: string[] = [];

  if (!product.available) {
    problems.push(`${product.name} is sold out today.`);
    return problems;
  }

  const offered = choiceIdsFor(product);
  for (const id of selectedChoiceIds) {
    if (!offered.has(id)) problems.push('That option is not on this dish.');
  }

  for (const group of product.optionGroups) {
    const chosen = group.choices.filter((c) => selectedChoiceIds.includes(c.id)).length;
    if (chosen < group.min) {
      problems.push(
        group.min === 1
          ? `Choose a ${group.label.toLowerCase()}.`
          : `Choose at least ${group.min} from ${group.label}.`,
      );
    }
    if (chosen > group.max) {
      problems.push(`Choose at most ${group.max} from ${group.label}.`);
    }
  }

  return [...new Set(problems)];
}

export function addItem(
  items: CartItem[],
  entry: { productId: string; quantity: number; selectedChoiceIds: string[]; notes: string },
): CartItem[] {
  const lineId = makeLineId(entry.productId, entry.selectedChoiceIds);
  const quantity = clampQuantity(entry.quantity);
  const existing = items.find((i) => i.lineId === lineId);

  if (existing) {
    return items.map((i) =>
      i.lineId === lineId ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i,
    );
  }

  return [
    ...items,
    {
      lineId,
      productId: entry.productId,
      quantity,
      selectedChoiceIds: [...entry.selectedChoiceIds].sort(),
      notes: clampNotes(entry.notes),
    },
  ];
}

export function removeItem(items: CartItem[], lineId: string): CartItem[] {
  return items.filter((i) => i.lineId !== lineId);
}

/** Setting a quantity to zero removes the line, which is what people expect. */
export function setQuantity(items: CartItem[], lineId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeItem(items, lineId);
  return items.map((i) => (i.lineId === lineId ? { ...i, quantity: clampQuantity(quantity) } : i));
}

export function clearCart(): CartItem[] {
  return [];
}
