/**
 * TEST FIXTURES — not FNX games.
 *
 * The E2E build (FNX_E2E_FIXTURES=1) aliases `@/config/games.config` to this file
 * so routing, the player and state handling can be exercised while the real
 * catalogue is empty. These titles never ship: the production build does not
 * include the alias. Artwork reuses existing studio art.
 */
import { gameCollectionSchema, type GameInput } from '../../src/config/schema/game.schema';
import { parseConfig } from '../../src/config/schema/parse';

export { gamesPageContent } from '../../src/config/games.config';

export const fixtureGames: GameInput[] = [
  {
    id: 'lantern-quarter',
    slug: 'lantern-quarter',
    title: 'Lantern Quarter',
    shortDescription: 'Fixture slot with every optional field populated.',
    description: 'First paragraph of the fixture description.\n\nSecond paragraph of the fixture description.',
    status: 'available',
    category: 'slot',
    featured: true,
    order: 1,
    artwork: {
      thumbnail: '/art/hero-mobile.png',
      hero: '/art/hero.png',
      heroMobile: '/art/hero-mobile.png',
      screenshots: ['/visual-fixtures/games/temple-of-valor.jpg', '/visual-fixtures/games/temple-of-valor-hero.jpg'],
    },
    game: { launchPath: '/lantern-quarter/index.html', orientation: 'landscape', aspectRatio: '16/9', readySignal: true },
    info: {
      volatility: 'high',
      reels: 5,
      rows: 3,
      ways: 243,
      rtp: 96.2,
      maxWin: '5,000x',
      mechanics: ['Cascading reels', 'Multiplier trail'],
      features: ['Free spins', 'Buy feature'],
    },
    seo: {},
  },
  {
    id: 'tide-runner',
    slug: 'tide-runner',
    title: 'Tide Runner',
    shortDescription: 'Fixture instant game with minimal information.',
    status: 'available',
    category: 'instant',
    featured: true,
    order: 2,
    artwork: { thumbnail: '/visual-fixtures/games/temple-of-valor.jpg', hero: '/visual-fixtures/games/temple-of-valor-hero.jpg' },
    game: { launchPath: '/tide-runner/', orientation: 'responsive' },
    info: {},
    seo: {},
  },
  {
    id: 'ember-crown',
    slug: 'ember-crown',
    title: 'Ember Crown',
    shortDescription: 'Fixture coming-soon slot.',
    status: 'coming-soon',
    category: 'slot',
    featured: true,
    order: 3,
    artwork: { thumbnail: '/visual-fixtures/games/temple-of-valor-hero.jpg', hero: '/visual-fixtures/games/temple-of-valor.jpg' },
    game: { orientation: 'portrait' },
    info: { volatility: 'medium' },
    seo: {},
  },
  {
    id: 'hidden-vault',
    slug: 'hidden-vault',
    title: 'Hidden Vault',
    shortDescription: 'Fixture hidden game — must never render.',
    status: 'hidden',
    category: 'slot',
    featured: false,
    order: 0,
    artwork: { thumbnail: '/art/hero.png', hero: '/art/hero.png' },
    game: { launchPath: '/hidden-vault/', orientation: 'landscape' },
    info: {},
    seo: {},
  },
];

export const games = parseConfig('fixture games', gameCollectionSchema, fixtureGames);
