import { describe, expect, it } from 'vitest';
import { buildOrderMessage, buildWhatsappUrl, customerProblems, isValidWhatsapp } from '@/domain/order';
import { addItem } from '@/domain/cart';
import { priceCart } from '@/domain/pricing';
import { getCatalog } from '@/domain/catalog';
import type { CustomerDetails } from '@/domain/order';

const { restaurant } = getCatalog();

const cart = (() => {
  let items = addItem([], {
    productId: 'ribeye',
    quantity: 2,
    selectedChoiceIds: ['ribeye-point-rare', 'ribeye-side-farofa'],
    notes: 'no salt & extra pepper',
  });
  items = addItem(items, { productId: 'house-lemonade', quantity: 1, selectedChoiceIds: ['lemonade-size-large'], notes: '' });
  return priceCart(items);
})();

const pickup: CustomerDetails = { name: 'Ana', fulfilment: 'pickup', address: '', notes: '' };
const delivery: CustomerDetails = {
  name: 'Ana',
  fulfilment: 'delivery',
  address: 'Rua das Flores 120, apt 3',
  notes: 'ring the bell twice',
};

describe('whatsapp number', () => {
  it('accepts international digits only', () => {
    expect(isValidWhatsapp('5581900000000')).toBe(true);
  });

  it('rejects formatting, letters and short numbers', () => {
    expect(isValidWhatsapp('+55 (81) 90000-0000')).toBe(false);
    expect(isValidWhatsapp('558190000000a')).toBe(false);
    expect(isValidWhatsapp('123')).toBe(false);
  });
});

describe('customer validation', () => {
  it('passes a complete pickup order', () => {
    expect(customerProblems(pickup, restaurant)).toEqual({});
  });

  it('requires a name', () => {
    expect(customerProblems({ ...pickup, name: ' ' }, restaurant).name).toBeDefined();
  });

  it('requires an address for delivery', () => {
    expect(customerProblems({ ...delivery, address: '' }, restaurant).address).toBeDefined();
  });

  it('does not require an address for pickup', () => {
    expect(customerProblems({ ...pickup, address: '' }, restaurant).address).toBeUndefined();
  });

  it('refuses delivery when the restaurant has it switched off', () => {
    const closed = { ...restaurant, delivery: { ...restaurant.delivery, enabled: false } };
    expect(customerProblems(delivery, closed).fulfilment).toBeDefined();
  });
});

describe('order message', () => {
  const pickupMessage = buildOrderMessage({ restaurant, lines: cart.lines, subtotal: cart.subtotal, customer: pickup });
  const deliveryMessage = buildOrderMessage({ restaurant, lines: cart.lines, subtotal: cart.subtotal, customer: delivery });

  it('names the restaurant and the customer', () => {
    expect(pickupMessage).toContain(restaurant.name);
    expect(pickupMessage).toContain('Name: Ana');
  });

  it('lists every line with its quantity', () => {
    expect(pickupMessage).toContain('2x Ribeye over embers');
    expect(pickupMessage).toContain('1x House lemonade');
  });

  it('includes the chosen options', () => {
    expect(pickupMessage).toContain('Rare');
    expect(pickupMessage).toContain('Farofa');
    expect(pickupMessage).toContain('Large');
  });

  it('carries the per-item note through', () => {
    expect(pickupMessage).toContain('no salt & extra pepper');
  });

  it('states the subtotal', () => {
    expect(pickupMessage).toContain('Subtotal:');
  });

  it('says pickup for pickup and never asks for an address', () => {
    expect(pickupMessage).toContain('Pickup at the restaurant');
    expect(pickupMessage).not.toContain('Address:');
  });

  it('carries the address and the fee note for delivery', () => {
    expect(deliveryMessage).toContain('Address: Rua das Flores 120, apt 3');
    expect(deliveryMessage).toContain(restaurant.delivery.feeNote);
  });

  it('never invents a delivery fee amount', () => {
    expect(deliveryMessage).not.toMatch(/delivery fee[:\s]+R\$/i);
  });

  it('says the order is not confirmed yet', () => {
    expect(pickupMessage.toLowerCase()).toContain('confirm');
  });
});

describe('whatsapp url', () => {
  const message = buildOrderMessage({ restaurant, lines: cart.lines, subtotal: cart.subtotal, customer: delivery });

  it('points at wa.me with the configured number', () => {
    expect(buildWhatsappUrl(restaurant.whatsapp, message)).toContain(`https://wa.me/${restaurant.whatsapp}?text=`);
  });

  it('refuses to build a url for an invalid number', () => {
    expect(buildWhatsappUrl('+55 81 9', message)).toBeNull();
  });

  it('escapes line breaks and special characters instead of truncating', () => {
    const url = buildWhatsappUrl(restaurant.whatsapp, message)!;
    expect(url).not.toContain('\n');
    expect(url).toContain('%0A');
    // & and # inside the note must not end the query string.
    expect(url).toContain('%26');
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(message);
  });

  it('round-trips accents', () => {
    const url = buildWhatsappUrl(restaurant.whatsapp, 'pão, açúcar e limão')!;
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('pão, açúcar e limão');
  });
});
