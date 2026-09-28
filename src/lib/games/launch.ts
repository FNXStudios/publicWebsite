import type { Game } from '@/config/schema/game.schema';
import { getGameOrigins, type GameOriginPolicy, type GameOrigins } from './origins';

export interface GameLaunch {
  url: string;
  origin: string;
  policy: GameOriginPolicy;
}

/**
 * Resolves the iframe URL for a game. Returns null when the game cannot be launched
 * (not available, or no launch target). Throws when a configured absolute URL points
 * at an origin that is not explicitly trusted — that is a configuration error.
 */
export function resolveGameLaunch(game: Game, origins: GameOrigins = getGameOrigins()): GameLaunch | null {
  if (game.status !== 'available') return null;

  let url: URL;
  if (game.game.launchPath) {
    const basePath = origins.baseUrl.pathname.replace(/\/$/, '');
    url = new URL(`${basePath}${game.game.launchPath}`, origins.baseUrl.origin);
  } else if (game.game.launchUrl) {
    url = new URL(game.game.launchUrl);
  } else {
    return null;
  }

  const policy = origins.policies.find((p) => p.origin === url.origin);
  if (!policy) {
    throw new Error(
      `Game "${game.slug}" launches from untrusted origin ${url.origin}. ` +
        'Use launchPath, or declare the origin in src/config/game-origins.config.ts.',
    );
  }
  return { url: url.toString(), origin: url.origin, policy };
}
