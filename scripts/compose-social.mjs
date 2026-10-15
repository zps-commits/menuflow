/**
 * Builds the social-media images.
 *
 * The brief for this step names an AI image tool, and its hardest rule is
 * that the content of a real screenshot must survive untouched: no altered
 * text, numbers, features or buttons. No generative model can promise that —
 * it redraws what it is shown. The brief's own fallback is to keep the
 * capture intact and compose around it, which is what this does: real
 * captures placed, never regenerated, in a layout rendered by the browser.
 *
 *   npm run social
 *
 * Output: docs/social-media/composed/*.png at 1080x1350 (4:5).
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { chromium } from 'playwright';

const OUT = 'docs/social-media/composed';
const SHOTS = '../assets';

/* The application's own tokens, read from src/app/globals.css. A post that
   looks like the product is the point; a second palette is decoration. */
const T = {
  paper: '#faf7f2',
  surface: '#f2ece2',
  raised: '#ffffff',
  ink: '#1b1613',
  muted: '#5e564e',
  rule: '#e2d8cb',
  ember: '#a8401b',
};

const BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Karla:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px; height: 1350px; overflow: hidden;
    font-family: 'Karla', system-ui, sans-serif;
    background: ${T.paper}; color: ${T.ink};
    -webkit-font-smoothing: antialiased;
  }
  .frame { width: 1080px; height: 1350px; position: relative; display: flex; flex-direction: column; }
  .pad { padding: 84px 84px 0; }
  .eyebrow {
    font-size: 19px; font-weight: 600; letter-spacing: .16em;
    text-transform: uppercase; color: ${T.ember};
  }
  h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 112px; line-height: .94; font-weight: 600; letter-spacing: -.01em; }
  h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 72px; line-height: 1.02; font-weight: 600; }
  .lede { font-size: 33px; line-height: 1.34; color: ${T.muted}; max-width: 19ch; }
  /* A real capture sits in a plain frame: never cropped so it hides what it
     says, never rotated, never recoloured. */
  .shot-wrap { border-radius: 10px; overflow: hidden; box-shadow: 0 30px 70px -40px rgba(27,22,19,.5); border: 1px solid ${T.rule}; }
  .shot-wrap img { display: block; width: 100%; }
  .foot {
    margin-top: auto; padding: 0 84px 76px; display: flex; justify-content: space-between;
    align-items: baseline; font-size: 20px; font-weight: 500; color: ${T.muted};
  }
