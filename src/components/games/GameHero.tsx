import type { Game } from '@/config/schema/game.schema';
import { CATEGORY_LABELS, gameArtAlt, isPlayable } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowLeft } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import Link from 'next/link';

export function GameHero({ game }: { game: Game }) {
  return (
    <section aria-labelledby="game-title" className="relative isolate">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] md:aspect-auto md:h-[clamp(34rem,78svh,50rem)]">
        <ResponsiveArt
          src={game.artwork.hero}
          mobileSrc={game.artwork.heroMobile}
          mobileMaxWidth={639}
          alt={gameArtAlt(game)}
          priority
          quality={80}
          sizes="100vw"
          className="enter-settle"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgb(6_7_8/0.75),transparent)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,var(--color-bg)_8%,rgb(6_7_8/0.6)_45%,transparent)]" />
      </div>

      <div className="container-fnx relative -mt-32 sm:-mt-48 md:-mt-64">
        <Link
          href={routes.games}
          className="group/back enter-rise inline-flex items-center gap-2 py-2 text-small font-medium text-text-secondary transition-colors hover:text-text"
        >
          <ArrowLeft className="arrow-nudge size-4 group-hover/back:-translate-x-1" />
          All games
        </Link>
        <p className="enter-rise mt-6 text-eyebrow uppercase text-text-muted [--enter-step:1]">
          {CATEGORY_LABELS[game.category]}
          {game.status === 'coming-soon' ? <span className="text-accent-text"> · Coming soon</span> : null}
        </p>
        <h1 id="game-title" className="enter-rise mt-4 max-w-[16ch] text-display-xl text-text [--enter-step:2]">
          {game.title}
        </h1>
        <p className="enter-rise mt-6 max-w-[36rem] text-lead text-text-secondary [--enter-step:3]">
          {game.shortDescription}
        </p>
        {isPlayable(game) ? (
          <div className="enter-rise mt-10 [--enter-step:4]">
            <ButtonLink href={routes.play(game.slug)} size="lg" arrow>
              Play game
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
