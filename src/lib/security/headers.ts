// Imported by next.config.ts, so this module uses relative imports only.
import { getGameOrigins } from '../games/origins';

interface HeaderOptions {
  isDev: boolean;
  env?: Record<string, string | undefined>;
}

/**
 * Content-Security-Policy for the site.
 *
 * - frame-src lists only the first-party game origin and explicitly declared
 *   third-party origins — never a wildcard.
 * - script-src keeps 'unsafe-inline' because pages are statically prerendered and
 *   Next.js emits inline bootstrap scripts; nonces would force dynamic rendering of
 *   every page. 'unsafe-eval' is only present in development (React dev tooling).
 * - style-src keeps 'unsafe-inline' for next/font's inline @font-face and the
 *   style attributes Motion writes during animation.
 */
export function buildContentSecurityPolicy({ isDev, env = process.env }: HeaderOptions): string {
  const frameOrigins = getGameOrigins(env).policies.map((policy) => policy.origin);
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(isDev ? ['ws:'] : [])],
    'media-src': ["'self'"],
    'frame-src': frameOrigins,
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
  };
  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(' ')}`);
  if (!isDev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

/**
 * Permissions-Policy: deny powerful features everywhere, and delegate only
 * fullscreen and autoplay — to this site and the trusted game origins.
 */
export function buildPermissionsPolicy(env: Record<string, string | undefined> = process.env): string {
  const origins = getGameOrigins(env).policies.map((policy) => `"${policy.origin}"`).join(' ');
  const denied = [
    'camera',
    'microphone',
    'geolocation',
    'payment',
    'usb',
    'serial',
    'hid',
    'midi',
    'magnetometer',
    'gyroscope',
    'accelerometer',
    'display-capture',
    'clipboard-read',
    'publickey-credentials-get',
    'browsing-topics',
  ];
  return [...denied.map((feature) => `${feature}=()`), `fullscreen=(self ${origins})`, `autoplay=(self ${origins})`].join(
    ', ',
  );
}

export function buildSecurityHeaders({ isDev, env = process.env }: HeaderOptions) {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy({ isDev, env }) },
    { key: 'Permissions-Policy', value: buildPermissionsPolicy(env) },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    // HSTS only when the deployment serves HTTPS end-to-end (set ENABLE_HSTS=true there).
    ...(!isDev && env.ENABLE_HSTS === 'true'
      ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
      : []),
  ];
}
