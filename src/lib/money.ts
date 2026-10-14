import type { Cents } from '@/types/menu';

/**
 * Money helpers. Everything stays in integer cents until the moment it is
 * shown, and only then is it divided for display.
 */
export function formatMoney(cents: Cents, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

/** Guards against a corrupted or hand-edited value reaching arithmetic. */
export function isValidCents(value: unknown): value is Cents {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && Number.isFinite(value);
}
