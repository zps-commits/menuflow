# MenuFlow — technical summary

## Stack

Next.js (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Lucide icons · Vitest · Testing Library · ESLint · deployed on Vercel.

No database, no authentication, no payment provider, no paid service. The
menu is a typed TypeScript file.

## Architecture

```
src/
  app/          Routes: menu, product, cart, checkout
  components/   layout · menu · product · cart · checkout · ui
  domain/       catalog · search · cart · pricing · order — pure functions
  lib/          money · storage · cartStore
  data/         catalog.ts, the whole menu as typed data
  types/        menu.ts
```

The dividing line is that **no business rule lives in a component**. Pricing,
cart identity, search and message building are pure functions in `domain/`,
tested without rendering anything.

## Architecture decisions

**Money is an integer number of cents, end to end.** No float ever holds a
price. Formatting happens once, at the edge.

**A cart line is identified by the product plus its sorted option ids.** A
steak ordered rare and a steak ordered well done are two lines, not a
quantity of two. Sorting the ids means the same choices made in a different
order still collapse into one line.

**The cart is re-priced against the current catalog on every read**, never
trusted from storage. If a dish changed price or sold out while the cart sat
in a tab overnight, the cart reflects today's menu and reports what it had to
drop.

**`localStorage` is treated as hostile input.** It is parsed, validated
field by field, and anything that fails falls back to an empty cart rather
than throwing. The store is read through `useSyncExternalStore`, which React
19 requires instead of setting state from an effect, and which gives
cross-tab sync for free.

**Option groups carry their own minimum and maximum.** "Pick one size" and
"pick up to two extras" are the same structure with different numbers, so
there is one validation path rather than one per kind of question.

**No delivery fee is invented.** The catalog carries a note saying the fee
depends on the address and is confirmed in conversation, and that note
travels with the order message.

**Opening WhatsApp is not placing an order**, and the interface says so. The
order is confirmed when the restaurant replies.

## Verification

Measured on 2026-10-14:

- 82 tests across 7 files, all passing
- TypeScript strict and ESLint clean
- Production build clean
- Zero axe-core violations (WCAG 2.1 A + AA) locally at 360/390/430/768/1440
  and against the deployed instance at 1440 and 390

Not verified: physical devices, Safari and Firefox.

## The hardest bug

A required option group with a maximum of two opened empty. TypeScript was
happy, the unit tests were green, and the dish silently refused to be added
to the cart. Only clicking through it in a browser found it. It is the
clearest argument in this project for testing the interface and not only the
functions underneath it.