`;

/*
 * The five slides the brief lays out: presentation, problem, solution with
 * real screenshots, technology, result.
 *
 * One rule across all of them: the screen appears WHOLE. Nothing bleeds off
 * an edge, nothing is cropped.
 */
const SLIDES = [
  {
    name: '1-presentation',
    html: `
      <div class="frame" style="flex-direction:row; align-items:center; gap:52px; padding:0 84px">
        <div style="flex:1 1 0; min-width:0">
          <div class="eyebrow">Digital menu · order by WhatsApp</div>
          <h1 style="margin-top:22px; font-size:94px">MenuFlow</h1>
          <p class="lede" style="margin-top:26px; max-width:15ch">
            The customer builds the order. The restaurant receives it finished.
          </p>
          <div style="margin-top:38px; font-size:20px; font-weight:600; color:${T.ember}">
            menuflow-six-gamma.vercel.app
          </div>
        </div>
        <div class="shot-wrap" style="flex:0 0 372px">
          <img src="${SHOTS}/menu-mobile.png" alt="">
        </div>
      </div>`,
  },
  {
    name: '2-problem',
    html: `
      <div class="frame" style="justify-content:center; padding:0 84px">
        <div class="eyebrow">The problem</div>
        <h2 style="margin-top:20px; max-width:14ch">Two bad options</h2>

        <div style="margin-top:50px; display:grid; gap:24px">
          <div style="background:${T.raised}; border:1px solid ${T.rule}; border-radius:12px; padding:34px 38px">
            <div class="eyebrow">A delivery marketplace</div>
            <p style="margin-top:12px; font-size:29px; line-height:1.36">
              Takes a commission on every order. On food margins that is
              often the difference between a dish being profitable and not.
            </p>
          </div>
          <div style="background:${T.raised}; border:1px solid ${T.rule}; border-radius:12px; padding:34px 38px">
            <div class="eyebrow">A PDF and a phone number</div>
            <p style="margin-top:12px; font-size:29px; line-height:1.36">
              Produces "the usual, no onion, and one of those pastas",
              rebuilt over several messages, during service.
            </p>
          </div>
        </div>

        <p style="margin-top:42px; font-size:27px; line-height:1.42; color:${T.muted}; max-width:34ch">
          MenuFlow is the middle: the real menu, assembled by the customer,
          arriving written out in full on the channel the restaurant
          already uses.
        </p>
      </div>`,
  },
  {
    name: '3-solution',
    html: `
      <div class="frame">
        <div class="pad">
          <div class="eyebrow">The solution</div>
          <h2 style="margin-top:20px">Options that carry<br>their own rules</h2>
          <p style="margin-top:28px; font-size:26px; line-height:1.4; color:${T.muted}; max-width:32ch">
            "Choose one" and "up to two" are the same structure with
            different numbers. Sold-out dishes stay visible, marked, and
            cannot be ordered.
          </p>
        </div>
        <div style="flex:1; position:relative">
          <div class="shot-wrap" style="position:absolute; left:84px; bottom:70px; width:620px">
            <img src="${SHOTS}/product-options.png" alt="">
          </div>
          <div class="shot-wrap" style="position:absolute; right:70px; bottom:360px; width:320px">
            <img src="${SHOTS}/card-dish.png" alt="">
          </div>
        </div>
      </div>`,
  },
  {
    name: '4-technology',
    html: `
      <div class="frame" style="background:${T.ink}; color:${T.paper}">
        <div class="pad">
          <div class="eyebrow" style="color:#e08b63">The build</div>
          <h2 style="margin-top:20px; color:${T.paper}">Next.js · React 19<br>TypeScript · Tailwind v4</h2>
          <p style="margin-top:28px; font-size:26px; line-height:1.44; color:#b6aca3; max-width:34ch">
            Money as integer cents. No business rule lives in a component:
            pricing, line identity, search and message building are pure
            functions, tested without rendering anything.
          </p>
          <p style="margin-top:24px; font-size:26px; line-height:1.44; color:#b6aca3; max-width:34ch">
            <strong style="color:${T.paper}">The challenge actually faced:</strong>
            a required option group with a maximum of two opened empty.
            Types and 82 unit tests were green; the dish silently refused to
            be added. Only a browser found it.
          </p>
        </div>
        <div style="margin-top:auto; padding:0 84px">
          <div style="background:#262019; border:1px solid #37302a; border-radius:12px; padding:34px 40px">
            <pre style="font-family:ui-monospace,'SFMono-Regular',monospace; font-size:21px; line-height:1.7; color:#ddd4cb; white-space:pre"><span style="color:#e08b63">// A rare steak and a well-done steak are two</span>
<span style="color:#e08b63">// lines, not "2x steak". Ids are sorted.</span>
[productId, ...[...selectedChoiceIds].sort()].join(<span style="color:#c9a227">'|'</span>)</pre>
          </div>
        </div>
        <div class="foot" style="color:#9a9089">
          <span>Business rules live outside the components</span>
        </div>
      </div>`,
  },
  {
    name: '5-result',
    html: `
      <div class="frame">
        <div class="pad">
          <div class="eyebrow">The result</div>
          <h2 style="margin-top:20px">Built, verified,<br>and live</h2>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:0 84px">
          <dl style="border-top:1px solid ${T.rule}">
            ${[
              ['Tests across 7 files', '82 passing'],
              ['TypeScript strict, lint, build', 'clean'],
              ['axe-core, WCAG 2.1 A + AA', '0 violations'],
              ['Widths checked', '1440 · 768 · 430 · 390 · 360'],
            ]
              .map(
                ([k, v]) => `
              <div style="display:flex; justify-content:space-between; gap:24px; padding:26px 0; border-bottom:1px solid ${T.rule}">
                <dt style="font-size:26px; color:${T.muted}">${k}</dt>
                <dd style="font-size:26px; font-weight:600; color:${T.ember}">${v}</dd>
              </div>`,
              )
              .join('')}
          </dl>
          <p style="margin-top:32px; font-size:23px; line-height:1.45; color:${T.muted}; max-width:42ch">
            "Mesa Nove" is fictional and the WhatsApp number is a
            placeholder. No users, no clients, no revenue — the figures
            above are verification results.
          </p>
        </div>
        <div class="foot">
          <span style="color:${T.ember}">menuflow-six-gamma.vercel.app</span>
          <span>github.com/zps-commits/menuflow</span>
        </div>
      </div>`,
  },
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
const made = [];

for (const slide of SLIDES) {
  const file = `${OUT}/${slide.name}.html`;
  await writeFile(file, `<meta charset="utf-8"><style>${BASE}</style>${slide.html}`);
  await page.goto(`file://${process.cwd()}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${slide.name}.png` });
  await rm(file);
  made.push(`${OUT}/${slide.name}.png`);
}

await browser.close();
console.log(made.join('\n'));
