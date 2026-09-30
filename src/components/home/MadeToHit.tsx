import { homeConfig } from '@/config/home.config';
import { Container } from '@/components/layout/Container';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * Feel, Identity, Production — one row of equal plates.
 * Image ratio, index, title and body share the same vertical rhythm.
 */
export function MadeToHit() {
  const { madeToHit } = homeConfig;
  return (
    <section aria-labelledby="made-title" className="relative w-full bg-(--tone-made)">
      <Container size="wide">
        <div className="grid-fnx items-end gap-y-5">
          <h2 id="made-title" className="text-display text-white md:col-span-7">
            <HeadlineLines lines={madeToHit.headline} />
          </h2>
          <p className="text-lead text-text-secondary md:col-span-5">{madeToHit.body}</p>
        </div>

        <Reveal as="ol" className="mt-header grid gap-(--grid-gap) md:grid-cols-3">
          {madeToHit.panels.map((panel, index) => (
            <li key={panel.label} className="group/panel flex flex-col">
              <MediaFrame slot="production">
                <ResponsiveArt
                  src={panel.art.src}
                  alt={panel.art.alt}
                  sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 420px"
                  imgClassName="transition-transform duration-[700ms] ease-premium group-hover/panel:scale-[1.02]"
                />
              </MediaFrame>
              <div className="flex flex-1 flex-col pt-5">
                <div className="flex items-center gap-3 text-eyebrow uppercase">
                  <Index n={index + 1} className="text-violet-300" />
                  <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                  <span className="text-text-secondary">{panel.label}</span>
                </div>
                <h3 className="mt-3 text-title text-white md:min-h-[2.4em]">{panel.title}</h3>
                <p className="mt-3 text-body text-text-secondary">{panel.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
