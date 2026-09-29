import { homeConfig } from '@/config/home.config';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { StageStory } from './StageStory';

/** One symbol followed from sketch to reels — seeing something become a game. */
export function IdeaToGame() {
  const { ideaToGame } = homeConfig;
  const visuals = ideaToGame.stages.map((stage) => (
    <ResponsiveArt key={stage.art.src} src={stage.art.src} alt={stage.art.alt} sizes="(max-width: 899px) 100vw, 860px" quality={80} />
  ));

  return (
    <section
      aria-labelledby="idea-title"
      className="grain relative pt-large pb-medium bg-[linear-gradient(180deg,var(--tone-made)_0%,var(--tone-idea)_14rem,var(--tone-idea)_calc(100%-14rem),var(--tone-operators)_100%)]"
    >
      <div className="container-fnx relative z-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-7">
            <Eyebrow rule>{ideaToGame.eyebrow}</Eyebrow>
            <h2 id="idea-title" className="mt-5 text-display text-white">
              <HeadlineLines lines={ideaToGame.headline} />
            </h2>
          </div>
          <p className="max-w-[28rem] text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-2">{ideaToGame.body}</p>
        </div>
        <div className="mt-14 md:mt-10">
          <StageStory label="From idea to game" stages={ideaToGame.stages.map(({ title, body }) => ({ title, body }))} visuals={visuals} caption={ideaToGame.subject} />
        </div>
      </div>
    </section>
  );
}
