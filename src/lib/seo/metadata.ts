import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';
import type { Game } from '@/config/schema/game.schema';
import { routes } from '@/lib/routes';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

interface PageMetadataInput {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

/** Consistent metadata for every route: canonical URL, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, image, noIndex }: PageMetadataInput): Metadata {
  const resolvedDescription = description ?? siteConfig.description;
  const ogImage = image ?? siteConfig.defaultOgImage;
  return {
    ...(title ? { title } : {}),
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title: title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.descriptor}`,
      description: resolvedDescription,
      images: [{ url: ogImage }],
    },
    twitter: { card: 'summary_large_image' },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function gameMetadata(game: Game): Metadata {
  return pageMetadata({
    title: game.seo.title ?? game.title,
    description: game.seo.description ?? game.shortDescription,
    path: routes.game(game.slug),
    image: game.seo.image ?? game.artwork.hero,
  });
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl().origin,
    logo: absoluteUrl('/icon.svg'),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    ...(siteConfig.social.length ? { sameAs: siteConfig.social.map((s) => s.href) } : {}),
  };
}

/** VideoGame schema with only the facts FNX configured — no ratings or reviews. */
export function gameJsonLd(game: Game) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.shortDescription,
    url: absoluteUrl(routes.game(game.slug)),
    image: absoluteUrl(game.artwork.hero),
    genre: game.category === 'slot' ? 'Slot game' : 'Instant game',
    gamePlatform: 'Web browser',
    applicationCategory: 'Game',
    publisher: { '@type': 'Organization', name: siteConfig.name, url: getSiteUrl().origin },
  };
}

/** Serialises JSON-LD safely for inline <script> injection. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
