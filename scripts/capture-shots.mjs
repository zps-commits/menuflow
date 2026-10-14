/**
 * Captures the images used in the README and the social-media pack.
 *
 * Run against a server that is already up — the deployment, so what is
 * captured is what people actually see:
 *
 *   SHOT_URL=https://menuflow-six-gamma.vercel.app/ npm run shots
 *
 * Element captures matter more here than viewport ones. Cropping a viewport
 * screenshot into a layout risks cutting through a label, and anything below
 * the fold is not in the image at all. Screenshotting the element gives a
 * composition the exact thing it needs, whole.
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const URL = (process.env.SHOT_URL ?? 'http://localhost:3000/').replace(/\/$/, '');
const OUT = process.env.SHOT_DIR ?? 'docs/social-media/assets';

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const taken = [];

async function open(path, { width = 1440, height = 900 } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(URL + path, { waitUntil: 'networkidle' });
  return { context, page };
}

async function viewport(name, path, options = {}) {
  const { context, page } = await open(path, options);
  if (options.prepare) await options.prepare(page);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: options.fullPage ?? false });
  await context.close();
  taken.push(`${name}.png`);
}

async function element(name, path, selector, options = {}) {
  const { context, page } = await open(path, options);
  if (options.prepare) await options.prepare(page);
  await page.waitForTimeout(200);
  await page.locator(selector).first().screenshot({ path: `${OUT}/${name}.png` });
  await context.close();
  taken.push(`${name}.png`);
}

await viewport('menu-desktop', '/');
await viewport('menu-mobile', '/', { width: 390, height: 844 });
await viewport('product-desktop', '/product/bruschetta');
await viewport('cart-mobile', '/cart', { width: 390, height: 844 });

/* One dish card, whole. The smallest honest unit of the menu. */
await element('card-dish', '/', 'article');

/* Both option groups together — "choose one" and "up to 2" — which is the
   point being made about them. Capturing a single fieldset would show only
   half of it. */
await element('product-options', '/product/bruschetta', 'div:has(> fieldset)', {
  height: 1200,
});

await browser.close();
console.log(taken.join('\n'));
