import type { ContactAction, HeadlineLines } from './content.types';
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
  headline: ['Original worlds.', 'Different reasons to play.'],
  body: 'Every FNX title starts with its own hook, rhythm and visual identity.',
  portfolioLabel: 'Portfolio',
  empty: {
    headline: 'Our first titles are on their way.',
    body: 'Games will appear here as they are released. For partnership or early-access conversations, get in touch.',
    cta: { label: 'Get in touch', interest: 'original-content' },
  },
  closing: {
    eyebrow: 'Original content',
    headline: 'Looking for something original?',
    body: 'Talk to us about the portfolio, upcoming titles or a game built around your players.',
    cta: { label: 'Talk to us', interest: 'original-content' },
  },
} satisfies {
  eyebrow: string;
  headline: HeadlineLines;
  body: string;
  portfolioLabel: string;
  empty: { headline: string; body: string; cta: ContactAction };
  closing: { eyebrow: string; headline: string; body: string; cta: ContactAction };
};
