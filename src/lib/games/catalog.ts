import { isDemoContentEnabled } from '@/config/demo';
import { games as configuredGames } from '@/config/games.config';
import { gameCollectionSchema, type Game } from '@/config/schema/game.schema';
import { demoGames } from '@/content/visual-fixtures/games';

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

/**
 * Chooses the games used for *display* (cards, grids). Production games always win:
 * demo fixtures appear only when demo content is on AND there is nothing real to show.
 */
export function resolveDisplayGames(
  production: readonly Game[],
  demo: readonly Game[],
  useDemo: boolean,
): readonly Game[] {
  const hasProduction = production.some((game) => game.status !== 'hidden');
  return hasProduction || !useDemo ? production : demo;
}

/** Production catalogue: routes, sitemap, SEO and the player. Never contains demo games. */
const catalog = createGameCatalog(configuredGames);

export const getAllGames = catalog.all;
export const getVisibleGames = catalog.visible;
export const getGameBySlug = catalog.bySlug;

/** Display catalogue: production, or demo fixtures when enabled and nothing real exists. */
const displayCatalog = createGameCatalog(
  resolveDisplayGames(configuredGames, gameCollectionSchema.parse(demoGames), isDemoContentEnabled()),
);

export const getDisplayGames = displayCatalog.visible;
export const getFeaturedGames = displayCatalog.featured;
/**
 * Detail-page lookup over the display catalogue. Identical to `getGameBySlug` whenever a
 * production game exists; while only design fixtures are showing, it lets their detail
 * pages render (noindex, no JSON-LD, never in the sitemap, never playable).
 */
export const getDisplayGameBySlug = displayCatalog.bySlug;

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

const numberFormat = new Intl.NumberFormat('en-GB');

/**
 * Short metadata for a card: layout, ways/paylines and one headline feature.
 * Falls back to the category so a card never renders an empty row.
 */
export function gameCardFacts(game: Game): string[] {
  const { reels, rows, ways, paylines, features } = game.info;
  const facts: string[] = [];
  if (reels && rows) facts.push(`${reels} × ${rows}`);
  if (ways) facts.push(`${numberFormat.format(ways)} ways`);
  else if (paylines) facts.push(`${paylines} lines`);
  if (features?.[0]) facts.push(features[0]);
  return facts.length > 0 ? facts : [CATEGORY_LABELS[game.category]];
}
