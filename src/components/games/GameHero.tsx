import Link from 'next/link';
import type { Game } from '@/config/schema/game.schema';
import { CATEGORY_LABELS, gameArtAlt, gameCardFacts, isPlayable } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowLeft } from '@/components/ui/Icons';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';

/**
 * Game detail hero. The frame is the art contract (2:1 from large desktop,
 * 4:5 on phones). Copy overlays the left safe zone from the md breakpoint up,
 * and stacks under the image on smaller screens.
 */
export function GameHero({ game }: { game: Game }) {
  const facts = gameCardFacts(game);
  return (
    <section aria-labelledby="game-title" className="relative bg-(--game-deep)">
      <div className="md:relative">
        <MediaFrame slot="gameHero" className="rounded-none border-0 sm:rounded-none">
          <div className="enter-settle absolute inset-0">
            <ResponsiveArt
              src={game.artwork.hero}
              mobileSrc={game.artwork.heroMobile}
              mobileMaxWidth={767}
              alt={gameArtAlt(game)}
              priority
              quality={80}
              sizes="100vw"
              objectPosition={game.artwork.objectPosition ?? '68% 46%'}
            />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[rgb(4_5_7/0.72)] to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--game-deep)_0%,color-mix(in_srgb,var(--game-deep)_78%,transparent)_34%,transparent_58%)] md:block" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-(--game-deep) to-transparent md:h-1/3" />
        </MediaFrame>

        <div className="container-wide pt-8 pb-12 md:absolute md:inset-0 md:flex md:flex-col md:justify-end md:pt-(--header-height) md:pb-14">
          <div className="md:max-w-[40%]">
          <Link href={routes.games} className="group/back inline-flex items-center gap-2 rounded-sm py-2 text-small font-medium text-text-secondary transition-colors hover:text-white md:text-white/70">
            <ArrowLeft className="arrow-nudge size-4 group-hover/back:-translate-x-1" />
            All games
          </Link>
          <p className="mt-5 flex items-center gap-3 text-eyebrow text-text-secondary uppercase md:text-white/70">
            <span aria-hidden="true" className="h-px w-6 bg-(--game-accent)" />
            {CATEGORY_LABELS[game.category]}
            {game.status === 'coming-soon' && !game.isDemo ? <span className="text-(--game-accent)"> · Coming soon</span> : null}
          </p>
          <h1 id="game-title" className="mt-3 text-hero text-white">
            {game.title}
          </h1>
          <p className="mt-4 max-w-[34rem] text-lead text-text-secondary md:text-white/80">{game.shortDescription}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="At a glance">
            {facts.map((fact) => (
              <li key={fact} className="rounded-sm border border-white/15 bg-black/30 px-3 py-1.5 text-[0.8125rem] font-medium text-white/90">
                {fact}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            {isPlayable(game) ? (
              <ButtonLink href={routes.play(game.slug)} size="md" arrow>
                Play Game
              </ButtonLink>
            ) : (
              <>
                <span className="inline-flex h-11 items-center rounded-md border border-white/15 px-5 text-body font-semibold text-text-secondary md:text-white/80">
                  {game.isDemo ? 'In development' : 'Coming soon'}
                </span>
                <ContactTrigger appearance="link" placement={`game-${game.slug}`} interest="original-content">
                  Ask us about this title
                </ContactTrigger>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
