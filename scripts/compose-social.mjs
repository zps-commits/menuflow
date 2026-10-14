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

const SLIDES = [
  {
    name: '1-cover',
    html: `
      <div class="frame">
        <div class="pad">
          <div class="eyebrow">Digital menu · order by WhatsApp</div>
          <h1 style="margin-top:26px">MenuFlow</h1>
          <p class="lede" style="margin-top:34px">
            The customer builds the order. The restaurant receives it finished.
          </p>
        </div>
        <div style="margin-top:64px; padding-left:84px; overflow:hidden; flex:1">
          <div class="shot-wrap" style="width:1180px">
            <img src="${SHOTS}/menu-desktop.png" alt="">
          </div>
        </div>
      </div>`,
  },
  {
    name: '2-desktop-and-mobile',
    html: `
      <div class="frame">
        <div class="pad">
          <div class="eyebrow">Built for the phone it is read on</div>
          <h2 style="margin-top:22px">Verified at<br>1440 and 390&nbsp;px</h2>
        </div>
        <div style="position:relative; flex:1; margin-top:56px">
          <div class="shot-wrap" style="position:absolute; left:84px; top:0; width:740px">
            <img src="${SHOTS}/menu-desktop.png" alt="">
          </div>
          <div class="shot-wrap" style="position:absolute; right:62px; top:168px; width:296px">
            <img src="${SHOTS}/menu-mobile.png" alt="">
          </div>
        </div>
        <div class="foot">
          <span>0 axe-core violations</span><span style="color:${T.ember}">WCAG 2.1 A + AA</span>
        </div>
      </div>`,
  },
  {
    name: '3-features',
    html: `
      <div class="frame">
        <div class="pad">
          <div class="eyebrow">What the customer can do</div>
          <h2 style="margin-top:22px">Options that<br>carry their own rules</h2>
          <p style="margin-top:34px; font-size:28px; line-height:1.4; color:${T.muted}; max-width:30ch">
            "Pick one size" and "pick up to two extras" are the same structure
            with different numbers. The price updates as they choose.
          </p>
        </div>
        <!-- Captured as elements, placed whole. Nothing cropped, so nothing
             can be cut mid-label. -->
        <div style="flex:1; position:relative">
          <div class="shot-wrap" style="position:absolute; left:84px; bottom:70px; width:640px">
            <img src="${SHOTS}/product-options.png" alt="">
          </div>
          <div class="shot-wrap" style="position:absolute; right:70px; bottom:380px; width:330px">
            <img src="${SHOTS}/card-dish.png" alt="">
          </div>
        </div>
      </div>`,
  },
  {
    name: '4-the-rule',
    html: `
      <div class="frame" style="background:${T.ink}; color:${T.paper}">
        <div class="pad">
          <div class="eyebrow" style="color:#e08b63">The decision that matters</div>
          <h2 style="margin-top:24px; color:${T.paper}; max-width:15ch">
            A rare steak and a well-done steak are two lines.
          </h2>
          <p style="margin-top:36px; font-size:29px; line-height:1.4; color:#b6aca3; max-width:27ch">
            Not "2&times; steak". Merging them is how the wrong order reaches
            the kitchen. Ids are sorted, so choosing the same options in a
            different order still collapses into one line.
          </p>
        </div>
        <div style="flex:1; display:flex; align-items:center">
          <!-- Verbatim from src/domain/cart.ts, only re-wrapped to fit. -->
          <div style="margin:0 84px; width:100%; background:#262019; border:1px solid #37302a; border-radius:12px; padding:38px 42px">
            <pre style="font-family:ui-monospace,'SFMono-Regular',monospace; font-size:23px; line-height:1.7; color:#ddd4cb; white-space:pre"><span style="color:#e08b63">export function</span> makeLineId(
  productId: <span style="color:#e08b63">string</span>,
  selectedChoiceIds: <span style="color:#e08b63">string</span>[],
): <span style="color:#e08b63">string</span> {
  <span style="color:#e08b63">return</span> [productId, ...[...selectedChoiceIds].sort()]
    .join(<span style="color:#c9a227">'|'</span>);
}</pre>
          </div>
        </div>
        <div class="foot" style="color:#9a9089">
          <span>Money as integer cents</span><span style="color:#e08b63">menuflow-six-gamma.vercel.app</span>
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
