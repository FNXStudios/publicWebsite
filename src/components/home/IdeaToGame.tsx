import { homeConfig } from '@/config/home.config';
import { Container } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { StageStory } from './StageStory';

/**
 * The creative narrative: one symbol followed from rough sketch to resolved game.
 * Wide grid, three calm bands — intro (headline ↔ description), the stage navigation
 * across the full width, then the artwork (~65%) beside the active stage (~35%).
 * The largest vertical padding on the page: Operators starts a different story.
 */
export function IdeaToGame() {
  const { ideaToGame } = homeConfig;
  const visuals = ideaToGame.stages.map((stage) => (
    <ResponsiveArt key={stage.art.src} src={stage.art.src} alt={stage.art.alt} sizes="(max-width: 639px) 100vw, (max-width: 899px) 50vw, (max-width: 1600px) 62vw, 960px" quality={80} />
  ));

  return (
    <section
      aria-labelledby="idea-title"
      className="grain relative w-full pt-sec-xl pb-sec-xl bg-[linear-gradient(180deg,var(--tone-made)_0%,var(--tone-idea)_12rem,var(--tone-idea)_calc(100%-12rem),var(--tone-operators)_100%)]"
    >
      <Container size="wide" className="relative z-10">
        <div className="grid-fnx gap-y-6 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow rule>{ideaToGame.eyebrow}</Eyebrow>
            <h2 id="idea-title" className="mt-5 text-display text-white">
              <HeadlineLines lines={ideaToGame.headline} />
            </h2>
          </div>
          <p className="prose-side text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-1">{ideaToGame.body}</p>
        </div>
        <div className="mt-14 md:mt-24">
          <StageStory label="From idea to game" stages={ideaToGame.stages.map(({ title, body }) => ({ title, body }))} visuals={visuals} />
        </div>
      </Container>
    </section>
  );
}
