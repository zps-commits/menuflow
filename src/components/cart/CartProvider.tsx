'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useCart } from '@/hooks/useCart';

type CartApi = ReturnType<typeof useCart>;

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartApi {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCartContext must be used inside CartProvider');
  return value;
}
