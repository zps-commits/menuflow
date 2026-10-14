'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCartContext } from '@/components/cart/CartProvider';
import {
  MAX_ADDRESS,
  MAX_NAME,
  MAX_ORDER_NOTES,
  buildOrderMessage,
  buildWhatsappUrl,
  customerProblems,
  type CustomerDetails,
} from '@/domain/order';
import { formatMoney } from '@/lib/money';
import type { Restaurant } from '@/types/menu';

export default function CheckoutForm({ restaurant }: { restaurant: Restaurant }) {
  const { priced, hydrated } = useCartContext();
  const ids = { name: useId(), address: useId(), notes: useId() };

  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    fulfilment: restaurant.delivery.enabled ? 'delivery' : 'pickup',
    address: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const problems = useMemo(() => customerProblems(details, restaurant), [details, restaurant]);
  const ready = Object.keys(problems).length === 0 && priced.lines.length > 0;

  const message = useMemo(
    () =>
      buildOrderMessage({
        restaurant,
        lines: priced.lines,
        subtotal: priced.subtotal,
        customer: details,
      }),
    [restaurant, priced.lines, priced.subtotal, details],
  );

  const href = buildWhatsappUrl(restaurant.whatsapp, message);
  const show = (field: keyof CustomerDetails) => (submitted ? problems[field] : undefined);

  if (!hydrated) return <p className="mt-8 text-[0.9375rem] text-muted">Loading your order…</p>;

  if (priced.lines.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-rule bg-raised p-8 text-center">
        <p className="display-s">There is nothing to send yet</p>
        <Link
          href="/"
          className="tap pressable mt-6 inline-flex items-center rounded-full bg-ember px-6 text-[0.9375rem] font-medium text-ember-ink"
        >
          See the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
      <form className="max-w-xl" onSubmit={(e) => e.preventDefault()} noValidate>
        <fieldset>
          <legend className="label text-subtle">How do you want it</legend>
          <div className="mt-3 flex gap-2">
            {(['delivery', 'pickup'] as const).map((mode) => {
              const disabled = mode === 'delivery' && !restaurant.delivery.enabled;
              return (
                <button
                  key={mode}
                  type="button"
                  disabled={disabled}
                  aria-pressed={details.fulfilment === mode}
                  onClick={() => setDetails((d) => ({ ...d, fulfilment: mode }))}
                  className={`tap pressable rounded-full border px-5 text-[0.9375rem] capitalize disabled:opacity-40 ${
                    details.fulfilment === mode
                      ? 'border-ember bg-ember text-ember-ink'
                      : 'border-rule bg-raised text-muted'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6">
          <label htmlFor={ids.name} className="label text-subtle">
            Name
          </label>
          <input
            id={ids.name}
            value={details.name}
            maxLength={MAX_NAME}
            autoComplete="name"
            onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
            aria-invalid={Boolean(show('name'))}
            aria-describedby={show('name') ? `${ids.name}-error` : undefined}
            className="tap mt-2 w-full rounded-lg border border-rule bg-raised px-4 text-[0.9375rem]"
          />
          {show('name') && (
            <p id={`${ids.name}-error`} className="mt-2 text-[0.875rem] text-danger">
              {problems.name}
            </p>
          )}
        </div>

        {details.fulfilment === 'delivery' && (
          <div className="mt-5">
            <label htmlFor={ids.address} className="label text-subtle">
              Delivery address
            </label>
            <textarea
              id={ids.address}
              value={details.address}
              maxLength={MAX_ADDRESS}
              rows={3}
              autoComplete="street-address"
              onChange={(e) => setDetails((d) => ({ ...d, address: e.target.value }))}
              aria-invalid={Boolean(show('address'))}
              aria-describedby={show('address') ? `${ids.address}-error` : undefined}
              className="mt-2 w-full rounded-lg border border-rule bg-raised p-3 text-[0.9375rem]"
            />
            {show('address') && (
              <p id={`${ids.address}-error`} className="mt-2 text-[0.875rem] text-danger">
                {problems.address}
              </p>
            )}
          </div>
        )}

        <div className="mt-5">
          <label htmlFor={ids.notes} className="label text-subtle">
            Anything else
          </label>
          <textarea
            id={ids.notes}
            value={details.notes}
            maxLength={MAX_ORDER_NOTES}
            rows={2}
            onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-rule bg-raised p-3 text-[0.9375rem]"
          />
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-rule bg-raised p-6">
          <h2 className="label text-subtle">Summary</h2>
          <div className="mt-4 flex items-baseline justify-between border-t border-rule pt-4">
            <span className="text-[0.9375rem] text-muted">Subtotal</span>
            <span className="text-xl font-medium">
              {formatMoney(priced.subtotal, restaurant.locale, restaurant.currency)}
            </span>
          </div>

          {details.fulfilment === 'delivery' && (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-subtle">
              {restaurant.delivery.feeNote}
            </p>
          )}

          {href ? (
            <a
              href={ready ? href : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!ready}
              onClick={(e) => {
                setSubmitted(true);
                if (!ready) e.preventDefault();
              }}
              className={`tap pressable mt-6 flex items-center justify-center rounded-full px-6 text-[0.9375rem] font-medium ${
                ready ? 'bg-ember text-ember-ink' : 'cursor-not-allowed bg-surface text-subtle'
              }`}
            >
              Send the order on WhatsApp
            </a>
          ) : (
            <p role="alert" className="mt-6 rounded-lg border border-rule bg-surface p-4 text-[0.875rem] text-muted">
              This menu has no valid WhatsApp number configured, so the order cannot be sent. Set a
              number in international format in the catalog.
            </p>
          )}

          {/* Opening WhatsApp is not the same as having an order. */}
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-subtle">
            This opens WhatsApp with your order written out. Nothing is charged here and the order
            is only confirmed once the restaurant replies.
          </p>
        </div>

        <details className="mt-4 rounded-xl border border-rule bg-raised p-4">
          <summary className="label cursor-pointer text-subtle">Preview the message</summary>
          <pre className="mt-3 whitespace-pre-wrap break-words text-[0.8125rem] leading-relaxed text-muted">
            {message}
          </pre>
        </details>
      </aside>
    </div>
  );
}
