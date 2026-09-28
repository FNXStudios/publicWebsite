import { describe, expect, it } from 'vitest';
import { gameCollectionSchema } from '@/config/schema/game.schema';
import { createGameCatalog } from '@/lib/games/catalog';
import { getGameFacts } from '@/lib/games/info';
import { VOLATILITY } from '@/lib/games/volatility';
import { fixtureGames } from '../fixtures/games.fixture';

const games = gameCollectionSchema.parse(fixtureGames);
const catalog = createGameCatalog(games);

describe('game catalog', () => {
  it('never exposes hidden games', () => {
    expect(catalog.visible().map((g) => g.slug)).not.toContain('hidden-vault');
    expect(catalog.bySlug('hidden-vault')).toBeUndefined();
  });

  it('returns undefined for unknown slugs', () => {
    expect(catalog.bySlug('does-not-exist')).toBeUndefined();
  });

  it('orders featured games by `order` and respects the limit', () => {
    expect(catalog.featured(3).map((g) => g.slug)).toEqual(['lantern-quarter', 'tide-runner', 'ember-crown']);
    expect(catalog.featured(1)).toHaveLength(1);
    expect(catalog.featured(0)).toHaveLength(0);
  });

  it('sorts by title when order ties', () => {
    const tied = gameCollectionSchema.parse(
      fixtureGames.slice(0, 2).map((g) => ({ ...g, order: 1 })),
    );
    expect(createGameCatalog(tied).visible().map((g) => g.title)).toEqual(['Lantern Quarter', 'Tide Runner']);
  });
});

describe('volatility mapping', () => {
  it('maps every level onto a 1–5 scale', () => {
    expect(Object.fromEntries(Object.entries(VOLATILITY).map(([k, v]) => [k, v.level]))).toEqual({
      low: 1,
      medium: 2,
      'medium-high': 3,
      high: 4,
      'very-high': 5,
    });
  });
});

describe('game facts', () => {
  it('formats configured facts', () => {
    const facts = getGameFacts(catalog.bySlug('lantern-quarter')!);
    expect(facts).toEqual([
      { key: 'layout', label: 'Layout', value: '5 × 3' },
      { key: 'ways', label: 'Ways to win', value: '243' },
      { key: 'rtp', label: 'RTP', value: '96.2%' },
      { key: 'maxWin', label: 'Max win', value: '5,000x' },
    ]);
  });

  it('omits everything that is not configured — no N/A placeholders', () => {
    expect(getGameFacts(catalog.bySlug('tide-runner')!)).toEqual([]);
  });
});
