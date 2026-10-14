# LinkedIn — post in English

> Links checked on 2026-10-14. See `verified-links.md`.
> Repository: https://github.com/zps-commits/menuflow
> Demo: https://menuflow-six-gamma.vercel.app

---

First project of my 60 solutions in 30 days challenge: **MenuFlow**, a digital
restaurant menu that assembles the order and hands it to WhatsApp complete.

**The problem**

A neighbourhood restaurant that wants to sell online usually picks between two
bad options.

A delivery marketplace charges a commission on every order. On food margins
that commission is often the difference between a dish being profitable and
not, and the restaurant does not end up owning the customer relationship it is
paying for.

A PDF menu and a phone number costs nothing and produces orders like "the
usual, no onion, and one of those pastas". Reconstructing that takes several
messages, during service, and it is where the wrong order comes from.

**The solution**

The customer builds the order on their own phone, with the real prices and the
real options, and the restaurant receives it written out in full on the
channel it already uses: every line, every option, every note, unit prices and
the total.

No commission per order, no payment gateway, no backend.

**Technical decisions that mattered**

Money is an integer number of cents, end to end. No float ever holds a price.

A cart line is identified by the product **plus its chosen options, sorted**.
A steak ordered rare and a steak ordered well done are two lines, not a
quantity of two. Sorting the ids means the same choices made in a different
order still collapse into one line.

The cart is re-priced against the current catalog on every read, never trusted
from storage. If a dish changed price or sold out while a tab sat open
overnight, the cart reflects today's menu and reports what it had to drop.

`localStorage` is treated as hostile input: validated field by field, with
anything that fails falling back to an empty cart rather than throwing.

No business rule lives in a component. Pricing, line identity, search and
message building are pure functions, tested without rendering anything.

**The bug that taught the most**

A required option group with a maximum of two opened empty. TypeScript was
happy, the unit tests were green, and the dish simply refused to go into the
cart without saying why. Only clicking through it in a browser found it.

It is the best argument this project gave me for testing the interface and not
only the functions underneath it.

**What it does not do, and says it does not do**

Opening WhatsApp is not a confirmed order. The order is confirmed when the
restaurant replies, and the interface says so. Nothing simulates a payment. No
delivery fee is invented: the menu carries a note saying the fee depends on
the address and is settled in conversation, and that note travels with the
message.

**Verified on 14 October 2026**

82 tests passing, TypeScript strict and ESLint clean, build clean, zero
axe-core violations (WCAG 2.1 A + AA): at 360, 390, 430, 768 and 1440px
locally, and at 1440 and 390px against the live deployment.

Not verified: physical devices, Safari and Firefox.

The restaurant, "Mesa Nove", is fictional and the WhatsApp number is a
placeholder. There are no users, no clients and no revenue, so no figure of
that kind appears here.

Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest,
Testing Library.

Demo: https://menuflow-six-gamma.vercel.app
Code: https://github.com/zps-commits/menuflow

If you run a restaurant and currently take WhatsApp orders by ear, this can be
adapted to your menu. Happy to talk.

#webdevelopment #nextjs #typescript #accessibility
