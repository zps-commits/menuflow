import type { Metadata } from 'next';
import { Cormorant_Garamond, Karla } from 'next/font/google';
import './globals.css';
import { catalog } from '@/data/catalog';
import { CartProvider } from '@/components/cart/CartProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const karla = Karla({ subsets: ['latin'], variable: '--font-karla', display: 'swap' });

export const metadata: Metadata = {
  title: `${catalog.restaurant.name} — digital menu`,
  description: catalog.restaurant.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable}`}>
      <body className="min-h-dvh">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
