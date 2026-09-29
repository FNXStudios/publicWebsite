import type { CSSProperties } from 'react';
import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { CATEGORY_LABELS, gameArtAlt, gameCardFacts } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ArrowRight } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TrackedLink } from '@/components/ui/TrackedLink';

/**
 * The portfolio's lead title: a wide, cinematic card with the game's own light.
 * One link, keyboard operable; the "View game" affordance is presentational.
 */
export function GameFeature({ game, headingLevel = 'h2', priority = false }: { game: Game; headingLevel?: 'h2' | 'h3'; priority?: boolean }) {
  const Heading = headingLevel;
  const facts = gameCardFacts(game);
  const style = game.theme ? ({ '--game-glow': game.theme.glow, '--game-deep': game.theme.deep } as CSSProperties) : undefined;
  return (
    <article className="group relative" style={style}>
      <TrackedLink
        href={routes.game(game.slug)}
        event={{ name: 'game_card_clicked', props: { slug: game.slug, placement: 'games' } }}
        className="block rounded-xl focus-visible:outline-offset-4"
      >
        <div
          className={cn(
            'relative isolate aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.09] bg-raised sm:aspect-[16/10] md:aspect-[21/10]',
            'transition-[border-color,box-shadow] duration-[280ms] ease-premium',
            'group-hover:border-white/[0.16] group-hover:shadow-soft',
          )}
        >
          <ResponsiveArt
            src={game.artwork.hero}
            mobileSrc={game.artwork.heroMobile ?? game.artwork.thumbnail}
            mobileMaxWidth={639}
            alt={gameArtAlt(game)}
            priority={priority}
            quality={80}
            sizes="(max-width: 1600px) 100vw, 1480px"
            objectPosition={game.artwork.objectPosition ?? '70% 50%'}
            imgClassName="transition-transform duration-[320ms] ease-premium group-hover:scale-[1.025]"
          />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--game-deep,#050607)_0%,rgb(5_6_7/0.82)_24%,rgb(5_6_7/0.25)_52%,transparent_70%)] sm:block" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[rgb(4_5_7/0.95)] to-transparent sm:h-1/2 sm:from-[rgb(4_5_7/0.6)]" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 sm:inset-y-0 sm:right-auto sm:w-[52%] sm:justify-end sm:p-10 md:w-[44%] md:p-14">
            <p className="flex items-center gap-3 text-eyebrow text-white/70 uppercase">
              <span aria-hidden="true" className="h-px w-5 bg-[var(--game-glow,var(--fnx-violet-400))]" />
              {CATEGORY_LABELS[game.category]}
              {game.status === 'coming-soon' && !game.isDemo ? ' · Coming soon' : ''}
            </p>
            <Heading className="mt-4 text-display text-white">{game.title}</Heading>
            <p className="mt-4 max-w-[28rem] text-body text-white/75">{game.shortDescription}</p>
            <p className="mt-5 flex flex-wrap gap-2">
              {facts.map((fact) => (
                <span key={fact} className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[0.8125rem] font-medium text-white/85 backdrop-blur-[2px]">
                  {fact}
                </span>
              ))}
            </p>
            <span aria-hidden="true" className="mt-8 inline-flex items-center gap-2.5 self-start text-[0.9375rem] font-semibold text-white">
              <span className="relative pb-1">
                View game
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-50 bg-current transition-transform duration-(--duration-standard) ease-premium group-hover:scale-x-100" />
              </span>
              <ArrowRight className="arrow-nudge size-4 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </TrackedLink>
    </article>
  );
}
