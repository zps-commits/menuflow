import Link from 'next/link';
import CartLink from '@/components/layout/CartLink';
import type { Restaurant } from '@/types/menu';

export default function SiteHeader({ restaurant }: { restaurant: Restaurant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-sm">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="tap pressable -ml-1 flex items-center rounded-lg px-1">
          <span className="display-s">{restaurant.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="label hidden text-subtle sm:block">{restaurant.tagline}</span>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
