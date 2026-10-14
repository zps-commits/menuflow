# Screenshots

## Composed images, ready to post

`composed/` holds four finished 1080 x 1350 (4:5) images, built by
`npm run social` from `scripts/compose-social.mjs`:

| File | What it is |
|---|---|
| `1-cover.png` | Project cover, with the real menu bleeding off the bottom |
| `2-desktop-and-mobile.png` | The menu at both widths |
| `3-features.png` | Both option groups, "choose one" and "up to 2", with a dish card |
| `4-the-rule.png` | Cart line identity, beside the real `makeLineId` source |

Every screenshot inside them is placed, never regenerated. No text, number,
button or feature is altered anywhere.

## Captured from the deployment

`assets/` is captured by `npm run shots` against the live site, so what is
shown is what people see. It includes element captures — a single dish card,
both option groups — because cropping a viewport screenshot into a layout
risks cutting through a label, and anything below the fold is not in the
image at all.

## Already captured

In `../screenshots/`, captured from the running application. Nothing here is
drawn, mocked or retouched.

| File | Shows | Used for |
|---|---|---|
| `menu-desktop.jpg` | The menu with categories and search | README hero, post main image |
| `menu-mobile.jpg` | The menu at phone width | Carousel slide 3 |
| `product-desktop.jpg` | Option groups with prices updating | Carousel slide 3 |
| `product-mobile.jpg` | The same on a phone | Alternative for slide 3 |
| `cart-desktop.jpg` | The assembled order with lines and totals | Carousel slide 5 |
| `cart-mobile.jpg` | The cart at phone width | Mobile proof |
| `checkout-desktop.jpg` | Pickup or delivery, and the fields each needs | Showing the flow completes |

## Still worth capturing

Listed rather than faked:

1. **A sold-out dish, marked and unorderable.** One of the clearest
   single-frame proofs that the catalog state is real. Not currently
   captured.
2. **The WhatsApp message itself**, as it arrives. This is the actual output
   of the product and there is no screenshot of it. It needs a real phone
   with the placeholder number replaced, so it cannot be captured from the
   demo as it stands.
3. **Search by ingredient returning a dish whose name does not contain the
   term.** The feature is easy to describe and hard to believe without a
   frame.
4. **The empty-cart state.** Shows the empty states are designed rather than
   blank.
5. **A mobile checkout at 360px**, the narrowest width verified.

## Rules

- Capture from the running application, never compose a screen.
- Do not retouch a number. If a figure is wrong, fix the application and
  re-capture.
- `menu-mobile.jpg` is 755 KB, large for a social upload. Re-encode before
  publishing rather than letting the platform do it.
