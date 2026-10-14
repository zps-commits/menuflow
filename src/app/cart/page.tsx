import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import CartView from '@/components/cart/CartView';
import { getCatalog } from '@/domain/catalog';

export const metadata = { title: 'Your order' };

export default function CartPage() {
  const { restaurant } = getCatalog();
  return (
    <>
      <SiteHeader restaurant={restaurant} />
      <main className="shell pb-20 pt-10">
        <h1 className="display-m">Your order</h1>
        <CartView restaurant={restaurant} />
      </main>
      <SiteFooter restaurant={restaurant} />
    </>
  );
}
