/** The only place route strings are assembled. */
export const routes = {
  home: '/',
  games: '/games',
  game: (slug: string) => `/games/${slug}`,
  play: (slug: string) => `/games/${slug}/play`,
  studio: '/studio',
  careers: '/careers',
  contact: '/contact',
  contactAbout: (interest: string) => `/contact?interest=${encodeURIComponent(interest)}`,
  contactApi: '/api/contact',
} as const;
