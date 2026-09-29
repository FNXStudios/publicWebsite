import { existsSync } from 'node:fs';
import path from 'node:path';

/** Neutral branded placeholder. Ships with the site so a missing image can never render broken. */
export const FALLBACK_ART = '/art/fallback.webp';

const cache = new Map<string, boolean>();
const warned = new Set<string>();

function existsInPublic(src: string): boolean {
  const cached = cache.get(src);
  if (cached !== undefined) return cached;
  let exists = true; // if the filesystem cannot be inspected, trust the configured path
  try {
    exists = existsSync(path.join(process.cwd(), 'public', src));
  } catch {
    /* keep default */
  }
  cache.set(src, exists);
  return exists;
}

/**
 * Canonical artwork resolution (server-side). Configured artwork is used whenever the
 * file exists; otherwise the neutral fallback renders and the gap is logged once so it
 * is visible in build output rather than silently papered over.
 */
export function resolveArtSrc(src: string): string {
  if (!src.startsWith('/') || existsInPublic(src)) return src;
  if (!warned.has(src)) {
    warned.add(src);
    console.warn(`[art] Missing artwork "${src}" — rendering fallback ${FALLBACK_ART}.`);
  }
  return FALLBACK_ART;
}
