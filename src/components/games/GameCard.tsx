import type { Game } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { CATEGORY_LABELS, gameArtAlt } from '@/lib/games/catalog';
import { VOLATILITY } from '@/lib/games/volatility';
import { routes } from '@/lib/routes';
import { ArrowRight } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TrackedLink } from '@/components/ui/TrackedLink';

interface GameCardProps {
  game: Game;
  placement: 'home' | 'games';
  headingLevel?: 'h2' | 'h3';
  /** Shape of the artwork frame. */
  ratio?: 'portrait' | 'landscape';
  sizes: string;
  className?: string;
}

export function GameCard({ game, placement, headingLevel = 'h3', ratio = 'portrait', sizes, className }: GameCardProps) {
  const Heading = headingLevel;
  const meta = [CATEGORY_LABELS[game.category], game.info.volatility && `${VOLATILITY[game.info.volatility].label} volatility`]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className={cn('group relative', className)}>
      <TrackedLink
        href={routes.game(game.slug)}
        event={{ name: 'game_card_clicked', props: { slug: game.slug, placement } }}
        className="block rounded-lg focus-visible:outline-offset-8"
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-border-subtle bg-surface',
            'transition-[transform,border-color] duration-(--duration-standard) ease-premium',
            'group-hover:-translate-y-[3px] group-hover:border-border-active',
            ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/10]',
          )}
        >
          <ResponsiveArt
            src={game.artwork.thumbnail}
            mobileSrc={game.artwork.thumbnailMobile}
            alt={gameArtAlt(game)}
            sizes={sizes}
            imgClassName="transition-transform duration-(--duration-editorial) ease-premium group-hover:scale-[1.022]"
          />
          {game.status === 'coming-soon' ? (
            <span className="absolute left-4 top-4 rounded-sm bg-bg/75 px-2.5 py-1.5 text-eyebrow uppercase text-text backdrop-blur-sm">
              Coming soon
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <Heading className="text-title text-text">{game.title}</Heading>
            {meta ? <p className="mt-1.5 text-small text-text-muted">{meta}</p> : null}
          </div>
          <ArrowRight className="arrow-nudge mt-1 size-5 shrink-0 text-text-secondary group-hover:translate-x-1 group-hover:text-text" />
        </div>
      </TrackedLink>
    </article>
  );
}
