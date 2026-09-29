import { describe, expect, it } from 'vitest';
import { gameSchema } from '@/config/schema/game.schema';
import { readGameFrameMessage } from '@/lib/games/messages';
import { gameJsonLd, gameMetadata, jsonLdScript } from '@/lib/seo/metadata';
import { fixtureGames } from '../fixtures/games.fixture';

const lantern = gameSchema.parse(fixtureGames[0]);

describe('SEO helpers', () => {
  it('derives game metadata from GameConfig', () => {
    const meta = gameMetadata(lantern);
    expect(meta.title).toBe('Lantern Quarter');
    expect(meta.description).toBe(lantern.shortDescription);
    expect(meta.alternates?.canonical).toBe('/games/lantern-quarter');
  });

  it('never emits ratings or reviews in structured data', () => {
    const json = JSON.stringify(gameJsonLd(lantern));
    expect(json).not.toMatch(/aggregateRating|review/i);
    expect(gameJsonLd(lantern).url).toBe('https://www.fnx-studios.com/games/lantern-quarter');
  });

  it('escapes "<" in inline JSON-LD', () => {
    expect(jsonLdScript({ a: '</script>' })).not.toContain('</script>');
  });
});

describe('game frame messages', () => {
  const source = {} as MessageEventSource;
  const origin = 'https://games.fnx-studios.com';

  it('accepts protocol messages from the expected origin and frame', () => {
    expect(readGameFrameMessage({ origin, source, data: { type: 'fnx:ready' } }, origin, source)).toEqual({
      type: 'fnx:ready',
    });
  });

  it('ignores other origins, other frames and unknown payloads', () => {
    expect(readGameFrameMessage({ origin: 'https://evil.example', source, data: { type: 'fnx:ready' } }, origin, source)).toBeNull();
    expect(readGameFrameMessage({ origin, source: {} as MessageEventSource, data: { type: 'fnx:ready' } }, origin, source)).toBeNull();
    expect(readGameFrameMessage({ origin, source, data: 'fnx:ready' }, origin, source)).toBeNull();
    expect(readGameFrameMessage({ origin, source, data: { type: 'fnx:navigate' } }, origin, source)).toBeNull();
  });
});
