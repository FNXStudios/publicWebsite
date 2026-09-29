import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { GameCard } from './GameCard';

interface GameRailProps {
  games: Game[];
  placement: 'home' | 'games';
  headingLevel: 'h2' | 'h3';
  /** Kept for callers; both surfaces use portrait thumbnails. */
  ratio?: 'feature' | 'portrait' | 'landscape';
  className?: string;
}

/**
 * Shared game grid: portrait thumbnails.
 * Home: fixed ~200px tiles. Games: three-up grid on desktop.
 * Phones: horizontal scroll-snap rail with a peek of the next card.
 */
export function GameRail({ games, placement, headingLevel, className }: GameRailProps) {
  if (games.length === 0) return null;

  const home = placement === 'home';

  return (
    <ul
      className={cn(
        '-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pt-2 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        home
          ? 'md:mx-0 md:flex md:flex-wrap md:gap-4 md:overflow-visible md:px-0 md:pt-0 md:pb-0'
          : 'md:mx-0 md:grid md:grid-cols-3 md:gap-(--grid-gap) md:overflow-visible md:px-0 md:pt-0 md:pb-0',
        className,
      )}
    >
      {games.map((game, index) => (
        <li
          key={game.id}
          className={cn(
            'shrink-0 snap-start',
            home
              ? 'w-[42vw] max-w-[11rem] sm:w-[10.5rem] md:w-[12.5rem] md:max-w-none'
              : 'w-[72vw] max-w-[16rem] sm:w-[42vw] md:w-auto md:max-w-none',
          )}
        >
          <GameCard
            game={game}
            placement={placement}
            headingLevel={headingLevel}
            ratio="portrait"
            priority={placement === 'games' && index < 3}
            sizes={
              home
                ? '(max-width: 639px) 42vw, 200px'
                : '(max-width: 639px) 72vw, (max-width: 899px) 42vw, (max-width: 1600px) 28vw, 420px'
            }
          />
        </li>
      ))}
    </ul>
  );
}
