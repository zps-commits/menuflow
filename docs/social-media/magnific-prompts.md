# Magnific prompts, prepared but not run

The brief for this step names Magnific. **The account is on the Free plan
with 0 credits available**, checked on 2026-10-14, so nothing was generated
there. The four materials were composed deterministically in the browser
instead — see `composed/`.

That is the stronger route for this brief regardless. Its hardest rule is
that the content of a real screenshot must survive untouched: no altered
text, numbers, features or buttons. A generative model redraws what it is
shown and cannot promise that. The brief's own fallback says to keep the
capture intact and build the composition around it, which is exactly what a
rendered layout does.

## What would still be worth generating, with credits

Only a complementary background qualifies, because it contains no interface
to preserve. Never send a screenshot of the menu to an image model: it will
rewrite the dish names and the prices, and a menu showing an invented price
is worse than no image.

### Prompt: warm paper texture

```
An abstract background for a restaurant brand. Warm off-white paper with a
faint woven texture, like uncoated stock, a single soft shadow falling from
the upper left. No objects, no food, no text, no logo. Flat and quiet, with
generous empty space for type. Photographic, not illustrated. No gradients,
no glow, no 3D.
Aspect ratio 4:5.
```

### Prompt: embers, abstract

```
Extreme close-up of glowing wood embers in near darkness, deep charcoal with
small points of warm orange light, heavily out of focus so no individual
ember is readable. Photographic, natural colour, no flames, no smoke plume,
no sparks flying. Very dark overall so white type can sit over it.
Aspect ratio 4:5.
```

## Rules for whoever runs these

- A generated image may sit behind or beside a capture, never underneath it
  in a way that tints or distorts it.
- Never generate a plate of food and present it as a dish on the menu. The
  menu photography is licensed from Pexels and credited in
  `public/menu/CREDITS.json`; that is where dish images come from.
- Discard anything that looks like generic AI output. The product is warm,
  printed and quiet, not neon.
