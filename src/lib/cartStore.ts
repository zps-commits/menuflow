import { loadCart, saveCart, CART_STORAGE_KEY } from '@/lib/storage';
import type { CartItem } from '@/types/menu';

/**
 * The cart as an external store.
 *
 * localStorage is external state, so React reads it through
 * useSyncExternalStore rather than a setState inside an effect. React 19
 * rejects the latter as a lint error, and the subscription model also gives
 * cross-tab sync for free: two tabs on the same menu stay in step.
 *
 * getSnapshot must return a stable reference, otherwise React re-renders
 * forever, so the cache is only replaced when the cart actually changes.
 */
const EMPTY: CartItem[] = [];

let cache: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function hydrateOnce(): void {
  if (loaded) return;
  loaded = true;
  cache = loadCart();
}

function onStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
  cache = loadCart();
  emit();
}

export function subscribe(listener: () => void): () => void {
  hydrateOnce();
  if (listeners.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);
  // The first subscriber arrives after the server snapshot was used, so tell
  // React the value changed if storage had anything in it.
  if (cache.length > 0) queueMicrotask(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function getSnapshot(): CartItem[] {
  hydrateOnce();
  return cache;
}

export function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function setCart(next: CartItem[]): void {
  cache = next;
  saveCart(next);
  emit();
}

export function isHydrated(): boolean {
  return loaded;
}

/** Test seam: forget everything read so far. */
export function resetCartStore(): void {
  cache = EMPTY;
  loaded = false;
}
