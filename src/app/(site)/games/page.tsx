import type { Metadata } from 'next';
import { gamesPageContent } from '@/config/games.config';
import { getDisplayGames } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { GameFeature } from '@/components/games/GameFeature';
import { GameRail } from '@/components/games/GameShowcase';
import { FinalCta } from '@/components/home/FinalCta';
import { PageIntro } from '@/components/layout/PageIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Games',
  description: gamesPageContent.body,
  path: routes.games,
});

/** A portfolio, not a grid of rectangles: the lead title large, the rest as wide cards. */
export default function GamesPage() {
  const games = getDisplayGames();
  const [lead, ...rest] = games;
  const { empty, closing } = gamesPageContent;

  return (
    <>
      <PageIntro
        eyebrow={gamesPageContent.eyebrow}
        headline={gamesPageContent.headline}
        body={<p>{gamesPageContent.body}</p>}
        atmosphere={
          <div className="absolute inset-0 bg-[radial-gradient(34rem_22rem_at_62%_110%,rgb(226_64_42/0.12),transparent_70%),radial-gradient(34rem_22rem_at_82%_90%,rgb(106_63_224/0.16),transparent_70%),radial-gradient(30rem_20rem_at_100%_40%,rgb(31_165_106/0.08),transparent_70%)]" />
        }
      />

      <section aria-label={gamesPageContent.portfolioLabel} className="container-fnx pt-12 pb-large md:pt-16">
        {lead ? (
          <div className="flex flex-col gap-6">
            <GameFeature game={lead} priority />
            {rest.length ? (
              <Reveal>
                <GameRail games={rest} placement="games" headingLevel="h2" ratio={rest.length > 2 ? 'feature' : 'landscape'} />
              </Reveal>
            ) : null}
          </div>
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
      </section>

      {lead ? <FinalCta eyebrow={closing.eyebrow} headline={closing.headline} body={closing.body} cta={closing.cta} placement="games-closing" /> : null}
    </>
  );
}
