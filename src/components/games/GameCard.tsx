import type { CSSProperties } from 'react';
import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { gameArtAlt, gameCardFacts } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ArrowRight } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TrackedLink } from '@/components/ui/TrackedLink';

interface GameCardProps {
  game: Game;
  placement: 'home' | 'games';
  headingLevel?: 'h2' | 'h3';
  /** Frame shape. `landscape` uses the wide hero art. */
  ratio?: 'portrait' | 'feature' | 'landscape';
  sizes: string;
  /** Above-the-fold cards load eagerly. */
  priority?: boolean;
  className?: string;
}

/** Fixture markers are a development aid only — shown only with an explicit debug flag. */
const SHOW_FIXTURE_MARKER = process.env.NEXT_PUBLIC_SHOW_FIXTURE_LABELS === 'true';

const RATIO = {
  portrait: 'aspect-[4/5]',
  feature: 'aspect-[4/5] md:aspect-[16/15]',
  landscape: 'aspect-[16/10]',
} as const;

/**
 * The canonical FNX game card. Full-bleed artwork is the reward: bright, saturated,
 * never toned down. A deep gradient carries it into the title, a quiet metadata row
 * and a circular action. The whole card is one link, fully keyboard operable.
 * Hover: lift 5px, art 1 → 1.035, overlay lifts, border warms to violet, arrow leans.
 */
export function GameCard({ game, placement, headingLevel = 'h3', ratio = 'portrait', sizes, priority = false, className }: GameCardProps) {
  const Heading = headingLevel;
  const facts = gameCardFacts(game);
  const status = game.status === 'coming-soon' && !game.isDemo ? 'Coming soon' : null;
  const landscape = ratio === 'landscape';
  // The game's own light, used for a hint of coloured shadow on hover.
  const style = game.theme ? ({ '--game-glow': game.theme.glow } as CSSProperties) : undefined;

  return (
    <article className={cn('group relative', className)} style={style}>
      <TrackedLink
        href={routes.game(game.slug)}
        event={{ name: 'game_card_clicked', props: { slug: game.slug, placement } }}
        className="block rounded-lg focus-visible:outline-offset-4"
      >
        <div
          className={cn(
            'relative isolate overflow-hidden rounded-lg border border-white/[0.08] bg-raised',
            'transition-[transform,border-color,box-shadow] duration-(--duration-standard) ease-premium',
            'group-hover:-translate-y-[5px] group-hover:border-violet-border group-hover:shadow-card-hover',
            'group-focus-within:-translate-y-[5px] group-focus-within:border-violet-border',
            'group-active:-translate-y-0.5 group-active:duration-(--duration-micro)',
            RATIO[ratio],
          )}
        >
          <ResponsiveArt
            src={landscape ? game.artwork.hero : game.artwork.thumbnail}
            mobileSrc={landscape ? game.artwork.thumbnail : game.artwork.thumbnailMobile}
            alt={gameArtAlt(game)}
            sizes={sizes}
            priority={priority}
            imgClassName="transition-transform duration-[520ms] ease-premium group-hover:scale-[1.035] group-focus-within:scale-[1.035]"
          />
          {/* Coloured light from the game itself, rising on hover. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_80%_at_50%_100%,var(--game-glow,transparent),transparent)] opacity-0 mix-blend-screen transition-opacity duration-(--duration-standard) group-hover:opacity-25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[64%] bg-[linear-gradient(180deg,transparent,rgb(4_5_7/0.25)_38%,rgb(4_5_7/0.94))] transition-opacity duration-(--duration-standard) ease-premium group-hover:opacity-85"
          />
          <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          {status ? (
            <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-text uppercase backdrop-blur-[3px]">
              {status}
            </span>
          ) : null}
          {game.isDemo && SHOW_FIXTURE_MARKER ? (
            <span title="Visual fixture (debug flag on)" className="absolute top-3 right-3 rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[0.625rem] text-text-muted">
              fixture
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
            <div className="min-w-0">
              <Heading className="text-[clamp(1.25rem,1.1rem+0.45vw,1.5rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-white">{game.title}</Heading>
              <p className="mt-2 flex flex-wrap items-center text-[0.8125rem] leading-5 text-white/70 sm:text-[0.875rem]">
                {facts.map((fact, index) => (
                  <span key={fact} className={cn('inline-flex items-center whitespace-nowrap', index > 1 && 'hidden sm:inline-flex')}>
                    {index > 0 ? (
                      <>
                        <span className="sr-only">, </span>
                        <span aria-hidden="true" className="mx-2 size-[3px] rounded-full bg-white/40" />
                      </>
                    ) : null}
                    {fact}
                  </span>
                ))}
              </p>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                'grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-[3px]',
                'transition-[border-color,background-color] duration-(--duration-interaction) ease-premium',
                'group-hover:border-violet-300/70 group-hover:bg-violet-600/30',
              )}
            >
              <ArrowRight className="arrow-nudge size-[1.0625rem] group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </TrackedLink>
    </article>
  );
}
