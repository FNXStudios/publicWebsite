/**
 * Renders the visual fixtures (development artwork) to JPEG via headless Chromium.
 *
 *   node scripts/visual-fixtures/render.mjs            # all scenes
 *   node scripts/visual-fixtures/render.mjs hero dragon-thumb
 *
 * Needs a Chromium for Playwright (set PLAYWRIGHT_CHROMIUM_EXECUTABLE if not installed).
 * Output goes to public/visual-fixtures/ and public/art/. Nothing here ships to users.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const here = import.meta.dirname;
const root = path.resolve(here, '../..');
const font = readFileSync(path.join(root, 'src/app/fonts/manrope-latin-var.woff2')).toString('base64');
const scripts = ['symbols.js', 'scenes.js', 'scenes-art.js', 'scenes-production.js'].map((f) => readFileSync(path.join(here, f), 'utf8'));

const html = `<!doctype html><html><head><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:200 800}
html,body{margin:0;background:#000}svg{display:block}
</style></head><body><div id="out"></div>${scripts.map((s) => `<script>${s}</script>`).join('')}</body></html>`;

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
);
const page = await browser.newPage();
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);

const list = await page.evaluate(() => window.FX.OUTPUTS);
const only = process.argv.slice(2);
for (const item of list) {
  if (only.length && !only.includes(item.name)) continue;
  const { name, w, h, file, quality = 84 } = item;
  await page.setViewportSize({ width: w, height: h });
  await page.evaluate(({ name, w, h }) => {
    document.getElementById('out').innerHTML = window.FX.render(name, w, h);
  }, { name, w, h });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(50);
  const out = path.join(root, 'public', file);
  mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: 'jpeg', quality, clip: { x: 0, y: 0, width: w, height: h } });
  console.log(`✓ ${file} (${w}×${h})`);
}
await browser.close();
