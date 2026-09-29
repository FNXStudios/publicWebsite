import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { getDisplayGameBySlug, getDisplayGames, isPlayable } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { gameJsonLd, gameMetadata, jsonLdScript } from '@/lib/seo/metadata';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { GameHero } from '@/components/games/GameHero';
import { GameInfo } from '@/components/games/GameInfo';
import { GameRail } from '@/components/games/GameShowcase';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TextLink } from '@/components/ui/TextLink';
import { TrackOnMount } from '@/components/ui/TrackOnMount';
import { Eyebrow } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

export const dynamicParams = false;

export function generateStaticParams() {
  return getDisplayGames().map((game) => ({ slug: game.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getDisplayGameBySlug((await params).slug);
  if (!game) return {};
  const metadata = gameMetadata(game);
  // Visual fixtures are never indexed.
  return game.isDemo ? { ...metadata, robots: { index: false, follow: false } } : metadata;
}

/** Neutral fallback when a game has no theme: FNX graphite with a violet signature. */
const NEUTRAL = { accent: '#b99bff', glow: '#7134f4', deep: '#07090c' };

export default async function GamePage({ params }: Props) {
  const game = getDisplayGameBySlug((await params).slug);
  if (!game) notFound();

  const theme = game.theme ?? NEUTRAL;
  // The game's colours flow into every section of its page (CSS variables, from config).
  const style = { '--game-accent': theme.accent, '--game-glow': theme.glow, '--game-deep': theme.deep } as CSSProperties;
  const screenshots = game.artwork.screenshots ?? [];
  const related = getDisplayGames().filter((g) => g.id !== game.id).slice(0, 3);

  return (
    <div style={style} className="bg-[linear-gradient(180deg,var(--game-deep)_0%,var(--game-deep)_50rem,var(--depth-page)_100%)]">
      {game.isDemo ? null : <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(gameJsonLd(game)) }} />}
      <TrackOnMount event={{ name: 'game_detail_viewed', props: { slug: game.slug } }} />
      <GameHero game={game} />
      <GameInfo game={game} />

      {screenshots.length ? (
        <section aria-labelledby="screens-title" className="container-fnx pb-medium">
          <Eyebrow rule id="screens-title" className="[&>span]:bg-(--game-accent)">
            In game
          </Eyebrow>
          <ul className="mt-7 grid gap-4 md:grid-cols-12 md:gap-6">
            {screenshots.map((src, index) => (
              <Reveal
                as="li"
                key={src}
                delay={index * 60}
                className={index === 0 && screenshots.length % 2 === 1 ? 'md:col-span-12' : 'md:col-span-6'}
              >
                <figure className="group relative aspect-[16/9] overflow-hidden rounded-lg border border-white/[0.08] bg-raised">
                  <Image
                    src={src}
                    alt={`${game.title} — in-game screen ${index + 1}`}
                    fill
                    quality={80}
                    sizes="(max-width: 899px) 100vw, 680px"
                    className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.02]"
                  />
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Additional art: the portrait key art with the game's light around it. */}
      {game.artwork.thumbnail !== game.artwork.hero ? (
        <section aria-labelledby="art-title" className="container-fnx pb-medium">
          <div className="grid items-center gap-10 overflow-hidden rounded-xl border border-white/[0.08] bg-[radial-gradient(60%_80%_at_20%_50%,color-mix(in_srgb,var(--game-glow)_22%,transparent),transparent_70%)] p-4 md:grid-cols-12 md:gap-6 md:p-6">
            <Reveal as="figure" className="relative aspect-[4/5] overflow-hidden rounded-lg md:col-span-5">
              <ResponsiveArt src={game.artwork.thumbnail} alt={`${game.title} — key art`} sizes="(max-width: 899px) 100vw, 560px" quality={80} />
            </Reveal>
            <div className="px-2 pb-6 md:col-span-6 md:col-start-7 md:px-0 md:pb-0">
              <Eyebrow rule id="art-title" className="[&>span]:bg-(--game-accent)">
                Key art
              </Eyebrow>
              <p className="mt-6 text-display-sm text-white">A world you recognise at a glance.</p>
              <p className="mt-5 max-w-[30rem] text-body text-text-secondary">
                Every FNX title is built around its own light, palette and symbols — so it reads at thumbnail size in a lobby and rewards the player at full screen.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                {isPlayable(game) ? (
                  <ButtonLink href={routes.play(game.slug)} size="lg" arrow>
                    Play Game
                  </ButtonLink>
                ) : (
                  <ContactTrigger variant="secondary" size="lg" placement={`game-${game.slug}-art`} interest="original-content">
                    Ask us about this title
                  </ContactTrigger>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section aria-labelledby="related-title" className="container-fnx pt-medium pb-large">
          <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
            <h2 id="related-title" className="text-display-sm text-white">
              More original worlds
            </h2>
            <TextLink href={routes.games} className="hidden shrink-0 sm:inline-flex">
              All games
            </TextLink>
          </div>
          <GameRail games={related} placement="games" headingLevel="h3" ratio="landscape" />
        </section>
      ) : null}
    </div>
  );
}
