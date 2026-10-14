import { describe, expect, it } from 'vitest';
import { addItem, clampNotes, clampQuantity, makeLineId, removeItem, selectionProblems, setQuantity } from '@/domain/cart';
import { MAX_NOTES, MAX_QUANTITY, priceCart, unitPrice } from '@/domain/pricing';
import { parseStoredCart } from '@/lib/storage';
import { getProduct } from '@/domain/catalog';
import type { CartItem } from '@/types/menu';

const ribeye = getProduct('ribeye')!;
const burrata = getProduct('burrata')!;   // unavailable in the catalog
const fish = getProduct('grilled-fish')!; // no option groups

const rare = ['ribeye-point-rare', 'ribeye-side-potato'];
const well = ['ribeye-point-well', 'ribeye-side-potato'];
const withFarofa = ['ribeye-point-rare', 'ribeye-side-farofa'];

describe('pricing', () => {
  it('adds the price of selected choices to the base price', () => {
    expect(unitPrice(ribeye, rare)).toBe(ribeye.price);              // both deltas are zero
    expect(unitPrice(ribeye, withFarofa)).toBe(ribeye.price + 1200); // farofa costs extra
  });

  it('ignores choice ids it does not recognise instead of throwing', () => {
    expect(unitPrice(fish, ['does-not-exist'])).toBe(fish.price);
  });

  it('multiplies by quantity for the line total', () => {
    const items = addItem([], { productId: 'ribeye', quantity: 3, selectedChoiceIds: withFarofa, notes: '' });
    const { subtotal, itemCount } = priceCart(items);
    expect(subtotal).toBe((ribeye.price + 1200) * 3);
    expect(itemCount).toBe(3);
  });

  it('keeps every total an integer number of cents', () => {
    const items = addItem([], { productId: 'cacio-e-pepe', quantity: 2, selectedChoiceIds: ['cacio-extra-guanciale'], notes: '' });
    const { subtotal } = priceCart(items);
    expect(Number.isInteger(subtotal)).toBe(true);
  });
});

describe('cart lines', () => {
  it('builds the same id regardless of the order choices were picked', () => {
    expect(makeLineId('ribeye', ['b', 'a'])).toBe(makeLineId('ribeye', ['a', 'b']));
  });

  it('merges quantities when the dish and every choice match', () => {
    let items = addItem([], { productId: 'ribeye', quantity: 1, selectedChoiceIds: rare, notes: '' });
    items = addItem(items, { productId: 'ribeye', quantity: 2, selectedChoiceIds: rare, notes: '' });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('keeps the same dish as separate lines when the choices differ', () => {
    let items = addItem([], { productId: 'ribeye', quantity: 1, selectedChoiceIds: rare, notes: '' });
    items = addItem(items, { productId: 'ribeye', quantity: 1, selectedChoiceIds: well, notes: '' });
    expect(items).toHaveLength(2);
    expect(priceCart(items).itemCount).toBe(2);
  });

  it('changes a quantity', () => {
    let items = addItem([], { productId: 'ribeye', quantity: 1, selectedChoiceIds: rare, notes: '' });
    items = setQuantity(items, items[0].lineId, 5);
    expect(items[0].quantity).toBe(5);
  });

  it('removes a line when its quantity reaches zero', () => {
    let items = addItem([], { productId: 'ribeye', quantity: 2, selectedChoiceIds: rare, notes: '' });
    items = setQuantity(items, items[0].lineId, 0);
    expect(items).toEqual([]);
  });

  it('removes a line directly', () => {
    const items = addItem([], { productId: 'ribeye', quantity: 1, selectedChoiceIds: rare, notes: '' });
    expect(removeItem(items, items[0].lineId)).toEqual([]);
  });

  it('clamps quantity and notes to their limits', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(9999)).toBe(MAX_QUANTITY);
    expect(clampQuantity(Number.NaN)).toBe(1);
    expect(clampQuantity(2.7)).toBe(2);
    expect(clampNotes('x'.repeat(500))).toHaveLength(MAX_NOTES);
  });
});

