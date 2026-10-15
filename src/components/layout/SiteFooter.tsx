import type { Restaurant } from '@/types/menu';

export default function SiteFooter({ restaurant }: { restaurant: Restaurant }) {
  return (
    <footer className="border-t-2 border-ember bg-surface">
      <div className="shell grid gap-10 py-14 md:grid-cols-2">
        <div>
          <h2 className="display-m">{restaurant.name}</h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            {restaurant.description}
          </p>
        </div>

        <div>
          <h3 className="label text-subtle">Opening hours</h3>
          <dl className="mt-4 border-t border-rule">
            {restaurant.hours.map((slot) => (
              <div key={slot.day} className="flex justify-between gap-4 border-b border-rule py-3">
                <dt className="text-[0.9375rem] text-muted">{slot.day}</dt>
                <dd className="text-[0.9375rem]">{slot.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The demo has to say it is a demo. */}
      <div className="shell border-t border-rule py-6">
        <p className="text-[0.8125rem] leading-relaxed text-subtle">
          Mesa Nove is a fictional restaurant built to demonstrate this ordering flow. Nothing is
          charged, no order is placed, and the WhatsApp number is a placeholder. Photography from
          Pexels; credits in <code>public/menu/CREDITS.json</code>.
        </p>
      </div>
    </footer>
  );
}
