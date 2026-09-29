import { describe, expect, it } from 'vitest';
import { isDemoContentEnabled } from '@/config/demo';
import { demoGames } from '@/content/visual-fixtures/games';
import { gameCollectionSchema } from '@/config/schema/game.schema';
import { resolveDisplayGames } from '@/lib/games/catalog';
import { FALLBACK_ART, resolveArtSrc } from '@/lib/art/resolve';
import { fixtureGames } from '../fixtures/games.fixture';

const demo = gameCollectionSchema.parse(demoGames);
const real = gameCollectionSchema.parse(fixtureGames);

describe('demo content switch', () => {
  it('follows the explicit flag, else defaults to development only', () => {
    expect(isDemoContentEnabled({ NEXT_PUBLIC_USE_DEMO_CONTENT: 'true' })).toBe(true);
    expect(isDemoContentEnabled({ NEXT_PUBLIC_USE_DEMO_CONTENT: 'false', NODE_ENV: 'development' })).toBe(false);
    expect(isDemoContentEnabled({ NODE_ENV: 'development' })).toBe(true);
    expect(isDemoContentEnabled({ NODE_ENV: 'production' })).toBe(false);
  });
});

describe('resolveDisplayGames', () => {
  it('shows demo fixtures only when enabled and nothing real exists', () => {
    expect(resolveDisplayGames([], demo, true)).toBe(demo);
    expect(resolveDisplayGames([], demo, false)).toEqual([]);
  });

  it('lets production games always win', () => {
    expect(resolveDisplayGames(real, demo, true)).toBe(real);
  });

  it('flags every fixture as demo and never as available', () => {
    expect(demo.length).toBeGreaterThanOrEqual(3);
    expect(demo.every((g) => g.isDemo && g.status !== 'available')).toBe(true);
  });
});

describe('resolveArtSrc', () => {
  it('keeps artwork that exists and falls back for artwork that does not', () => {
    expect(resolveArtSrc('/art/hero.png')).toBe('/art/hero.png');
    expect(resolveArtSrc('/art/does-not-exist.jpg')).toBe(FALLBACK_ART);
  });
});
