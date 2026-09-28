import type { Metadata } from 'next';
import { gamesPageContent } from '@/config/games.config';
import { getVisibleGames } from '@/lib/games/catalog';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { GameShowcase } from '@/components/games/GameShowcase';
import { PageIntro } from '@/components/layout/PageIntro';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = pageMetadata({
  title: 'Games',
  description: gamesPageContent.body,
  path: routes.games,
});

export default function GamesPage() {
  const games = getVisibleGames();
  const { empty } = gamesPageContent;

  return (
    <>
      <PageIntro eyebrow={gamesPageContent.eyebrow} headline={gamesPageContent.headline} body={<p>{gamesPageContent.body}</p>} />
      <section aria-label="Game portfolio" className="container-fnx pt-16 pb-(--section-space) md:pt-24">
        {games.length > 0 ? (
          <GameShowcase games={games} placement="games" headingLevel="h2" />
        ) : (
          <EmptyState headline={empty.headline} body={empty.body} cta={empty.cta} />
        )}
      </section>
    </>
  );
}
