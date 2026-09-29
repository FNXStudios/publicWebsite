import { expect, test } from '@playwright/test';
import { AGE_VERIFIED_STATE } from '../../playwright.config';

const PAGES = ['/', '/games', '/games/lantern-quarter', '/games/ember-crown', '/studio', '/careers'];

test('pages render without console errors or hydration warnings', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || /hydrat/i.test(msg.text())) problems.push(`${page.url()}: ${msg.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`${page.url()}: ${error.message}`));
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(problems).toEqual([]);
});

test('scroll reveals finish showing content', async ({ page }) => {
  await page.goto('/');
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(60);
  }
  await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
});

test('reduced motion keeps everything static and visible', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', storageState: AGE_VERIFIED_STATE });
  const page = await context.newPage();
  await page.goto('/studio');
  await expect(page.locator('[data-reveal]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Production', exact: true })).toBeVisible();
  await context.close();
});

test('images reserve their space and responsive sources are served', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-title"] img').first();
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  const srcset = await hero.getAttribute('srcset');
  expect(srcset).toContain('/_next/image');
  expect(srcset).toContain('w=640');
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!entry.hadRecentInput) total += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 1500);
      }),
  );
  expect(cls).toBeLessThan(0.1);
});
