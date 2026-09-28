import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGameBySlug, getVisibleGames, isPlayable } from '@/lib/games/catalog';
import { resolveGameLaunch } from '@/lib/games/launch';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { GamePlayer } from '@/components/games/GamePlayer';

export const dynamicParams = false;

/** Only available games get a play route; coming-soon and hidden games 404. */
export function generateStaticParams() {
  return getVisibleGames()
    .filter(isPlayable)
    .map((game) => ({ slug: game.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGameBySlug((await params).slug);
  if (!game) return {};
  return pageMetadata({ title: `Play ${game.title}`, path: routes.play(game.slug), noIndex: true });
}

export default async function PlayPage({ params }: Props) {
  const game = getGameBySlug((await params).slug);
  if (!game) notFound();
  // Resolved at build time against NEXT_PUBLIC_GAME_BASE_URL; throws on untrusted origins.
  const launch = resolveGameLaunch(game);
  if (!launch) notFound();

  return (
    <GamePlayer
      slug={game.slug}
      title={game.title}
      src={launch.url}
      origin={launch.origin}
      sandbox={launch.policy.kind === 'third-party' ? launch.policy.sandbox.join(' ') : undefined}
      orientation={game.game.orientation}
      aspectRatio={game.game.aspectRatio}
      readySignal={game.game.readySignal}
      backHref={routes.game(game.slug)}
    />
  );
}
