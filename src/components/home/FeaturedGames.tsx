import { homeConfig } from '@/config/home.config';
import { getFeaturedGames } from '@/lib/games/catalog';
import { GameShowcase } from '@/components/games/GameShowcase';
import { Section } from '@/components/layout/Container';
import { TextLink } from '@/components/ui/TextLink';
import { Eyebrow } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** Renders nothing when no game is featured — never an empty rail. */
export function FeaturedGames() {
  const { featured } = homeConfig;
  const games = getFeaturedGames(featured.limit);
  if (games.length === 0) return null;

  return (
    <Section labelledBy="featured-title" spacing="none" className="pt-12 md:pt-16">
      <div className="container-fnx">
        <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <Eyebrow>{featured.eyebrow}</Eyebrow>
            <h2 id="featured-title" className="mt-4 text-display-md text-text">
              {featured.heading}
            </h2>
          </div>
          <TextLink href={featured.allGames.href} className="hidden shrink-0 sm:inline-flex">
            {featured.allGames.label}
          </TextLink>
        </Reveal>
        <Reveal delay={80}>
          <GameShowcase games={games} placement="home" headingLevel="h3" />
        </Reveal>
        <TextLink href={featured.allGames.href} className="mt-8 sm:hidden">
          {featured.allGames.label}
        </TextLink>
      </div>
    </Section>
  );
}
