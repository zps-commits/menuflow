import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartView from '@/components/cart/CartView';
import { CartProvider } from '@/components/cart/CartProvider';
import { getCatalog } from '@/domain/catalog';
import { resetCartStore } from '@/lib/cartStore';
import { CART_STORAGE_KEY } from '@/lib/storage';

const { restaurant } = getCatalog();

function seed(items: unknown[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items }));
  resetCartStore();
}

function mount() {
  return render(
    <CartProvider>
      <CartView restaurant={restaurant} />
    </CartProvider>,
  );
}

describe('CartView', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetCartStore();
  });

  it('shows an empty state with a way back to the menu', async () => {
    mount();
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see the menu/i })).toHaveAttribute('href', '/');
  });

  it('restores a saved order', async () => {
    seed([{ productId: 'ribeye', quantity: 2, selectedChoiceIds: ['ribeye-point-rare', 'ribeye-side-farofa'], notes: 'no salt' }]);
    mount();
    expect(await screen.findByText('Ribeye over embers')).toBeInTheDocument();
    expect(screen.getByText(/Rare · Farofa/)).toBeInTheDocument();
    expect(screen.getByText('“no salt”')).toBeInTheDocument();
  });

  it('multiplies the line and the subtotal by the quantity', async () => {
    seed([{ productId: 'ribeye', quantity: 2, selectedChoiceIds: ['ribeye-point-rare', 'ribeye-side-potato'], notes: '' }]);
    mount();
    // 129,00 each, two of them: the figure appears as the line total and
    // again as the subtotal, and with one line those must agree.
    expect(await screen.findAllByText('R$ 258,00')).toHaveLength(2);
    expect(screen.getByText('R$ 129,00 each')).toBeInTheDocument();
  });

  it('increases and decreases a quantity', async () => {
    const user = userEvent.setup();
    seed([{ productId: 'grilled-fish', quantity: 1, selectedChoiceIds: [], notes: '' }]);
    mount();
    await user.click(await screen.findByRole('button', { name: /one more fish of the day/i }));
    expect(await screen.findByText('2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /one fewer fish of the day/i }));
    expect(await screen.findByText('1')).toBeInTheDocument();
  });

  it('removes the line when the quantity drops past one', async () => {
    const user = userEvent.setup();
    seed([{ productId: 'grilled-fish', quantity: 1, selectedChoiceIds: [], notes: '' }]);
    mount();
    await user.click(await screen.findByRole('button', { name: /one fewer fish of the day/i }));
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });

  it('empties the whole order', async () => {
    const user = userEvent.setup();
    seed([{ productId: 'grilled-fish', quantity: 3, selectedChoiceIds: [], notes: '' }]);
    mount();
    await user.click(await screen.findByRole('button', { name: /empty the order/i }));
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });

  it('tells the customer when a saved dish has sold out', async () => {
    // Burrata is unavailable in the catalog; a cart saved before it sold out
    // must say so rather than quietly charging for it.
    seed([
      { productId: 'burrata', quantity: 1, selectedChoiceIds: [], notes: '' },
      { productId: 'grilled-fish', quantity: 1, selectedChoiceIds: [], notes: '' },
    ]);
    mount();
    expect(await screen.findByRole('status')).toHaveTextContent(/sold out/i);
    expect(screen.queryByText('Burrata and roasted peach')).toBeNull();
  });

  it('survives corrupted storage instead of crashing', async () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{{{ not json');
    resetCartStore();
    mount();
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });
});
