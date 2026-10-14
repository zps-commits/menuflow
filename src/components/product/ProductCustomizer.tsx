'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import { useCartContext } from '@/components/cart/CartProvider';
import { selectionProblems, clampQuantity } from '@/domain/cart';
import { MAX_NOTES, MAX_QUANTITY, unitPrice } from '@/domain/pricing';
import { formatMoney } from '@/lib/money';
import type { Product, Restaurant } from '@/types/menu';

export default function ProductCustomizer({
  product,
  restaurant,
}: {
  product: Product;
  restaurant: Restaurant;
}) {
  const { add } = useCartContext();
  const router = useRouter();

  // Every required group starts satisfied, with its first `min` choices
  // picked. A group that requires one but allows two would otherwise open
  // empty, and the dish would silently refuse to be added.
  const [selected, setSelected] = useState<string[]>(() =>
    product.optionGroups.flatMap((g) => g.choices.slice(0, Math.max(0, g.min)).map((c) => c.id)),
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showProblems, setShowProblems] = useState(false);

  const problems = useMemo(() => selectionProblems(product, selected), [product, selected]);
  const unit = unitPrice(product, selected);
  const total = unit * quantity;

  function toggle(groupId: string, choiceId: string) {
    const group = product.optionGroups.find((g) => g.id === groupId);
    if (!group) return;

    setSelected((current) => {
      const inGroup = group.choices.map((c) => c.id);
      const others = current.filter((id) => !inGroup.includes(id));
      const chosen = current.filter((id) => inGroup.includes(id));

      if (group.max === 1) return [...others, choiceId];

      if (chosen.includes(choiceId)) return [...others, ...chosen.filter((id) => id !== choiceId)];
      if (chosen.length >= group.max) return current; // at the limit, ignore
      return [...others, ...chosen, choiceId];
    });
  }

  function submit() {
    if (problems.length > 0) {
      setShowProblems(true);
      return;
    }
    add({ productId: product.id, quantity, selectedChoiceIds: selected, notes });
    router.push('/cart');
  }

  if (!product.available) return null;

  return (
    <div className="mt-8">
      {product.optionGroups.map((group) => (
        <fieldset key={group.id} className="mt-6 border-t border-rule pt-5">
          <legend className="label text-subtle">
            {group.label}
            <span className="ml-2 normal-case tracking-normal">
              {group.min >= 1 && group.max === 1
                ? '(choose one)'
                : group.max > 1
                  ? `(up to ${group.max})`
                  : '(optional)'}
            </span>
          </legend>

          <div className="mt-3 flex flex-wrap gap-2">
            {group.choices.map((choice) => {
              const active = selected.includes(choice.id);
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => toggle(group.id, choice.id)}
                  aria-pressed={active}
                  className={`tap pressable rounded-full border px-4 text-[0.875rem] ${
                    active
                      ? 'border-ember bg-ember text-ember-ink'
                      : 'border-rule bg-raised text-muted hover:border-rule-strong'
                  }`}
                >
                  {choice.label}
                  {choice.priceDelta > 0 && (
                    <span className="ml-2 opacity-80">
                      +{formatMoney(choice.priceDelta, restaurant.locale, restaurant.currency)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-6 border-t border-rule pt-5">
        <label htmlFor="notes" className="label text-subtle">
          Anything we should know
        </label>
        <textarea
          id="notes"
          value={notes}
          maxLength={MAX_NOTES}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="No onion, cut in half, that kind of thing."
          className="mt-3 w-full rounded-lg border border-rule bg-raised p-3 text-[0.9375rem] placeholder:text-subtle"
        />
        <p className="mt-1 text-right text-[0.75rem] text-subtle">
          {notes.length}/{MAX_NOTES}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
        <div className="flex items-center gap-1 rounded-full border border-rule bg-raised p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => clampQuantity(q - 1))}
            disabled={quantity <= 1}
            aria-label="One fewer"
            className="tap pressable grid place-items-center rounded-full disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <span aria-live="polite" className="w-8 text-center text-[0.9375rem] font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => clampQuantity(q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="One more"
            className="tap pressable grid place-items-center rounded-full disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={submit}
          className="tap pressable flex-1 rounded-full bg-ember px-6 text-[0.9375rem] font-medium text-ember-ink"
        >
          Add to order · {formatMoney(total, restaurant.locale, restaurant.currency)}
        </button>
      </div>

      {showProblems && problems.length > 0 && (
        <ul role="alert" className="mt-4 space-y-1">
          {problems.map((problem) => (
            <li key={problem} className="text-[0.875rem] text-danger">
              {problem}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
