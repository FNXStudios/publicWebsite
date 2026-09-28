import { expect, test, type Page } from '@playwright/test';

async function fill(page: Page) {
  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('Work email').fill('ada@operator.example');
  await page.getByLabel('I’m interested in').selectOption('integration');
  await page.getByLabel('Message').fill('We would like to discuss an integration.');
}

test('shows validation errors and sends nothing', async ({ page }) => {
  let posted = false;
  await page.route('**/api/contact', (route) => {
    posted = true;
    return route.continue();
  });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Please tell us your name.')).toBeVisible();
  await expect(page.getByText('Please enter a valid work email.')).toBeVisible();
  expect(posted).toBe(false);
});

test('success appears only after the server accepts the message', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { ok: true } }));
  await page.goto('/contact');
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('heading', { name: /your message is with us/i })).toBeVisible();
});

test('without a configured endpoint the real API refuses and the form says so', async ({ page }) => {
  await page.goto('/contact');
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'temporarily unavailable' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /your message is with us/i })).toHaveCount(0);
  await expect(page.getByLabel('Message')).toHaveValue('We would like to discuss an integration.');
});

test('careers empty state preselects the careers topic', async ({ page }) => {
  await page.goto('/careers');
  await expect(page.getByRole('heading', { name: 'No open roles right now.' })).toBeVisible();
  await page.getByRole('link', { name: 'Introduce yourself' }).click();
  await expect(page.getByLabel('I’m interested in')).toHaveValue('careers');
});
