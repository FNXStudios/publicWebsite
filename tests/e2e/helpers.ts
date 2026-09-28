import type { Page } from '@playwright/test';
import { E2E_GAME_ORIGIN } from '../../playwright.config';

export { E2E_GAME_ORIGIN };

/** Serves a minimal fake game from the trusted game origin. */
export async function serveFakeGame(page: Page, behaviour: 'ready' | 'error' | 'silent' = 'ready') {
  const requests: string[] = [];
  await page.route(`${E2E_GAME_ORIGIN}/**`, async (route) => {
    requests.push(route.request().url());
    const script =
      behaviour === 'silent' ? '' : `<script>parent.postMessage({ type: 'fnx:${behaviour}' }, '*');</script>`;
    await route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><body style="margin:0;background:#123">fake game${script}</body></html>`,
    });
  });
  return requests;
}
