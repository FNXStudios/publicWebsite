import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getVisibleGames, isPlayable } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { gameJsonLd, gameMetadata, jsonLdScript } from '@/lib/seo/metadata';
import { GameHero } from '@/components/games/GameHero';
import { GameInfo } from '@/components/games/GameInfo';
import { ButtonLink } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { TrackOnMount } from '@/components/ui/TrackOnMount';
import { Reveal } from '@/motion/Reveal';

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleGames().map((game) => ({ slug: game.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGameBySlug((await params).slug);
  return game ? gameMetadata(game) : {};
}

export default async function GamePage({ params }: Props) {
  const game = getGameBySlug((await params).slug);
  if (!game) notFound();

  const screenshots = game.artwork.screenshots ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(gameJsonLd(game)) }} />
      <TrackOnMount event={{ name: 'game_detail_viewed', props: { slug: game.slug } }} />
      <GameHero game={game} />
      <GameInfo game={game} />

      {screenshots.length ? (
        <section aria-labelledby="screens-title" className="container-fnx pb-(--section-space)">
          <h2 id="screens-title" className="text-eyebrow uppercase text-text-muted">
            Screens
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6">
            {screenshots.map((src, index) => (
              <Reveal as="li" key={src} delay={index * 60}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border-subtle bg-surface">
                  <Image
                    src={src}
                    alt={`${game.title} — screen ${index + 1}`}
                    fill
                    quality={80}
                    sizes="(max-width: 639px) 100vw, (max-width: 1375px) 50vw, 680px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="game-cta-title" className="border-t border-border-subtle">
        <div className="container-fnx flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-28">
          <h2 id="game-cta-title" className="text-display-md text-text">
            {isPlayable(game) ? `Ready to play ${game.title}?` : `${game.title} is coming soon.`}
          </h2>
          {isPlayable(game) ? (
            <ButtonLink href={routes.play(game.slug)} size="lg" arrow className="self-start md:self-auto">
              Play game
            </ButtonLink>
          ) : (
            <TextLink
              href={routes.contactAbout('operator-partnership')}
              event={{ name: 'partner_cta_clicked', props: { placement: `game-${game.slug}` } }}
            >
              Ask us about this title
            </TextLink>
          )}
        </div>
      </section>
    </>
  );
}
