import { expect, test } from '@playwright/test';

// A first-time visitor: no stored confirmation.
test.use({ storageState: { cookies: [], origins: [] } });

test('first visit is gated until confirmed, then remembered across navigation', async ({ page }) => {
  await page.goto('/');
  const gate = page.getByRole('dialog', { name: 'Are you 18 or older?' });
  await expect(gate).toBeVisible();
  await expect(page.getByRole('button', { name: 'Yes, I’m 18+' })).toBeFocused();

  // Escape and clicks outside do not dismiss it.
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.mouse.click(10, 10);
  await expect(gate).toBeVisible();

  // Focus stays inside.
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  expect(await gate.evaluate((el) => el.contains(document.activeElement))).toBe(true);

  await page.getByRole('button', { name: 'Yes, I’m 18+' }).click();
  await expect(gate).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute('data-age-gate', /.*/);

  await page.goto('/studio');
  await expect(page.getByRole('dialog', { name: 'Are you 18 or older?' })).toBeHidden();
});

test('declining keeps the site closed', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'No, leave site' }).click();
  await expect(page.getByRole('heading', { name: 'This site is for adults only.' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-age-gate', 'pending');
});
