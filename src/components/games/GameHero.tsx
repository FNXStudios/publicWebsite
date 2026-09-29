import Link from 'next/link';
import type { Game } from '@/config/schema/game.schema';
import { CATEGORY_LABELS, gameArtAlt, gameCardFacts, isPlayable } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowLeft } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';

/**
 * Full-artwork hero inside the FNX frame. The game's own colours (theme.deep / glow)
 * carry the gradients here — FNX violet steps back to the primary action only.
 */
export function GameHero({ game }: { game: Game }) {
  const facts = gameCardFacts(game);
  return (
    <section aria-labelledby="game-title" className="relative isolate overflow-hidden bg-(--game-deep)">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] md:aspect-auto md:h-[clamp(38rem,86svh,54rem)]">
        <div className="enter-settle absolute inset-0">
          <ResponsiveArt src={game.artwork.hero} mobileSrc={game.artwork.heroMobile} mobileMaxWidth={639} alt={gameArtAlt(game)} priority quality={80} sizes="100vw" imgClassName="object-[60%_50%] md:object-[70%_50%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[rgb(4_5_7/0.75)] to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--game-deep)_0%,color-mix(in_srgb,var(--game-deep)_85%,transparent)_26%,transparent_58%)] md:block" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/4 bg-[linear-gradient(0deg,var(--game-deep)_6%,color-mix(in_srgb,var(--game-deep)_60%,transparent)_45%,transparent)]" />
      </div>

      <div className="container-fnx relative -mt-40 pb-14 sm:-mt-56 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:pb-20">
        <Link
          href={routes.games}
          className="group/back enter-rise inline-flex items-center gap-2 rounded-sm py-2 text-small font-medium text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="arrow-nudge size-4 group-hover/back:-translate-x-1" />
          All games
        </Link>
        <p className="enter-rise mt-6 flex items-center gap-3 text-eyebrow text-white/70 uppercase [--enter-step:1]">
          <span aria-hidden="true" className="h-px w-6 bg-(--game-accent)" />
          {CATEGORY_LABELS[game.category]}
          {game.status === 'coming-soon' && !game.isDemo ? <span className="text-(--game-accent)"> · Coming soon</span> : null}
        </p>
        <h1
          id="game-title"
          className="enter-rise mt-4 max-w-[14ch] bg-linear-to-b from-white from-40% to-(--game-accent) bg-clip-text pb-[0.12em] text-[clamp(3rem,1.6rem+5vw,6.25rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-transparent [--enter-step:2]"
        >
          {game.title}
        </h1>
        <p className="enter-rise mt-6 max-w-[34rem] text-lead text-white/80 [--enter-step:3]">{game.shortDescription}</p>
        <ul className="enter-rise mt-6 flex flex-wrap gap-2 [--enter-step:3]" aria-label="At a glance">
          {facts.map((fact) => (
            <li key={fact} className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white/90 backdrop-blur-[2px]">
              {fact}
            </li>
          ))}
        </ul>
        <div className="enter-rise mt-9 flex flex-wrap items-center gap-4 [--enter-step:4]">
          {isPlayable(game) ? (
            <ButtonLink href={routes.play(game.slug)} size="lg" arrow>
              Play Game
            </ButtonLink>
          ) : (
            <>
              <span className="inline-flex h-[3.25rem] items-center rounded-md border border-white/15 bg-black/25 px-5 text-body font-semibold text-white/80 backdrop-blur-[2px]">
                {game.isDemo ? 'In development' : 'Coming soon'}
              </span>
              <ContactTrigger appearance="link" placement={`game-${game.slug}`} interest="operator-partnership">
                Ask us about this title
              </ContactTrigger>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
