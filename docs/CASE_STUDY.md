# MenuFlow — case study

## Problem

A small restaurant taking orders online chooses between a delivery
marketplace that charges a commission on every order, and a PDF menu with a
phone number. The marketplace is expensive and owns the customer. The PDF
produces orders like "the usual, no onion" that take four messages to pin
down, and the price is argued about at the door.

The gap is narrow and specific: let the customer assemble the order, with the
real prices and the real options, and deliver it to the restaurant written
out, on the channel it already reads all day.

## Solution

A menu that runs entirely in the browser and ends in a WhatsApp message.

The customer browses by category or searches by ingredient, opens a dish,
chooses its options, adds a note, and builds a cart that survives closing the
tab. At checkout they pick pickup or delivery, give only what that choice
requires, and send. The restaurant receives every line, every option, every
note, the unit prices and the subtotal, as text it can read on a phone while
standing at a pass.

There is no backend, no database and no payment provider, which is what keeps
it something a small restaurant can actually run.

## Architecture

```
app/        routes
components/ presentation, grouped by surface
domain/     catalog · search · pricing · cart · order
lib/        money · storage · cart store
data/       the menu
```

The rules live in `domain/` as pure functions: what a line costs, whether a
selection is complete, what the message says. Components call them. Nothing
about pricing or validity is re-derived inside a component, so the same rule
cannot drift between the product page and the cart.

State is one external store read through `useSyncExternalStore`. The cart is
`localStorage`, which is external state, and React 19 treats a synchronous
`setState` inside an effect as a lint error. Going through a store also gave
cross-tab sync without extra work.

## Technical decisions

**Money is integer cents, end to end.** Prices are only divided when they are
displayed. Floating point would be fine for one dish and wrong for a table of
eight, and a menu that is a few cents off is a menu nobody trusts.

**A cart line is the dish plus its choices.** The identity is the product id
and the sorted choice ids. A rare ribeye and a well-done ribeye are two lines,
not "2x ribeye" that arrives wrong. Sorting means picking the same options in
a different order still resolves to one line.

**The cart is priced against the current menu, never from stored prices.** A
cart can sit in a browser for weeks; the menu changes with the market. Lines
whose dish has sold out are dropped and the customer is told, instead of being
quietly charged a price that no longer exists.

**Stored data is treated as hostile.** Everything read back is validated
against the catalog: unknown dishes, options belonging to another dish,
negative quantities, oversized notes and duplicate lines are repaired or
discarded. Hand-edited `localStorage` cannot put a price into an order.

**No fee is invented.** The catalog holds a sentence explaining how the
delivery fee is decided, and that sentence travels into the message. A test
asserts no currency amount ever follows the words "delivery fee".

**Opening WhatsApp is not an order.** The button says so, the message ends by
asking the restaurant to confirm, and nothing simulates a payment. This was a
constraint from the start rather than a disclaimer added at the end.

## Challenges

**A required group that allows more than one choice.** The ribeye requires a
side but allows two. The first customiser pre-selected only single-choice
groups, so that group opened empty, the selection was invalid, and pressing
*Add to order* did nothing visible. Both the type checker and the test suite
were green. A browser test driving the real flow caught it. The fix was to
pre-select the first `min` choices of every group; the lesson was that the
interface test earned its place over the unit test here.

**`setState` inside an effect.** Hydrating the cart from `localStorage` in an
effect is the obvious first implementation and fails `npm run lint` on React
19. Rewriting it as an external store was the right answer rather than a
workaround, and it brought cross-tab sync with it.

**Peer dependency on a fresh scaffold.** `create-next-app` installed
`@types/node@20`; Vitest 5 requires `^22 || >=24`. Pinned to 24 to match the
runtime.

## Results

What is actually true, measured in this repository:

- 82 tests passing: domain as pure functions, plus interface tests through
  the rendered components.
- TypeScript strict, ESLint and the production build all clean.
- Verified in Chromium at 360, 390, 430, 768 and 1440 px.
- No runtime dependency beyond React, Next and an icon set. No database, no
  authentication, no paid service.

There are no usage numbers, no customers and no revenue figures, because this
is a portfolio build and has never been put in front of a restaurant. Any
claim otherwise would be invented.

## Future improvements

An admin panel and a database, so the menu stops being a file a developer
edits. Order history, so a restaurant can see what came through. Online
payment, which turns this from a message into a transaction and brings a
different class of obligation with it. Multiple restaurants on one deployment.
Kitchen printing.

Each needs a backend. They are listed here rather than stubbed in the
interface: nothing in the application pretends any of them exist.
