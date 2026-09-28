import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { CATEGORY_LABELS } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { TextLink } from '@/components/ui/TextLink';
import { VolatilityIndicator } from './VolatilityIndicator';
import { GameCard } from './GameCard';

interface GameShowcaseProps {
  games: Game[];
  placement: 'home' | 'games';
  headingLevel: 'h2' | 'h3';
}

/**
 * Lays out any number of games without inventing filler:
 * 1 → one wide feature, 2 → an offset pair, 3+ → a three-column portfolio.
 * On phones, 2+ games become a horizontal scroll-snap row.
 */
export function GameShowcase({ games, placement, headingLevel }: GameShowcaseProps) {
  const [first] = games;
  if (!first) return null;

  if (games.length === 1) {
    return <GameFeature game={first} placement={placement} headingLevel={headingLevel} />;
  }

  const pair = games.length === 2;
  return (
    <ul
      className={cn(
        // phones: horizontal rail that bleeds to the screen edge
        '-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none]',
        // wider: a real grid
        'sm:mx-0 sm:grid sm:gap-x-6 sm:gap-y-16 sm:overflow-visible sm:px-0 sm:pb-0',
        pair ? 'sm:grid-cols-12' : 'sm:grid-cols-2 md:grid-cols-3',
      )}
    >
      {games.map((game, index) => (
        <li
          key={game.id}
          className={cn(
            'w-[82%] shrink-0 snap-start sm:w-auto',
            pair && (index === 0 ? 'sm:col-span-7' : 'sm:col-span-5 sm:mt-24'),
          )}
        >
          <GameCard
            game={game}
            placement={placement}
            headingLevel={headingLevel}
            sizes={pair ? '(max-width: 639px) 82vw, (max-width: 1375px) 55vw, 760px' : '(max-width: 639px) 82vw, (max-width: 899px) 45vw, 440px'}
          />
        </li>
      ))}
    </ul>
  );
}

function GameFeature({ game, placement, headingLevel }: { game: Game; placement: 'home' | 'games'; headingLevel: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <article className="group grid items-end gap-8 md:grid-cols-12 md:gap-6">
      <TrackedLink
        href={routes.game(game.slug)}
        event={{ name: 'game_card_clicked', props: { slug: game.slug, placement } }}
        className="block rounded-lg md:col-span-8"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border-subtle bg-surface transition-[transform,border-color] duration-(--duration-standard) ease-premium group-hover:-translate-y-[3px] group-hover:border-border-active sm:aspect-[16/10]">
          <ResponsiveArt
            src={game.artwork.hero}
            mobileSrc={game.artwork.thumbnailMobile ?? game.artwork.thumbnail}
            mobileMaxWidth={639}
            alt=""
            sizes="(max-width: 899px) 100vw, 900px"
            mobileSizes="100vw"
            imgClassName="transition-transform duration-(--duration-editorial) ease-premium group-hover:scale-[1.02]"
          />
        </div>
      </TrackedLink>
      <div className="md:col-span-4 md:pb-2 md:pl-6">
        <p className="text-eyebrow uppercase text-text-muted">
          {CATEGORY_LABELS[game.category]}
          {game.status === 'coming-soon' ? ' · Coming soon' : ''}
        </p>
        <Heading className="mt-4 text-display-md text-text">{game.title}</Heading>
        <p className="mt-4 text-body text-text-secondary">{game.shortDescription}</p>
        {game.info.volatility ? (
          <p className="mt-6 text-small text-text-secondary">
            <span className="sr-only">Volatility: </span>
            <VolatilityIndicator value={game.info.volatility} />
          </p>
        ) : null}
        <TextLink
          href={routes.game(game.slug)}
          event={{ name: 'game_card_clicked', props: { slug: game.slug, placement } }}
          className="mt-8"
          aria-label={`View ${game.title}`}
        >
          View game
        </TextLink>
      </div>
    </article>
  );
}

