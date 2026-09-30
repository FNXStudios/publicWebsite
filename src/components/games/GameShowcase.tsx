import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { GameCard } from './GameCard';

interface GameRailProps {
  games: Game[];
  placement: 'home' | 'games';
  headingLevel: 'h2' | 'h3';
  /** Frame shape. The Games index (`wrap`) always uses the catalogue crop. */
  ratio?: 'feature' | 'portrait' | 'landscape' | 'catalogue';
  /** Games index: 2 columns below 1200px, 3 columns in a centred catalogue from there. */
  wrap?: boolean;
  className?: string;
}

/**
 * Shared game grid.
 * Home: fixed ~200px portrait tiles.
 * Games index (`wrap`): two columns below 1200px, then a centred 3-up catalogue
 * (about 1140px, shallower crops). No horizontal scroll.
 * Other games rails scroll sideways on a phone and become a three-up grid from the md breakpoint.
 */
export function GameRail({ games, placement, headingLevel, wrap = false, className }: GameRailProps) {
  if (games.length === 0) return null;

  const home = placement === 'home';

  if (wrap) {
    return (
      <ul className={cn('mx-auto grid w-full max-w-[71.25rem] grid-cols-2 gap-3.5 min-[48rem]:gap-5 lg:grid-cols-3 lg:gap-6', className)}>
        {games.map((game, index) => (
          <li key={game.id} className="min-w-0">
            <GameCard
              game={game}
              placement={placement}
              headingLevel={headingLevel}
              ratio="catalogue"
              priority={index < 3}
              sizes="(max-width: 767px) 46vw, (max-width: 1199px) 42vw, 380px"
            />
          </li>
        ))}
      </ul>
    );
  }

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
            home ? 'w-[42vw] max-w-[11rem] sm:w-[10.5rem] md:w-[12.5rem] md:max-w-none' : 'w-[72vw] max-w-[16rem] sm:w-[42vw] md:w-auto md:max-w-none',
          )}
        >
          <GameCard
            game={game}
            placement={placement}
            headingLevel={headingLevel}
            ratio="portrait"
            priority={placement === 'games' && index < 3}
            sizes={home ? '(max-width: 639px) 42vw, 200px' : '(max-width: 639px) 72vw, (max-width: 899px) 42vw, (max-width: 1600px) 28vw, 420px'}
          />
        </li>
      ))}
    </ul>
  );
}
