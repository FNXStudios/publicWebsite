/**
 * The only place route strings are assembled. Top-level pages are fixed: /, /games,
 * /studio, /careers. Contact is a global dialog (see ContactProvider), not a page.
 */
export const routes = {
  home: '/',
  games: '/games',
  game: (slug: string) => `/games/${slug}`,
  play: (slug: string) => `/games/${slug}/play`,
  studio: '/studio',
  careers: '/careers',
  contactApi: '/api/contact',
} as const;
