/**
 * DESIGN FIXTURES — not FNX games.
 *
 * These exist only so layouts can be judged with realistic content while the real
 * catalogue is empty. They are flagged `isDemo`: never in the sitemap, never indexed
 * (detail pages are noindex, without JSON-LD), never playable, and never shown once a
 * production game exists or demo content is off (see src/config/demo.ts and
 * src/lib/games/catalog.ts). The copy below is placeholder, not a product claim.
 * Delete this folder to remove them.
 */
import type { GameInput } from '@/config/schema/game.schema';

const base = { status: 'coming-soon', category: 'slot', featured: true, isDemo: true } as const;
const launch = { orientation: 'landscape', aspectRatio: '16/9', readySignal: false } as const;

export const demoGames: GameInput[] = [
  {
    ...base,
    id: 'dragons-fortune',
    slug: 'dragons-fortune',
    title: 'Dragon’s Fortune',
    shortDescription: 'A coiled dragon guards a sun-red hoard.',
    description: 'Beneath a sun the colour of embers, a dragon wraps itself around everything it has ever won. Every spin tightens the coil.\n\nFree spins open the hoard: the dragon unwinds, symbols grow heavier and the reels slow just enough to let each win land.',
    order: 1,
    artwork: { thumbnail: '/demo/games/dragons-fortune.jpg', hero: '/demo/games/dragons-fortune-hero.jpg', heroMobile: '/demo/games/dragons-fortune.jpg' },
    game: launch,
    info: { reels: 5, rows: 3, ways: 1024, features: ['Free spins'] },
  },
  {
    ...base,
    id: 'mystic-tides',
    slug: 'mystic-tides',
    title: 'Mystic Tides',
    shortDescription: 'Moonlit water and drifting light across six reels.',
    description: 'A calm sea under a thin moon, lit from below by drifting light. Wins wash away and new symbols fall into their place.\n\nCascades keep a session moving without rushing it — each chain a little brighter than the last.',
    order: 2,
    artwork: { thumbnail: '/demo/games/mystic-tides.jpg', hero: '/demo/games/mystic-tides-hero.jpg', heroMobile: '/demo/games/mystic-tides.jpg' },
    game: launch,
    info: { reels: 6, rows: 4, ways: 4096, features: ['Cascades'] },
  },
  {
    ...base,
    id: 'temple-of-valor',
    slug: 'temple-of-valor',
    title: 'Temple of Valor',
    shortDescription: 'An old temple lit from within, holding its prizes in place.',
    description: 'An old temple on a dark hill, lit from within. Prize symbols that land stay where they are while the rest of the reels turn.\n\nHold & win builds slowly and visibly, so the moment the last position fills feels earned.',
    order: 3,
    artwork: { thumbnail: '/demo/games/temple-of-valor.jpg', hero: '/demo/games/temple-of-valor-hero.jpg', heroMobile: '/demo/games/temple-of-valor.jpg' },
    game: launch,
    info: { reels: 5, rows: 3, paylines: 20, features: ['Hold & win'] },
  },
];
