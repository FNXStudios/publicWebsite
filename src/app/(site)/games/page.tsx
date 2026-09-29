import type { Metadata } from 'next';
import { gamesPageContent } from '@/config/games.config';
import { getDisplayGames } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { GameRail } from '@/components/games/GameShowcase';
import { FinalCta } from '@/components/home/FinalCta';
import { Container } from '@/components/layout/Container';
import { PageIntro } from '@/components/layout/PageIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Games',
  description: gamesPageContent.body,
  path: routes.games,
});

/**
 * Centered editorial opener, then an even 3-up thumbnail grid — same card style as the homepage rail.
 */
export default function GamesPage() {
  const games = getDisplayGames();
  const { empty, closing } = gamesPageContent;

  return (
    <>
      <PageIntro
        layout="centered"
        eyebrow={gamesPageContent.eyebrow}
        headline={gamesPageContent.headline}
        body={<p className="text-text">{gamesPageContent.body}</p>}
        atmosphere={
          <div className="absolute inset-0 bg-[radial-gradient(36rem_24rem_at_50%_-6%,rgb(113_52_244/0.11),transparent_72%),radial-gradient(28rem_20rem_at_8%_100%,rgb(240_189_114/0.04),transparent_72%)]" />
        }
      />

      <Container as="section" size="wide" aria-label={gamesPageContent.portfolioLabel} className="pt-10 pb-sec-md md:pt-14">
        {games.length ? (
          <Reveal>
            <GameRail games={games} placement="games" headingLevel="h2" ratio="portrait" />
          </Reveal>
        ) : (
          <EmptyState
            headline={empty.headline}
            body={empty.body}
            action={
              <ContactTrigger variant="secondary" placement="games-empty" interest={empty.cta.interest}>
                {empty.cta.label}
              </ContactTrigger>
            }
          />
        )}
      </Container>

      {games.length ? <FinalCta eyebrow={closing.eyebrow} headline={closing.headline} body={closing.body} cta={closing.cta} placement="games-closing" /> : null}
    </>
  );
}
