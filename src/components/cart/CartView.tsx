'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartContext } from '@/components/cart/CartProvider';
import DishImage from '@/components/ui/DishImage';
import { formatMoney } from '@/lib/money';
import type { Restaurant } from '@/types/menu';

export default function CartView({ restaurant }: { restaurant: Restaurant }) {
  const { priced, hydrated, remove, setQuantity, clear } = useCartContext();
  const { lines, dropped, subtotal } = priced;

  if (!hydrated) {
    return <p className="mt-8 text-[0.9375rem] text-muted">Loading your order…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-rule bg-raised p-8 text-center">
        <p className="display-s">Nothing here yet</p>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-muted">
          Pick something from the menu and it will show up here.
        </p>
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
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        {/* A dish can sell out while a cart sits in a browser. Say so. */}
        {dropped.length > 0 && (
          <p role="status" className="mb-6 rounded-lg border border-rule bg-surface p-4 text-[0.875rem] text-muted">
            {dropped.length === 1 ? 'One dish' : `${dropped.length} dishes`} from your order sold out
            and {dropped.length === 1 ? 'was' : 'were'} removed.
          </p>
        )}

        <ul className="border-t border-rule">
          {lines.map(({ item, product, choiceLabels, unit, total }) => (
            <li key={item.lineId} className="flex gap-4 border-b border-rule py-5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface sm:size-24">
                <DishImage src={product.image} alt={product.imageAlt} sizes="6rem" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="display-s truncate">{product.name}</h2>
                  <span className="shrink-0 font-medium">
                    {formatMoney(total, restaurant.locale, restaurant.currency)}
                  </span>
                </div>

                {choiceLabels.length > 0 && (
                  <p className="mt-1 text-[0.875rem] text-muted">{choiceLabels.join(' · ')}</p>
                )}
                {item.notes && <p className="mt-1 text-[0.875rem] italic text-subtle">“{item.notes}”</p>}
                <p className="mt-1 text-[0.8125rem] text-subtle">
                  {formatMoney(unit, restaurant.locale, restaurant.currency)} each
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full border border-rule bg-raised p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.lineId, item.quantity - 1)}
                      aria-label={`One fewer ${product.name}`}
                      className="tap pressable grid place-items-center rounded-full"
                    >
                      <Minus aria-hidden="true" className="size-4" />
                    </button>
                    <span className="w-8 text-center text-[0.9375rem] font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.lineId, item.quantity + 1)}
                      aria-label={`One more ${product.name}`}
                      className="tap pressable grid place-items-center rounded-full"
                    >
                      <Plus aria-hidden="true" className="size-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.lineId)}
                    aria-label={`Remove ${product.name} from the order`}
                    className="tap pressable grid place-items-center rounded-full text-subtle hover:text-danger"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clear}
          className="tap pressable mt-4 text-[0.875rem] text-subtle underline underline-offset-4 hover:text-danger"
        >
          Empty the order
        </button>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-rule bg-raised p-6">
          <h2 className="label text-subtle">Summary</h2>
          <div className="mt-4 flex items-baseline justify-between border-t border-rule pt-4">
            <span className="text-[0.9375rem] text-muted">Subtotal</span>
            <span className="text-xl font-medium">
              {formatMoney(subtotal, restaurant.locale, restaurant.currency)}
            </span>
          </div>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-subtle">
            {restaurant.delivery.feeNote}
          </p>
          <Link
            href="/checkout"
            className="tap pressable mt-6 flex items-center justify-center rounded-full bg-ember px-6 text-[0.9375rem] font-medium text-ember-ink"
          >
            Continue
          </Link>
        </div>
      </aside>
    </div>
  );
}
