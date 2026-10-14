import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import MenuBrowser from '@/components/menu/MenuBrowser';
import { getCatalog } from '@/domain/catalog';

export default function MenuPage() {
  const catalog = getCatalog();
  const { restaurant } = catalog;

  return (
    <>
      <SiteHeader restaurant={restaurant} />

      <main>
        <section className="shell pb-4 pt-12 md:pt-20">
          <p className="label text-ember">Demonstration menu</p>
          <h1 className="display-xl mt-4 max-w-[16ch]">{restaurant.tagline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {restaurant.description}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="label text-subtle">Today</dt>
              <dd className="mt-1 text-[0.9375rem]">{restaurant.hours[0]?.hours}</dd>
            </div>
            <div>
              <dt className="label text-subtle">Delivery</dt>
              <dd className="mt-1 text-[0.9375rem]">
                {restaurant.delivery.enabled ? 'Available' : 'Pickup only'}
              </dd>
            </div>
          </dl>
        </section>

        <MenuBrowser catalog={catalog} />
      </main>

      <SiteFooter restaurant={restaurant} />
    </>
  );
}
