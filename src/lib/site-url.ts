import { z } from 'zod';

const siteUrlSchema = z.url({ protocol: /^https?$/ });

/**
 * Canonical origin for metadata, sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL per environment; localhost is the development fallback.
 */
export function getSiteUrl(env: Record<string, string | undefined> = process.env): URL {
  const raw = env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    if (env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_SITE_URL must be set for production builds');
    }
    return new URL('http://localhost:3000');
  }
  const parsed = siteUrlSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`NEXT_PUBLIC_SITE_URL ("${raw}") is not a valid URL`);
  return new URL(parsed.data);
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
