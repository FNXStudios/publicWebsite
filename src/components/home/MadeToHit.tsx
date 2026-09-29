import { homeConfig } from '@/config/home.config';
import { Container } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * What makes the games different, as one engineered set of three: Feel, Identity,
 * Production. Wide grid; the headline block and the panels are separated by a real
 * gap (56 → 80px) so the section breathes. Every panel shares the same image region,
 * label row, title block (reserved for two lines) and body start, so the three read as
 * one row however the copy wraps (~460–500px tall on desktop).
 */
export function MadeToHit() {
  const { madeToHit } = homeConfig;
  return (
    <section aria-labelledby="made-title" className="relative isolate w-full overflow-x-clip pt-sec-md pb-sec-sm bg-(--tone-made)">
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-[40rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(113_52_244/0.07),transparent)]" />
      <Container size="wide">
        <div className="grid-fnx gap-y-6 md:items-end">
          <h2 id="made-title" className="text-display-xl text-white md:col-span-7">
            <HeadlineLines lines={madeToHit.headline} />
          </h2>
          <p className="prose-side text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-2">{madeToHit.body}</p>
        </div>

        <Reveal as="ol" className="mt-14 grid gap-(--grid-gap) gap-y-5 md:mt-20 md:grid-cols-3">
          {madeToHit.panels.map((panel, index) => (
            <li
              key={panel.label}
              className="group/panel relative flex flex-col overflow-hidden rounded-lg border border-white/[0.09] bg-raised transition-[border-color] duration-(--duration-standard) ease-premium hover:border-white/[0.16] sm:flex-row md:flex-col"
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%] md:aspect-[16/11] md:w-auto">
                <ResponsiveArt
                  src={panel.art.src}
                  alt={panel.art.alt}
                  sizes="(max-width: 639px) 100vw, (max-width: 899px) 42vw, (max-width: 1600px) 31vw, 490px"
                  imgClassName="brightness-[0.9] saturate-[0.95] transition-[filter,transform] duration-[700ms] ease-premium group-hover/panel:scale-[1.03] group-hover/panel:brightness-100 group-hover/panel:saturate-100"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-raised to-transparent sm:hidden md:block" />
              </div>

              <div className="flex flex-1 flex-col px-6 pt-5 pb-6 md:px-7 md:pb-7">
                <div className="flex items-center gap-3 text-eyebrow uppercase">
                  <Index n={index + 1} className="text-violet-300" />
                  <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                  <span className="text-text-secondary">{panel.label}</span>
                </div>
                <h3 className="mt-4 text-title text-white md:min-h-[2lh]">{panel.title}</h3>
                <p className="mt-3 text-body text-text-secondary">{panel.body}</p>
                <span aria-hidden="true" className="mt-auto block pt-6">
                  <span className="block h-px w-full bg-white/[0.08]">
                    <span className="block h-px w-8 bg-violet-400 transition-[width] duration-[640ms] ease-premium group-hover/panel:w-full" />
                  </span>
                </span>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
