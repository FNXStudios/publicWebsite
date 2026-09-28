// Imported by next.config.ts, so this module uses relative imports only.
import { z } from 'zod';
import { thirdPartyGameOriginsConfig } from '../../config/game-origins.config';
import { parseConfig } from '../../config/schema/parse';
import {
  thirdPartyGameOriginsSchema,
  type IframeSandboxToken,
} from '../../config/schema/game-origin.schema';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const gameBaseUrlSchema = z
  .url({ protocol: /^https?$/ })
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' || LOCAL_HOSTS.has(url.hostname);
  }, 'must use https (plain http is only allowed for localhost)')
  .refine((value) => !new URL(value).search && !new URL(value).hash, 'must not contain a query or hash');

export type GameOriginPolicy =
  | { kind: 'first-party'; origin: string }
  | { kind: 'third-party'; origin: string; sandbox: IframeSandboxToken[] };

export interface GameOrigins {
  /** Base that `launchPath` values are resolved against. */
  baseUrl: URL;
  policies: GameOriginPolicy[];
}

/**
 * Reads the trusted game origins for the current environment. Throws when
 * NEXT_PUBLIC_GAME_BASE_URL is missing or unsafe so a misconfigured deploy fails
 * at build time instead of framing an unexpected host.
 */
export function getGameOrigins(env: Record<string, string | undefined> = process.env): GameOrigins {
  const raw = env.NEXT_PUBLIC_GAME_BASE_URL;
  const parsed = gameBaseUrlSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `NEXT_PUBLIC_GAME_BASE_URL ${raw ? `("${raw}") ` : ''}is invalid: ${z.prettifyError(parsed.error)}`,
    );
  }
  const baseUrl = new URL(parsed.data);
  const thirdParty = parseConfig('game origins', thirdPartyGameOriginsSchema, thirdPartyGameOriginsConfig);

  const policies: GameOriginPolicy[] = [{ kind: 'first-party', origin: baseUrl.origin }];
  for (const entry of thirdParty) {
    if (entry.origin === baseUrl.origin) {
      throw new Error(`${entry.origin} is the first-party game origin and must not be listed as third-party`);
    }
    policies.push({ kind: 'third-party', origin: entry.origin, sandbox: [...new Set(entry.sandbox)] });
  }
  return { baseUrl, policies };
}
