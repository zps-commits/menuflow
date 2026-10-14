import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCustomizer from '@/components/product/ProductCustomizer';
import { CartProvider } from '@/components/cart/CartProvider';
import { getCatalog, getProduct } from '@/domain/catalog';
import { resetCartStore } from '@/lib/cartStore';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const { restaurant } = getCatalog();

function mount(productId = 'ribeye') {
  const product = getProduct(productId)!;
  return render(
    <CartProvider>
      <ProductCustomizer product={product} restaurant={restaurant} />
    </CartProvider>,
  );
}

describe('ProductCustomizer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetCartStore();
    push.mockClear();
  });

  it('opens with every required group already satisfied', () => {
    mount();
    // Both of the ribeye's groups require at least one choice.
    expect(screen.getByRole('button', { name: /^Rare/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^Ember potatoes/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the base price before anything paid is added', () => {
    mount();
    expect(screen.getByRole('button', { name: /Add to order/ })).toHaveTextContent('129,00');
  });

  it('adds the cost of a paid extra to the button', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: /^Farofa/ }));
    expect(screen.getByRole('button', { name: /Add to order/ })).toHaveTextContent('141,00');
  });

  it('swaps rather than stacks inside a single-choice group', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: /^Well done/ }));
    expect(screen.getByRole('button', { name: /^Rare/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /^Well done/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('multiplies the button total by the quantity', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: 'One more' }));
    expect(screen.getByRole('button', { name: /Add to order/ })).toHaveTextContent('258,00');
  });

  it('will not go below one', () => {
    mount();
    expect(screen.getByRole('button', { name: 'One fewer' })).toBeDisabled();
  });

  it('caps the note and shows the counter', async () => {
    const user = userEvent.setup();
    mount();
    const notes = screen.getByLabelText(/anything we should know/i);
    await user.type(notes, 'no salt');
    expect(screen.getByText('7/200')).toBeInTheDocument();
  });

  it('explains what is missing instead of failing silently', async () => {
    const user = userEvent.setup();
    mount();
    // Deselect the required side, leaving the group below its minimum.
    await user.click(screen.getByRole('button', { name: /^Ember potatoes/ }));
    await user.click(screen.getByRole('button', { name: /Add to order/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/side/i);
    expect(push).not.toHaveBeenCalled();
  });

  it('sends the customer to the cart once the selection is valid', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: /Add to order/ }));
    expect(push).toHaveBeenCalledWith('/cart');
  });

  it('renders nothing at all for a sold-out dish', () => {
    const { container } = mount('burrata');
    expect(container).toBeEmptyDOMElement();
  });
});
