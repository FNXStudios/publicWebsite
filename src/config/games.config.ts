import { routes } from '@/lib/routes';
import type { HeadlineLines } from './content.types';
import { gameCollectionSchema, type GameInput } from './schema/game.schema';
import { parseConfig } from './schema/parse';

/**
 * The canonical list of FNX games — the only place a game's title, artwork, launch
 * target and info are defined. Every page, card, sitemap entry and player derives
 * from this list. See README → "Adding a game".
 *
 * Only publish verified facts. Optional info fields (RTP, max win, volatility…)
 * are simply omitted from the UI when not set.
 */
const gamesInput: GameInput[] = [
  // TODO(content): add FNX titles here once title, launch path and verified info are confirmed.
];

export const games = parseConfig('games', gameCollectionSchema, gamesInput);

export const gamesPageContent = {
  eyebrow: 'Games',
  headline: ['Original worlds.', 'Built to play.'],
  body: 'Every FNX title is an original — its own world, its own rhythm, its own reason to play.',
  empty: {
    headline: 'Our first titles are on their way.',
    body: 'Games will appear here as they are released. For partnership or early-access conversations, get in touch.',
    cta: { label: 'Get in touch', href: routes.contact },
  },
} satisfies {
  eyebrow: string;
  headline: HeadlineLines;
  body: string;
  empty: { headline: string; body: string; cta: { label: string; href: string } };
};
