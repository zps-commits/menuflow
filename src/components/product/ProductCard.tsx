import Link from 'next/link';
import DishImage from '@/components/ui/DishImage';
import { formatMoney } from '@/lib/money';
import type { Product, Restaurant } from '@/types/menu';

export default function ProductCard({
  product,
  restaurant,
  priority = false,
}: {
  product: Product;
  restaurant: Restaurant;
  priority?: boolean;
}) {
  const price = formatMoney(product.price, restaurant.locale, restaurant.currency);

  const card = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
        <DishImage src={product.image} alt={product.imageAlt} priority={priority} />
        {!product.available && (
          <span className="label absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1.5 text-paper">
            Sold out today
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="display-s">{product.name}</h3>
        <span className="shrink-0 font-medium text-ember">{price}</span>
      </div>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{product.description}</p>
    </>
  );

  // An unavailable dish stays on the menu, because customers look for it, but
  // it is not a link: there is nothing to configure and nothing to order.
  if (!product.available) {
    return (
      <article className="opacity-70" aria-label={`${product.name}, sold out today`}>
        {card}
      </article>
    );
  }

  return (
    <article>
      <Link
        href={`/product/${product.id}`}
        className="pressable group block rounded-lg focus-visible:outline-offset-4"
      >
        {card}
        <span className="label mt-3 inline-block text-ember">Choose options</span>
      </Link>
    </article>
  );
}