describe('selection rules', () => {
  it('accepts a complete selection', () => {
    expect(selectionProblems(ribeye, rare)).toEqual([]);
  });

  it('refuses a required group that was not chosen', () => {
    expect(selectionProblems(ribeye, ['ribeye-side-potato']).length).toBeGreaterThan(0);
  });

  it('refuses more choices than a group allows', () => {
    const tooMany = ['ribeye-point-rare', 'ribeye-side-potato', 'ribeye-side-greens', 'ribeye-side-farofa'];
    expect(selectionProblems(ribeye, tooMany).length).toBeGreaterThan(0);
  });

  it('refuses a choice that belongs to another dish', () => {
    expect(selectionProblems(fish, ['ribeye-point-rare']).length).toBeGreaterThan(0);
  });

  it('refuses an unavailable dish outright', () => {
    expect(selectionProblems(burrata, []).length).toBeGreaterThan(0);
  });
});

describe('a cart priced against the current menu', () => {
  it('drops a line whose dish is no longer available and reports it', () => {
    const stale: CartItem[] = [
      { lineId: 'burrata', productId: 'burrata', quantity: 1, selectedChoiceIds: [], notes: '' },
    ];
    const { lines, dropped, subtotal } = priceCart(stale);
    expect(lines).toEqual([]);
    expect(dropped).toHaveLength(1);
    expect(subtotal).toBe(0);
  });

  it('drops a line whose dish no longer exists', () => {
    const stale: CartItem[] = [
      { lineId: 'ghost', productId: 'ghost-dish', quantity: 2, selectedChoiceIds: [], notes: '' },
    ];
    expect(priceCart(stale).dropped).toHaveLength(1);
  });

  it('uses the menu price, not a price stored with the line', () => {
    const items = addItem([], { productId: 'ribeye', quantity: 1, selectedChoiceIds: withFarofa, notes: '' });
    expect(priceCart(items).lines[0].unit).toBe(ribeye.price + 1200);
  });
});

describe('stored cart', () => {
  it('returns an empty cart for missing or unparseable storage', () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart('not json at all')).toEqual([]);
    expect(parseStoredCart('{"items":"not an array"}')).toEqual([]);
  });

  it('restores a well formed cart', () => {
    const raw = JSON.stringify({ version: 1, items: [{ productId: 'ribeye', quantity: 2, selectedChoiceIds: rare, notes: 'no salt' }] });
    const items = parseStoredCart(raw);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].notes).toBe('no salt');
  });

  it('drops choices that the dish does not offer', () => {
    const raw = JSON.stringify({ version: 1, items: [{ productId: 'grilled-fish', quantity: 1, selectedChoiceIds: ['ribeye-point-rare'], notes: '' }] });
    expect(parseStoredCart(raw)[0].selectedChoiceIds).toEqual([]);
  });

  it('drops entries for dishes that no longer exist', () => {
    const raw = JSON.stringify({ version: 1, items: [{ productId: 'ghost-dish', quantity: 1, selectedChoiceIds: [], notes: '' }] });
    expect(parseStoredCart(raw)).toEqual([]);
  });

  it('repairs hostile quantities and oversized notes', () => {
    const raw = JSON.stringify({ version: 1, items: [{ productId: 'ribeye', quantity: -5, selectedChoiceIds: rare, notes: 'y'.repeat(900) }] });
    const items = parseStoredCart(raw);
    expect(items[0].quantity).toBe(1);
    expect(items[0].notes).toHaveLength(MAX_NOTES);
  });

  it('collapses duplicate lines that would share an id', () => {
    const raw = JSON.stringify({ version: 1, items: [
      { productId: 'ribeye', quantity: 1, selectedChoiceIds: rare, notes: '' },
      { productId: 'ribeye', quantity: 9, selectedChoiceIds: [...rare].reverse(), notes: '' },
    ] });
    expect(parseStoredCart(raw)).toHaveLength(1);
  });
});
