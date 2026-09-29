import { expect, test, type Page } from '@playwright/test';

async function openContact(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('button', { name: 'Get in touch' }).click();
  } else {
    await page.getByRole('banner').getByRole('button', { name: 'Get in touch' }).click();
  }
  const dialog = page.getByRole('dialog', { name: 'Have something worth building?' });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function fill(page: Page) {
  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('Work email').fill('ada@operator.example');
  await page.getByRole('combobox', { name: 'I’m interested in' }).click();
  await page.getByRole('option', { name: 'Game Production' }).click();
  await page.getByLabel('Message').fill('We would like to discuss game production.');
}

test('there is no contact page: the old URL opens the global dialog', async ({ page }) => {
  await page.goto('/contact');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('dialog', { name: 'Have something worth building?' })).toBeVisible();
});

test('get in touch opens over the current page and returns focus on close', async ({ page, isMobile }) => {
  await page.goto('/studio');
  const dialog = await openContact(page, isMobile);
  await expect(page).toHaveURL('/studio');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  if (!isMobile) await expect(page.getByRole('banner').getByRole('button', { name: 'Get in touch' })).toBeFocused();
});

test('shows validation errors and sends nothing', async ({ page, isMobile }) => {
  let posted = false;
  await page.route('**/api/contact', (route) => {
    posted = true;
    return route.continue();
  });
  await page.goto('/');
  await openContact(page, isMobile);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Please tell us your name.')).toBeVisible();
  await expect(page.getByText('Please enter a valid work email.')).toBeVisible();
  expect(posted).toBe(false);
});

test('success appears only after the server accepts the message', async ({ page, isMobile }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { ok: true } }));
  await page.goto('/');
  await openContact(page, isMobile);
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('heading', { name: /your message is with us/i })).toBeVisible();
});

test('without a configured endpoint the real API refuses and the form says so', async ({ page, isMobile }) => {
  await page.goto('/');
  await openContact(page, isMobile);
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'temporarily unavailable' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /your message is with us/i })).toHaveCount(0);
  await expect(page.getByLabel('Message')).toHaveValue('We would like to discuss game production.');
});

test('open careers role preselects the careers topic', async ({ page }) => {
  await page.goto('/careers');
  await expect(page.getByRole('heading', { name: 'Animator' })).toBeVisible();
  await page.getByRole('button', { name: /Animator/ }).click();
  await expect(page.getByRole('combobox', { name: 'I’m interested in' })).toHaveText(/Careers/);
});
