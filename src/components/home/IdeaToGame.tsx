import { homeConfig } from '@/config/home.config';
import { Container } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { StageStory } from './StageStory';

/**
 * Creative narrative: one symbol from sketch to game.
 * Same wide 12-column grid as MadeToHit / Operators so edges line up.
 */
export function IdeaToGame() {
  const { ideaToGame } = homeConfig;
  const visuals = ideaToGame.stages.map((stage) => (
    <ResponsiveArt
      key={stage.art.src}
      src={stage.art.src}
      alt={stage.art.alt}
      sizes="(max-width: 639px) 100vw, (max-width: 899px) 50vw, (max-width: 1600px) 55vw, 820px"
      quality={80}
    />
  ));

  return (
    <section
      aria-labelledby="idea-title"
      className="grain relative w-full pt-sec-md pb-sec-md bg-[linear-gradient(180deg,var(--tone-made)_0%,var(--tone-idea)_10rem,var(--tone-idea)_calc(100%-10rem),var(--tone-operators)_100%)]"
    >
      <Container size="wide" className="relative z-10">
        <div className="grid-fnx gap-y-5 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow rule>{ideaToGame.eyebrow}</Eyebrow>
            <h2 id="idea-title" className="mt-4 text-display text-white">
              <HeadlineLines lines={ideaToGame.headline} />
            </h2>
          </div>
          <p className="prose-side text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-1">{ideaToGame.body}</p>
        </div>
        <div className="mt-8 md:mt-10">
          <StageStory label="From idea to game" stages={ideaToGame.stages.map(({ title, body }) => ({ title, body }))} visuals={visuals} />
        </div>
      </Container>
    </section>
  );
}
