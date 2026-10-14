import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { getCatalog } from '@/domain/catalog';

export const metadata = { title: 'Send your order' };

export default function CheckoutPage() {
  const { restaurant } = getCatalog();
  return (
    <>
      <SiteHeader restaurant={restaurant} />
      <main className="shell pb-20 pt-10">
        <h1 className="display-m">Send your order</h1>
        <CheckoutForm restaurant={restaurant} />
      </main>
      <SiteFooter restaurant={restaurant} />
    </>
  );
}
