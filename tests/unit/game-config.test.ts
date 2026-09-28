import { describe, expect, it } from 'vitest';
import { gameCollectionSchema, gameSchema, type GameInput } from '@/config/schema/game.schema';
import { parseConfig } from '@/config/schema/parse';
import { games } from '@/config/games.config';
import { jobs } from '@/config/careers.config';
import { fixtureGames } from '../fixtures/games.fixture';

const base = (): GameInput => structuredClone(fixtureGames[0]!);

describe('game configuration schema', () => {
  it('accepts the shipped configuration and the test fixtures', () => {
    expect(Array.isArray(games)).toBe(true);
    expect(Array.isArray(jobs)).toBe(true);
    expect(gameCollectionSchema.safeParse(fixtureGames).success).toBe(true);
  });

  it('rejects unknown volatility values', () => {
    const game = base();
    (game.info as Record<string, unknown>).volatility = 'extreme';
    expect(gameSchema.safeParse(game).success).toBe(false);
  });

  it('rejects unknown keys instead of silently ignoring them', () => {
    const game = { ...base(), rating: 5 };
    expect(gameSchema.safeParse(game).success).toBe(false);
  });

  it('requires a launch target for available games', () => {
    const game = base();
    game.game = { orientation: 'landscape' };
    const result = gameSchema.safeParse(game);
    expect(result.success).toBe(false);
  });

  it('rejects both launchPath and launchUrl together', () => {
    const game = base();
    game.game = { ...game.game, launchUrl: 'https://games.fnxstudio.com/x/' };
    expect(gameSchema.safeParse(game).success).toBe(false);
  });

  it('rejects plain http and remote-hosted artwork', () => {
    const httpLaunch = base();
    httpLaunch.game = { orientation: 'landscape', launchUrl: 'http://games.fnxstudio.com/x/' };
    delete httpLaunch.game.launchPath;
    expect(gameSchema.safeParse(httpLaunch).success).toBe(false);

    const remoteArt = base();
    remoteArt.artwork.thumbnail = 'https://cdn.example.com/a.jpg';
    expect(gameSchema.safeParse(remoteArt).success).toBe(false);
  });

  it('forbids featuring a hidden game', () => {
    const game = { ...base(), status: 'hidden' as const, featured: true };
    expect(gameSchema.safeParse(game).success).toBe(false);
  });

  it('rejects duplicate slugs across the collection', () => {
    const a = base();
    const b = { ...base(), id: 'another-id' };
    expect(gameCollectionSchema.safeParse([a, b]).success).toBe(false);
  });

  it('throws a readable error through parseConfig', () => {
    expect(() => parseConfig('games', gameCollectionSchema, [{ id: 'x' }])).toThrow(/Invalid games configuration/);
  });
});
