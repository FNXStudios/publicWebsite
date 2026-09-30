import { expect, test } from '@playwright/test';
import { E2E_GAME_ORIGIN, serveFakeGame } from './helpers';

test('games index lists visible games only', async ({ page }) => {
  await page.goto('/games');
  // Every visible game is one portrait card.
  await expect(page.getByRole('article').getByRole('heading')).toHaveText(['Lantern Quarter', 'Tide Runner', 'Ember Crown']);
  await expect(page.getByText('Hidden Vault')).toHaveCount(0);
});

test('game detail renders only configured information', async ({ page }) => {
  await page.goto('/games/lantern-quarter');
  await expect(page.getByRole('heading', { level: 1, name: 'Lantern Quarter' })).toBeVisible();
  await expect(page.getByText('96.2%')).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);

  await page.goto('/games/tide-runner');
  await expect(page.getByText('RTP')).toHaveCount(0);
  await expect(page.getByText('N/A')).toHaveCount(0);
});

test('unknown and hidden games return 404', async ({ page }) => {
  expect((await page.goto('/games/not-a-game'))?.status()).toBe(404);
  expect((await page.goto('/games/hidden-vault'))?.status()).toBe(404);
  expect((await page.goto('/games/hidden-vault/play'))?.status()).toBe(404);
});

test('coming-soon games cannot launch', async ({ page }) => {
  await page.goto('/games/ember-crown');
  const hero = page.getByRole('region', { name: 'Ember Crown' });
  await expect(hero.getByText('Coming soon').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /play game/i })).toHaveCount(0);
  expect((await page.goto('/games/ember-crown/play'))?.status()).toBe(404);
});

test('Play game opens the player with the trusted URL and fades in on ready', async ({ page }) => {
  const requests = await serveFakeGame(page, 'ready');
  await page.goto('/games/lantern-quarter');
  await page.getByRole('link', { name: /play game/i }).first().click();
  await expect(page).toHaveURL('/games/lantern-quarter/play');

  const frame = page.locator('iframe[title="Lantern Quarter — game"]');
  await expect(frame).toHaveAttribute('src', `${E2E_GAME_ORIGIN}/lantern-quarter/index.html`);
  await expect(frame).toHaveClass(/opacity-100/);
  await expect(page.getByRole('banner')).toHaveCount(0); // no marketing header
  expect(requests).toEqual([`${E2E_GAME_ORIGIN}/lantern-quarter/index.html`]);

  await page.getByRole('link', { name: /back to game/i }).click();
  await expect(page).toHaveURL('/games/lantern-quarter');
});

test('a game that reports failure shows retry and back actions', async ({ page }) => {
  await serveFakeGame(page, 'error');
  await page.goto('/games/lantern-quarter/play');
  const alert = page.getByRole('alert').filter({ hasText: 'We couldn’t load the game.' });
  await expect(alert).toBeVisible();
  await expect(alert.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(alert.getByRole('link', { name: 'Back to games' })).toHaveAttribute('href', '/games');
});
