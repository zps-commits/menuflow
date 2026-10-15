# Canva build spec — MenuFlow carousel

There is no Canva connection in this environment, so the carousel was
rendered directly (`npm run social` → `composed/`). Those five PNGs are
postable as they are.

This file is what Canva needs to rebuild them as an **editable** file, which
is what the brief asks for. Everything below is measured from the running
application, not invented.

## Document

- Five pages, **1080 × 1350 px** (4:5).
- Page margin: **84 px** on every side.

## Colours

Taken from `src/app/globals.css`. Every pair was checked against WCAG 2.1 AA
before use; the worst is 5.08 against a 4.5 requirement.

| Role | Hex | Used for |
|---|---|---|
| Paper | `#f6f1e8` | Page background on slides 1, 2, 3, 5 |
| Raised | `#fffdf9` | Cards inside slide 2 |
| Ink | `#1d1510` | Headings, body, and the background of slide 4 |
| Muted | `#5a5047` | Secondary paragraphs |
| Rule | `#ddd0bd` | Hairlines |
| Ember | `#a3401c` | Eyebrows, figures, links — the one accent |
| On dark | `#f3e6dc` | Headings on slide 4 |
| On dark dim | `#b6aca3` | Body on slide 4 |

**One accent.** Do not add a second. Slide 4 is the inverse of the others,
not a different palette.

## Type

- Display (h1, h2): **Cormorant Garamond**, weight 600.
- Body, eyebrows, figures: **Karla**, weights 400/500/600.
- Code on slide 4: any monospace, 21 px, line height 1.7.

| Element | Size | Line height |
|---|---|---|
| Eyebrow | 19 px, 600, uppercase, letter-spacing 0.16em | — |
| h1 (slide 1) | 94 px | 0.94 |
| h2 (slides 2–5) | 72 px | 1.02 |
| Lede | 33 px | 1.34 |
| Body | 26–29 px | 1.36–1.44 |
| Footer | 20 px, 500 | — |

## Pages

### 1 — Presentation
Two columns. Left: eyebrow "DIGITAL MENU · ORDER BY WHATSAPP", h1
"MenuFlow", lede "The customer builds the order. The restaurant receives it
finished.", then `menuflow-six-gamma.vercel.app` in ember.
Right: `assets/menu-mobile.png` at 372 px wide, 10 px corner radius, 1 px
rule border. Vertically centred.

### 2 — Problem
h2 "Two bad options". Two stacked raised cards, 12 px radius, 34/38 padding:
- "A DELIVERY MARKETPLACE" — takes a commission on every order…
- "A PDF AND A PHONE NUMBER" — produces "the usual, no onion"…

Closing paragraph in muted: MenuFlow is the middle…

### 3 — Solution
h2 "Options that carry their own rules" plus the explanatory paragraph.
Two real captures, both **whole**:
- `assets/product-options.png`, 620 px wide, bottom left
- `assets/card-dish.png`, 320 px wide, overlapping upper right

### 4 — Technology
Ink background. h2 "Next.js · React 19 / TypeScript · Tailwind v4", two
paragraphs, and a code block at the foot (`#262019` fill, `#37302a` rule).
The technical challenge named here is the real one: a required option group
with a maximum of two opened empty, with types and 82 tests green.

### 5 — Result
h2 "Built, verified, and live", then a four-row table:

| 82 passing · clean · 0 violations · 1440 · 768 · 430 · 390 · 360 |

Then the honesty paragraph, then both links in the footer.

## Rules for whoever rebuilds this

- Place the screenshots **whole**. Do not crop one so a label is cut, and do
  not scale one past the frame so it bleeds — both were tried and both read
  as a mistake.
- Do not retouch a figure in a capture. If a number is wrong, fix the
  application and re-run `npm run shots`.
- No gradients, no glow, no futurism, no generic template look.
- Only verified information. No invented metric, no feature that is not
  built, no client logo — there are no clients.
