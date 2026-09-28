import { describe, expect, it } from 'vitest';
import { gameSchema } from '@/config/schema/game.schema';
import { resolveGameLaunch } from '@/lib/games/launch';
import { getGameOrigins } from '@/lib/games/origins';
import { buildContentSecurityPolicy, buildPermissionsPolicy, buildSecurityHeaders } from '@/lib/security/headers';
import { fixtureGames } from '../fixtures/games.fixture';

const [lantern, tide, ember] = fixtureGames.map((g) => gameSchema.parse(g));
const env = (base?: string) => ({ NEXT_PUBLIC_GAME_BASE_URL: base });

describe('game origins', () => {
  it('requires a base URL', () => {
    expect(() => getGameOrigins(env(undefined))).toThrow(/NEXT_PUBLIC_GAME_BASE_URL/);
  });

  it('rejects plain http except for localhost', () => {
    expect(() => getGameOrigins(env('http://games.fnxstudio.com'))).toThrow(/https/);
    expect(getGameOrigins(env('http://localhost:4000')).baseUrl.origin).toBe('http://localhost:4000');
  });
});

describe('resolveGameLaunch', () => {
  const origins = getGameOrigins(env('https://games-staging.fnxstudio.com'));

  it('joins launchPath onto the environment origin', () => {
    expect(resolveGameLaunch(lantern!, origins)).toEqual({
      url: 'https://games-staging.fnxstudio.com/lantern-quarter/index.html',
      origin: 'https://games-staging.fnxstudio.com',
      policy: { kind: 'first-party', origin: 'https://games-staging.fnxstudio.com' },
    });
  });

  it('keeps a base path on the game origin', () => {
    const withPath = getGameOrigins(env('https://cdn.fnxstudio.com/builds/'));
    expect(resolveGameLaunch(tide!, withPath)?.url).toBe('https://cdn.fnxstudio.com/builds/tide-runner/');
  });

  it('returns null for games that cannot launch', () => {
    expect(resolveGameLaunch(ember!, origins)).toBeNull();
  });

  it('refuses absolute URLs on untrusted origins', () => {
    const rogue = gameSchema.parse({
      ...fixtureGames[0],
      game: { orientation: 'landscape', launchUrl: 'https://evil.example.com/game/' },
    });
    expect(() => resolveGameLaunch(rogue, origins)).toThrow(/untrusted origin/);
  });

  it('accepts absolute URLs on the first-party origin', () => {
    const absolute = gameSchema.parse({
      ...fixtureGames[0],
      game: { orientation: 'landscape', launchUrl: 'https://games-staging.fnxstudio.com/a/?lang=en' },
    });
    expect(resolveGameLaunch(absolute, origins)?.url).toBe('https://games-staging.fnxstudio.com/a/?lang=en');
  });
});

describe('security headers', () => {
  const e = env('https://games.fnxstudio.com');

  it('frames only the trusted game origin', () => {
    const csp = buildContentSecurityPolicy({ isDev: false, env: e });
    expect(csp).toContain('frame-src https://games.fnxstudio.com;');
    expect(csp).not.toMatch(/frame-src[^;]*\*/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain('unsafe-eval');
  });

  it('delegates only fullscreen and autoplay to the game origin', () => {
    const policy = buildPermissionsPolicy(e);
    expect(policy).toContain('camera=()');
    expect(policy).toContain('fullscreen=(self "https://games.fnxstudio.com")');
    expect(policy).toContain('autoplay=(self "https://games.fnxstudio.com")');
  });

  it('adds HSTS only when explicitly enabled in production', () => {
    const keys = (h: { key: string }[]) => h.map((x) => x.key);
    expect(keys(buildSecurityHeaders({ isDev: false, env: e }))).not.toContain('Strict-Transport-Security');
    expect(keys(buildSecurityHeaders({ isDev: false, env: { ...e, ENABLE_HSTS: 'true' } }))).toContain(
      'Strict-Transport-Security',
    );
  });
});
