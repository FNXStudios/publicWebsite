import type { MetadataRoute } from 'next';
import { getVisibleGames } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { absoluteUrl } from '@/lib/site-url';

/** Indexable routes only: hidden games and play routes are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [routes.home, routes.games, routes.studio, routes.careers, routes.contact];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...getVisibleGames().map((game) => ({ url: absoluteUrl(routes.game(game.slug)) })),
  ];
}
