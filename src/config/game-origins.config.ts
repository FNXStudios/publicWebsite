import type { z } from 'zod';
import type { thirdPartyGameOriginsSchema } from './schema/game-origin.schema';

/**
 * Third-party game origins that may be framed by /games/[slug]/play.
 *
 * FNX's own game origin comes from NEXT_PUBLIC_GAME_BASE_URL and is always trusted.
 * Anything else must be listed here with an explicit sandbox policy — it is added to
 * the CSP frame-src and to the launch-URL allowlist. Keep this empty unless a real
 * partner-hosted build exists.
 */
export const thirdPartyGameOriginsConfig: z.input<typeof thirdPartyGameOriginsSchema> = [];
