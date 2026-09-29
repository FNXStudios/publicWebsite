import type { NextConfig } from 'next';
import { buildSecurityHeaders } from './src/lib/security/headers';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * The E2E suite builds a separate app (in .next-e2e) whose game catalogue is swapped
 * for test fixtures, because the real catalogue may legitimately be empty.
 * Production builds never set FNX_E2E_FIXTURES.
 */
const e2eFixtures = process.env.FNX_E2E_FIXTURES === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(e2eFixtures
    ? {
        distDir: '.next-e2e',
        turbopack: { resolveAlias: { '@/config/games.config': './tests/fixtures/games.fixture.ts' } },
      }
    : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 80],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Contact is a global dialog, not a page. Old links land on the homepage with it open.
  async redirects() {
    return [{ source: '/contact', destination: '/?contact=open', permanent: false }];
  },
  async headers() {
    return [{ source: '/:path*', headers: buildSecurityHeaders({ isDev }) }];
  },
};

export default nextConfig;
