import { formatMoney } from '@/lib/money';
import type { PricedLine } from '@/domain/pricing';
import type { Fulfilment, Restaurant } from '@/types/menu';

export const MAX_NAME = 80;
export const MAX_ADDRESS = 200;
export const MAX_ORDER_NOTES = 300;

export type CustomerDetails = {
  name: string;
  fulfilment: Fulfilment;
  address: string;
  notes: string;
};

/** Field-level problems, keyed by field, so each input can show its own. */
export function customerProblems(
  details: CustomerDetails,
  restaurant: Restaurant,
): Partial<Record<keyof CustomerDetails, string>> {
  const problems: Partial<Record<keyof CustomerDetails, string>> = {};

  if (details.name.trim().length < 2) {
    problems.name = 'Tell us a name for the order.';
  }
  if (details.fulfilment === 'delivery') {
    if (!restaurant.delivery.enabled) {
      problems.fulfilment = 'Delivery is not available right now.';
    } else if (details.address.trim().length < 8) {
      problems.address = 'We need a full address to deliver.';
    }
  }
  return problems;
}

/** wa.me wants digits only, country code included. */
export function isValidWhatsapp(value: string): boolean {
  return /^\d{10,15}$/.test(value);
}

/**
 * The order, as the message the restaurant will read on WhatsApp.
 *
 * Plain text on purpose: it has to be legible in a chat bubble on a phone,
 * by someone who is busy. Prices are repeated per line because the kitchen
 * reads the lines and the till reads the total.
 */
export function buildOrderMessage(input: {
  restaurant: Restaurant;
  lines: PricedLine[];
  subtotal: number;
  customer: CustomerDetails;
}): string {
  const { restaurant, lines, subtotal, customer } = input;
  const money = (cents: number) => formatMoney(cents, restaurant.locale, restaurant.currency);

  const parts: string[] = [];
  parts.push(`New order — ${restaurant.name}`, '');

  for (const line of lines) {
    parts.push(`${line.item.quantity}x ${line.product.name} — ${money(line.total)}`);
    if (line.choiceLabels.length > 0) parts.push(`   ${line.choiceLabels.join(', ')}`);
    if (line.item.notes.trim()) parts.push(`   Note: ${line.item.notes.trim()}`);
    parts.push(`   ${money(line.unit)} each`);
  }

  parts.push('', `Subtotal: ${money(subtotal)}`);

  if (customer.fulfilment === 'delivery') {
    parts.push('Delivery');
    parts.push(`Address: ${customer.address.trim()}`);
    // No fee is invented. If the restaurant has not configured one, the
    // message says it will be confirmed, which is what actually happens.
    parts.push(restaurant.delivery.feeNote);
  } else {
    parts.push('Pickup at the restaurant');
  }

  parts.push('', `Name: ${customer.name.trim()}`);
  if (customer.notes.trim()) parts.push(`Order notes: ${customer.notes.trim()}`);

  // Nothing here is a payment and nothing here is a confirmation.
  parts.push('', 'Sent from the online menu. Please confirm the order and the total.');

  return parts.join('\n');
}

/**
 * The wa.me link. encodeURIComponent is what keeps line breaks, accents and
 * characters like & and # from truncating the message.
 */
export function buildWhatsappUrl(whatsapp: string, message: string): string | null {
  if (!isValidWhatsapp(whatsapp)) return null;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
