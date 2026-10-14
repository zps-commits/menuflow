# MenuFlow — commercial case study

## Who it is for

A neighbourhood restaurant, café or small food business that takes orders by
WhatsApp and does not have, or does not want, a delivery marketplace.

## The problem it solves

A small restaurant wanting to take orders online usually picks between two
bad options.

**A delivery marketplace** takes a commission on every order. On thin food
margins, that commission is often the difference between a profitable dish
and an unprofitable one, and the restaurant does not own the customer
relationship it is paying for.

**A PDF menu and a phone number** costs nothing and produces orders like
"the usual, but no onion, and one of those pastas". Reconstructing that
takes several messages, during service, and it is where the wrong order
comes from.

MenuFlow sits between the two. The customer assembles the order on their own
phone, from the real menu with the real prices and the real options, and the
restaurant receives it written out in full on WhatsApp — the channel it
already runs on.

## What the restaurant gets

- An order that is already complete: every line, every option, every note,
  the unit prices and the total.
- No commission per order and no payment provider in the middle.
- Dishes that sold out marked as sold out, so nobody orders them.
- A menu it can change by editing one file, including prices and
  availability.
- Nothing to log into and nothing to maintain. It is a static site.

## What it deliberately does not do

Stated plainly, because a demonstration that overclaims is worse than one
that is modest:

- **It does not confirm orders.** Opening WhatsApp sends a message. The order
  is confirmed when the restaurant replies, and the interface says so.
- **It does not take payment.** Nothing simulates one.
- **It does not invent a delivery fee.** The menu carries a note saying the
  fee depends on the address and is settled in the conversation.
- **It is not a management system.** No admin panel, no order history, no
  kitchen printing, no analytics. Those need a backend, and each one is
  written down in the roadmap rather than faked in the interface.

## Status and honesty

This is a working demonstration, not a deployed business.

- The restaurant, **Mesa Nove**, is fictional: 14 dishes across 5 categories,
  one deliberately sold out, eight with option groups.
- The WhatsApp number is a placeholder and must be replaced before real use.
- Photography is licensed from Pexels, with photographer credits in the repo.
- **There are no users, no clients and no revenue**, so no figure of that
  kind appears anywhere.

The only numbers quoted anywhere in this pack are verification results:
82 passing tests and zero accessibility violations at five screen widths.

## For a restaurant owner reading this

Adapting it to a real menu is editing one file: the restaurant name, the
WhatsApp number, the categories, the dishes with their prices, photos,
options and availability. No deployment pipeline to learn and no monthly
platform fee.
