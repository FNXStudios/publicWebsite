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
    <section aria-labelledby="game-info-title" className="container-fnx section-space">
      <h2 id="game-info-title" className="sr-only">
        About {game.title}
      </h2>
      <div className="grid gap-14 md:grid-cols-12 md:gap-6">
        {paragraphs.length ? (
          <div className="space-y-6 md:col-span-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lead text-text-secondary">
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
                <dl className="mt-5 border-t border-border-subtle">
                  {volatility ? (
                    <div className="flex items-center justify-between gap-6 border-b border-border-subtle py-4">
                      <dt className="text-small text-text-muted">Volatility</dt>
                      <dd className="text-small font-medium text-text">
                        <VolatilityIndicator value={volatility} />
                      </dd>
                    </div>
                  ) : null}
                  {facts.map((fact) => (
                    <div key={fact.key} className="flex items-center justify-between gap-6 border-b border-border-subtle py-4">
                      <dt className="text-small text-text-muted">{fact.label}</dt>
                      <dd className="text-small font-medium tabular-nums text-text">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            {lists.length ? (
              <div className={hasFacts ? 'mt-12 grid gap-10 sm:grid-cols-2' : 'grid gap-10 sm:grid-cols-2'}>
                {lists.map((list) => (
                  <div key={list.title}>
                    <h3 className="text-eyebrow uppercase text-text-muted">{list.title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {list.items.map((item) => (
                        <li key={item} className="text-body text-text">
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
