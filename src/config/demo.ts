/**
 * Single switch for design-time demo content (see src/content/demo).
 *
 *   NEXT_PUBLIC_USE_DEMO_CONTENT=true   force on
 *   NEXT_PUBLIC_USE_DEMO_CONTENT=false  force off
 *   unset                               on in `next dev`, off everywhere else
 *
 * Demo content is only ever a visual fallback for an empty catalogue.
 */
export function isDemoContentEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const flag = env.NEXT_PUBLIC_USE_DEMO_CONTENT?.trim().toLowerCase();
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;
  return env.NODE_ENV === 'development';
}
