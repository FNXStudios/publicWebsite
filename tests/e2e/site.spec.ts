import { expect, test } from '@playwright/test';
import { E2E_GAME_ORIGIN } from './helpers';

test.describe('homepage', () => {
  test('renders the hero and featured games from config, without loading any game', async ({ page }) => {
    const gameRequests: string[] = [];
    page.on('request', (r) => r.url().startsWith(E2E_GAME_ORIGIN) && gameRequests.push(r.url()));
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Independent iGaming\s+studio for real play\./);
    const featured = page.getByRole('region', { name: 'Original worlds. Built to play.' });
    await expect(featured.getByRole('heading', { level: 3 })).toHaveText(['Lantern Quarter', 'Tide Runner', 'Ember Crown']);
    await expect(page.getByText('Hidden Vault')).toHaveCount(0);
    await expect(page.locator('iframe')).toHaveCount(0);
    expect(gameRequests).toEqual([]);
  });

  test('sends strict security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain(`frame-src ${E2E_GAME_ORIGIN};`);
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });

  test('has no technology or about page and serves a styled 404', async ({ page, request }) => {
    expect((await request.get('/about')).status()).toBe(404);
    const response = await page.goto('/technology');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'This page wandered off.' })).toBeVisible();
  });

  test('sitemap lists visible games only', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('/games/lantern-quarter');
    expect(xml).toContain('/games/ember-crown');
    expect(xml).not.toContain('hidden-vault');
    expect(xml).not.toContain('/play');
    expect(xml).not.toContain('/contact');
  });
});

test.describe('navigation', () => {
  test('primary navigation reaches every section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Games', 'Studio', 'Careers']);
    for (const [label, path] of [
      ['Games', '/games'],
      ['Studio', '/studio'],
      ['Careers', '/careers'],
    ] as const) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(path);
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    }
    // Contact is a dialog over the current page, not a destination.
    await page.getByRole('banner').getByRole('button', { name: 'Get in touch' }).click();
    await expect(page.getByRole('dialog', { name: 'Have something worth building?' })).toBeVisible();
    await expect(page).toHaveURL('/careers');
  });

  test('mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile navigation');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Studio', exact: true }).click();
    await expect(page).toHaveURL('/studio');
    await expect(menu).toBeHidden();

    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('skip link moves focus to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard flow');
    await page.goto('/studio');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});
