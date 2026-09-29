import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.tsx'],
    env: {
      NEXT_PUBLIC_SITE_URL: 'https://www.fnx-studios.com',
      NEXT_PUBLIC_GAME_BASE_URL: 'https://games.fnx-studios.com',
    },
  },
});
