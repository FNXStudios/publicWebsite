import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { GameCard } from './GameCard';

interface GameRailProps {
  games: Game[];
  placement: 'home' | 'games';
  headingLevel: 'h2' | 'h3';
  ratio?: 'feature' | 'portrait' | 'landscape';
  className?: string;
}

/**
 * Three-up grid on desktop; on phones a native horizontal scroll-snap rail with
 * ~84vw cards and a peek of the next one. No autoplay, no JS.
 */
export function GameRail({ games, placement, headingLevel, ratio = 'feature', className }: GameRailProps) {
  if (games.length === 0) return null;
  const cols = games.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <ul
      className={cn(
        '-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        'md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pt-0 md:pb-0',
        cols,
        className,
      )}
    >
      {games.map((game, index) => (
        <li key={game.id} className="w-[84vw] max-w-[26rem] shrink-0 snap-start sm:w-[46vw] md:w-auto md:max-w-none">
          <GameCard
            game={game}
            placement={placement}
            headingLevel={headingLevel}
            ratio={ratio}
            priority={placement === 'games' && index < 3}
            sizes={games.length === 2 ? '(max-width: 899px) 84vw, 680px' : '(max-width: 639px) 84vw, (max-width: 899px) 46vw, 460px'}
          />
        </li>
      ))}
    </ul>
  );
}
