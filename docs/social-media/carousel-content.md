# Carousel — five slides

The finished slides are in `composed/`, rendered by `npm run social` at
1080 × 1350 (4:5). To rebuild them as an editable Canva file, see
`canva-spec.md`.

The structure follows the brief: presentation, problem, solution with real
screenshots, technology, result.

---

## Slide 1 — Presentation

**Name** MenuFlow
**Category** Digital menu · order by WhatsApp
**Value line** The customer builds the order. The restaurant receives it finished.
**Link** menuflow-six-gamma.vercel.app
**Visual** `assets/menu-mobile.png`, whole.

---

## Slide 2 — Problem

**Headline** Two bad options

**A delivery marketplace** takes a commission on every order. On food
margins that is often the difference between a dish being profitable and
not.

**A PDF and a phone number** produces "the usual, no onion, and one of
those pastas", rebuilt over several messages, during service.

**Close** MenuFlow is the middle: the real menu, assembled by the customer,
arriving written out in full on the channel the restaurant already uses.

**Visual** None. Type only.

---

## Slide 3 — Solution

**Headline** Options that carry their own rules

**Body** "Choose one" and "up to two" are the same structure with different
numbers. Sold-out dishes stay visible, marked, and cannot be ordered.

**Visuals** `assets/product-options.png` and `assets/card-dish.png`, both
whole, both captured from the deployment.

---

## Slide 4 — Technology

**Headline** Next.js · React 19 · TypeScript · Tailwind v4

**Body** Money as integer cents. No business rule lives in a component:
pricing, line identity, search and message building are pure functions,
tested without rendering anything.

**The technical challenge actually faced** A required option group with a
maximum of two opened empty. Types and 82 unit tests were green; the dish
silently refused to be added. Only a browser found it.

**Code** The real line-identity expression from `src/domain/cart.ts`.

---

## Slide 5 — Result

**Headline** Built, verified, and live

| Tests across 7 files | 82 passing |
| TypeScript strict, lint, build | clean |
| axe-core, WCAG 2.1 A + AA | 0 violations |
| Widths checked | 1440 · 768 · 430 · 390 · 360 |

**Honesty line** "Mesa Nove" is fictional and the WhatsApp number is a
placeholder. No users, no clients, no revenue — the figures above are
verification results.

**Links** menuflow-six-gamma.vercel.app · github.com/zps-commits/menuflow

---

## Rules

- Only verified information. No invented metric and no feature that is not
  built.
- Short text. Place every screenshot whole; do not crop one so a label is
  cut, and do not scale one past the frame so it bleeds.
- No excessive gradients, no glow, no futurism, no generic template look.
- One accent. Slide 4 is the inverse of the others, not a second palette.
