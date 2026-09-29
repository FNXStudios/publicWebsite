import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against a production build of the site whose game catalogue is swapped
 * for tests/fixtures/games.fixture.ts (see next.config.ts). Games are served from a
 * fake origin that the tests intercept.
 */
export const E2E_PORT = 3100;
export const E2E_GAME_ORIGIN = 'http://127.0.0.1:4455';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

/**
 * Most specs test the site behind the age gate, so every context starts as a visitor
 * who has already confirmed. tests/e2e/age-gate.spec.ts opts out to test the gate itself.
 * (Mirrors src/lib/age-gate/storage.ts and the configured version.)
 */
export const AGE_VERIFIED_STATE = {
  cookies: [],
  origins: [
    {
      origin: `http://localhost:${E2E_PORT}`,
      localStorage: [
        {
          name: 'fnx_age_verified',
          value: JSON.stringify({ version: 1, verifiedAt: Date.now(), expiresAt: Date.now() + 864e5 }),
        },
      ],
    },
  ],
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${E2E_PORT}`,
    storageState: AGE_VERIFIED_STATE,
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `next build && next start -p ${E2E_PORT}`,
    url: `http://localhost:${E2E_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      FNX_E2E_FIXTURES: '1',
      NEXT_PUBLIC_GAME_BASE_URL: E2E_GAME_ORIGIN,
      NEXT_PUBLIC_SITE_URL: `http://localhost:${E2E_PORT}`,
      CONTACT_SUBMIT_ENDPOINT: '',
    },
  },
});
