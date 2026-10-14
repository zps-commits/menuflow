'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartContext } from '@/components/cart/CartProvider';

/**
 * Cart indicator. Renders nothing until the cart has hydrated, so the server
 * and first client render agree on an empty badge.
 */
export default function CartLink() {
  const { priced, hydrated } = useCartContext();
  const count = priced.itemCount;

  return (
    <Link
      href="/cart"
      className="tap pressable relative -mr-1 grid place-items-center rounded-full px-1"
      aria-label={hydrated && count > 0 ? `Your order, ${count} items` : 'Your order'}
    >
      <ShoppingBag aria-hidden="true" className="size-5" />
      {hydrated && count > 0 && (
        <span className="absolute right-0 top-1 grid min-w-5 place-items-center rounded-full bg-ember px-1.5 text-[0.6875rem] font-semibold text-ember-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
