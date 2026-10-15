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
      {/* The card is a raised surface on the warmer paper, so the grid has
          structure without a shadow doing the work. The image runs to the
          card edge; the card clips it. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {/* The dimming applies to the photograph only. Putting it on the
            wrapper also dimmed the badge, which then failed contrast. */}
        <div className={product.available ? 'contents' : 'absolute inset-0 opacity-60'}>
          <DishImage src={product.image} alt={product.imageAlt} priority={priority} />
        </div>
        {!product.available && (
          <span className="label absolute left-3 top-3 rounded-full bg-danger px-3 py-1.5 text-raised">
            Sold out today
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4 px-4 pt-4">
        <h3 className="display-s">{product.name}</h3>
        <span className={`shrink-0 font-medium ${product.available ? 'text-ember' : 'text-muted'}`}>
          {price}
        </span>
      </div>
      <p className="px-4 pb-4 pt-2 text-[0.9375rem] leading-relaxed text-muted">
        {product.description}
      </p>
    </>
  );

  // An unavailable dish stays on the menu, because customers look for it, but
  // it is not a link: there is nothing to configure and nothing to order.
  if (!product.available) {
    return (
      <article
        className="overflow-hidden rounded-xl border border-rule bg-raised"
        aria-label={`${product.name}, sold out today`}
      >
        {card}
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border border-rule bg-raised">
      <Link
        href={`/product/${product.id}`}
        className="pressable group block focus-visible:outline-offset-[-2px]"
      >
        {card}
        <span className="label block border-t border-rule px-4 py-3 text-ember">
          Choose options
        </span>
      </Link>
    </article>
  );
}
