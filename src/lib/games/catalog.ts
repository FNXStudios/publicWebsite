import { games as configuredGames } from '@/config/games.config';
import type { Game } from '@/config/schema/game.schema';

const byOrder = (a: Game, b: Game) => a.order - b.order || a.title.localeCompare(b.title);

/** Pure selectors over a validated game list. Exported for tests and alternate sources. */
export function createGameCatalog(source: readonly Game[]) {
  const sorted = [...source].sort(byOrder);
  const visible = sorted.filter((game) => game.status !== 'hidden');

  return {
    all: (): Game[] => sorted,
    /** Available and coming-soon games; hidden games never leave the catalog. */
    visible: (): Game[] => visible,
    featured: (limit: number): Game[] => visible.filter((game) => game.featured).slice(0, Math.max(0, limit)),
    /** Returns undefined for unknown and hidden slugs alike. */
    bySlug: (slug: string): Game | undefined => visible.find((game) => game.slug === slug),
  };
}

const catalog = createGameCatalog(configuredGames);

export const getAllGames = catalog.all;
export const getVisibleGames = catalog.visible;
export const getFeaturedGames = catalog.featured;
export const getGameBySlug = catalog.bySlug;

export function isPlayable(game: Game): boolean {
  return game.status === 'available';
}

export const CATEGORY_LABELS: Record<Game['category'], string> = {
  slot: 'Slot',
  instant: 'Instant game',
};

export function gameArtAlt(game: Game): string {
  return game.artwork.alt ?? `${game.title} key art`;
}
