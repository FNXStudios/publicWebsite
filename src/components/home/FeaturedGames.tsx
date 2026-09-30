import { homeConfig } from '@/config/home.config';
import { getFeaturedGames } from '@/lib/games/catalog';
import { GameRail } from '@/components/games/GameShowcase';
import { Container } from '@/components/layout/Container';
import { TextLink } from '@/components/ui/TextLink';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * Featured titles as compact thumbnails — colour payoff without a full-bleed game wall.
 * Renders nothing without games.
 */
export function FeaturedGames() {
  const { featured } = homeConfig;
  const games = getFeaturedGames(featured.limit);
  if (games.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-title"
      className="relative isolate w-full bg-[linear-gradient(180deg,var(--tone-hero)_0%,var(--tone-featured)_18rem,var(--tone-featured)_calc(100%-12rem),var(--tone-made)_100%)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[40%] -z-10 h-[50%] bg-[radial-gradient(40%_60%_at_20%_50%,rgb(226_64_42/0.07),transparent),radial-gradient(40%_60%_at_50%_50%,rgb(106_63_224/0.08),transparent),radial-gradient(40%_60%_at_82%_50%,rgb(31_165_106/0.06),transparent)]"
      />
      <Container size="wide">
        <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <div>
            <Eyebrow rule>{featured.eyebrow}</Eyebrow>
            <h2 id="featured-title" className="mt-5 text-display text-white">
              <HeadlineLines lines={featured.headline} />
            </h2>
          </div>
          <TextLink href={featured.allGames.href} className="mb-1 hidden shrink-0 sm:inline-flex">
            {featured.allGames.label}
          </TextLink>
        </div>
        <Reveal>
          <GameRail games={games} placement="home" headingLevel="h3" ratio="portrait" />
        </Reveal>
        <TextLink href={featured.allGames.href} className="mt-2 sm:hidden">
          {featured.allGames.label}
        </TextLink>
      </Container>
    </section>
  );
}
