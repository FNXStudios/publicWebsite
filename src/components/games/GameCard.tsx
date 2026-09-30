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
  /**
   * Frame shape. `landscape` uses the wide hero art.
   * `catalogue` is the Games index: 4:5 on phones, 4:3 from 768px, a shallow ~1.12 crop from 1200px.
   */
  ratio?: 'portrait' | 'feature' | 'landscape' | 'catalogue';
  sizes: string;
  /** Above-the-fold cards load eagerly. */
  priority?: boolean;
  className?: string;
}

/** Fixture markers are a development aid only — shown only with an explicit debug flag. */
const SHOW_FIXTURE_MARKER = process.env.NEXT_PUBLIC_SHOW_FIXTURE_LABELS === 'true';

const RATIO = {
  portrait: 'aspect-[4/5]',
  feature: 'aspect-[4/5]',
  landscape: 'aspect-[16/10]',
  /** Width / height. Bottom ~quarter stays clear for the title lockup. */
  catalogue: 'aspect-[4/5] min-[48rem]:aspect-[4/3] lg:aspect-[1.12/1]',
} as const;

/**
 * Canonical FNX game thumbnail. Full-bleed art, compact title overlay, one link.
 * Same style on the homepage rail and the /games grid.
 */
export function GameCard({ game, placement, headingLevel = 'h3', ratio = 'portrait', sizes, priority = false, className }: GameCardProps) {
  const Heading = headingLevel;
  const facts = gameCardFacts(game);
  const status = game.status === 'coming-soon' && !game.isDemo ? 'Coming soon' : null;
  const landscape = ratio === 'landscape';
  const shown = facts.slice(0, 2);

  return (
    <article className={cn('group relative', className)}>
      <TrackedLink
        href={routes.game(game.slug)}
        event={{ name: 'game_card_clicked', props: { slug: game.slug, placement } }}
        className="block rounded-lg focus-visible:outline-offset-4"
      >
        <div
          className={cn(
            'relative isolate overflow-hidden rounded-lg border border-white/[0.09] bg-raised',
            'lg:transition-[border-color] lg:duration-[280ms] lg:ease-premium',
            'lg:group-hover:border-white/[0.2]',
            'group-focus-within:border-white/[0.2]',
            RATIO[ratio],
          )}
        >
          <ResponsiveArt
            src={landscape ? game.artwork.hero : game.artwork.thumbnail}
            mobileSrc={landscape ? game.artwork.thumbnail : game.artwork.thumbnailMobile}
            alt={gameArtAlt(game)}
            sizes={sizes}
            priority={priority}
            objectPosition={game.artwork.objectPosition}
            imgClassName="lg:transition-transform lg:duration-[280ms] lg:ease-premium lg:group-hover:scale-[1.02] lg:group-focus-within:scale-[1.02] motion-reduce:lg:group-hover:scale-100 motion-reduce:lg:group-focus-within:scale-100"
          />
          {/* Title lockup sits in the bottom quarter. Gate 2 key art should keep focal detail above it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,transparent_0%,rgb(4_5_7/0.14)_30%,rgb(4_5_7/0.62)_62%,rgb(4_5_7/0.9)_100%)]"
          />

          {status ? (
            <span className="absolute top-2 left-2 rounded-sm border border-white/15 bg-black/45 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-[0.14em] text-text uppercase backdrop-blur-[3px]">
              {status}
            </span>
          ) : null}
          {game.isDemo && SHOW_FIXTURE_MARKER ? (
            <span title="Visual fixture (debug flag on)" className="absolute top-2 right-2 rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[0.625rem] text-text-muted">
              fixture
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-2.5 min-[48rem]:p-3.5">
            <div className="min-w-0 flex-1">
              <Heading className="text-[0.875rem] leading-[1.25] font-semibold tracking-[-0.015em] text-balance text-white min-[48rem]:text-[0.9375rem] lg:text-base">
                {game.title}
              </Heading>
              {shown.length ? (
                <p className="mt-0.5 text-[0.75rem] leading-snug text-white/70">
                  {shown.map((fact, index) => (
                    <span key={fact}>
                      {index > 0 ? <span aria-hidden="true"> · </span> : null}
                      {fact}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            <ArrowRight
              aria-hidden="true"
              className="arrow-nudge size-3.5 shrink-0 text-white/80 lg:size-4 lg:group-hover:translate-x-1 lg:group-hover:text-white motion-reduce:lg:group-hover:translate-x-0"
            />
          </div>
        </div>
      </TrackedLink>
    </article>
  );
}
