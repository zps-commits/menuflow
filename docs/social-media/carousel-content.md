# Carousel — five slides

Format 1080 × 1350 (4:5). Follows the structure the brief sets: presentation,
problem, solution with real screenshots, technology, result.

Every screenshot named below exists in `../screenshots/`. Do not compose a
screen that is not in that folder.

---

## Slide 1 — presentation

**Name**
MenuFlow

**Category**
Digital menu · order by WhatsApp

**Value line**
The customer builds the order. The restaurant receives it finished.

**Visual**
Type only, on the menu's own background colour.

---

## Slide 2 — the problem

**Headline**
Two bad options

**Body**
A delivery marketplace takes a commission on every order.

A PDF and a phone number produces "the usual, no onion" — rebuilt over
several messages, during service.

**Visual**
Two stacked blocks, one per option. No illustration.

---

## Slide 3 — the solution

**Headline**
The real menu, on their phone

**Body**
Categories, search by ingredient, sold-out dishes marked and unorderable,
options with their own minimum and maximum, prices updating as they choose.

**Visual**
`../screenshots/menu-mobile.jpg` and `../screenshots/product-desktop.jpg`
side by side.

---

## Slide 4 — technology

**Headline**
How it is built

**Body**
Next.js App Router · React 19 · TypeScript strict · Tailwind CSS v4

Money as integer cents. Business rules as pure functions, outside the
components. The cart re-priced against the current menu on every read, never
trusted from storage.

**The technical challenge actually faced:** a required option group with a
maximum of two opened empty. Types and unit tests were both green; the dish
silently refused to be added. Only a browser found it.

**Visual**
Type only.

---

## Slide 5 — result

**Headline**
Built, verified, live

**Body**
82 tests passing. Zero axe-core violations: five screen widths locally, two
against the live deployment.

Demo: menuflow-six-gamma.vercel.app
Code: github.com/zps-commits/menuflow

**Visual**
`../screenshots/cart-desktop.jpg`, showing the finished order.

---

## Rules for whoever builds this

- Only verified information. No invented metric and no feature that is not
  built.
- Short text. Do not crop a screenshot in a way that changes what it shows.
- No excessive gradients, no glow, no futurism, no generic template look.
- Keep the colours of the application rather than introducing a palette.
- Leave the Canva file editable and organised for review.
