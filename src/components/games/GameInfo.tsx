import type { Game } from '@/config/schema/game.schema';
import { getGameFacts, splitParagraphs } from '@/lib/games/info';
import { Eyebrow } from '@/components/ui/Typography';
import { VolatilityIndicator } from './VolatilityIndicator';

/**
 * Description, facts, mechanics and features. Each block renders only when
 * configured; with nothing configured the section is omitted entirely.
 */
export function GameInfo({ game }: { game: Game }) {
  const paragraphs = splitParagraphs(game.description);
  const facts = getGameFacts(game);
  const { volatility, mechanics, features } = game.info;
  const hasFacts = facts.length > 0 || volatility !== undefined;
  const lists = [
    { title: 'Mechanics', items: mechanics },
    { title: 'Features', items: features },
  ].filter((list): list is { title: string; items: string[] } => Boolean(list.items?.length));

  if (!paragraphs.length && !hasFacts && !lists.length) return null;

  return (
    <section aria-labelledby="game-info-title" className="container-wide pt-sec-md pb-sec-md">
      <h2 id="game-info-title" className="sr-only">
        About {game.title}
      </h2>
      <div className="grid gap-14 md:grid-cols-12 md:gap-6">
        {paragraphs.length ? (
          <div className="space-y-6 md:col-span-6">
            {paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-title text-text' : 'text-lead text-text-secondary'}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        {hasFacts || lists.length ? (
          <div className={paragraphs.length ? 'md:col-span-5 md:col-start-8' : 'md:col-span-7'}>
            {hasFacts ? (
              <>
                <Eyebrow>Game info</Eyebrow>
                <dl className="mt-5 border-t border-white/[0.09]">
                  {volatility ? (
                    <div className="flex items-center justify-between gap-6 border-b border-white/[0.09] py-4">
                      <dt className="text-small text-text-muted">Volatility</dt>
                      <dd className="text-small font-medium text-text">
                        <VolatilityIndicator value={volatility} />
                      </dd>
                    </div>
                  ) : null}
                  {facts.map((fact) => (
                    <div key={fact.key} className="flex items-center justify-between gap-6 border-b border-white/[0.09] py-4">
                      <dt className="text-small text-text-muted">{fact.label}</dt>
                      <dd className="text-small font-semibold tabular-nums text-text">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            {lists.length ? (
              <div className={hasFacts ? 'mt-10 grid gap-8 sm:grid-cols-2' : 'grid gap-8 sm:grid-cols-2'}>
                {lists.map((list) => (
                  <div key={list.title}>
                    <h3 className="text-eyebrow text-text-muted uppercase">{list.title}</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {list.items.map((item) => (
                        <li key={item} className="rounded-full border border-(--game-accent)/30 bg-(--game-accent)/[0.06] px-3.5 py-1.5 text-small font-medium text-text">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
