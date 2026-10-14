import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import DishImage from '@/components/ui/DishImage';
import { getCatalog, getCategory, getProduct } from '@/domain/catalog';
import { formatMoney } from '@/lib/money';

export function generateStaticParams() {
  return getCatalog().products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  return product
    ? { title: `${product.name} — ${getCatalog().restaurant.name}`, description: product.description }
    : { title: 'Dish not found' };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const { restaurant } = getCatalog();
  const category = getCategory(product.categoryId);

  return (
    <>
      <SiteHeader restaurant={restaurant} />

      <main className="shell pb-20 pt-8">
        <Link
          href="/"
          className="tap pressable -ml-1 inline-flex items-center gap-2 rounded-lg px-1 text-[0.9375rem] text-muted hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to the menu
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
            <DishImage
              src={product.image}
              alt={product.imageAlt}
              priority
              sizes="(max-width: 48rem) 100vw, 32rem"
            />
          </div>

          <div>
            {category && <p className="label text-ember">{category.label}</p>}
            <h1 className="display-m mt-3">{product.name}</h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{product.description}</p>
            <p className="mt-6 text-2xl font-medium">
              {formatMoney(product.price, restaurant.locale, restaurant.currency)}
            </p>

            {!product.available && (
              <p className="mt-6 rounded-lg border border-rule bg-surface p-4 text-[0.9375rem] text-muted">
                This one is sold out today. The menu changes with the market, so it may be back
                later in the week.
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter restaurant={restaurant} />
    </>
  );
}
