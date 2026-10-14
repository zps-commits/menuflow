'use client';

import { useCallback, useSyncExternalStore } from 'react';
import * as cart from '@/domain/cart';
import { priceCart } from '@/domain/pricing';
import { getServerSnapshot, getSnapshot, setCart, subscribe } from '@/lib/cartStore';

/**
 * The cart, persisted and shared.
 *
 * Backed by useSyncExternalStore: localStorage is external state, and React 19
 * treats a synchronous setState inside an effect as a lint error. The server
 * snapshot is an empty cart, so server and first client render agree and there
 * is no hydration mismatch.
 */
export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // True once the client has had a chance to read storage. Used to hold back
  // the badge and the cart body until the real number is known.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const add = useCallback(
    (entry: { productId: string; quantity: number; selectedChoiceIds: string[]; notes: string }) =>
      setCart(cart.addItem(getSnapshot(), entry)),
    [],
  );

  const remove = useCallback((lineId: string) => setCart(cart.removeItem(getSnapshot(), lineId)), []);

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => setCart(cart.setQuantity(getSnapshot(), lineId, quantity)),
    [],
  );

  const clear = useCallback(() => setCart(cart.clearCart()), []);

  return { items, hydrated, add, remove, setQuantity, clear, priced: priceCart(items) };
}
