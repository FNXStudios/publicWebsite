import { homeConfig } from '@/config/home.config';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * Signature section: three large territories — game feel, visual impact, production.
 * Desktop: adjacent panels; the hovered / focused one widens slightly (a stable flex
 * change, no accordion jump), its visual brightens, copy sharpens and the rule draws.
 * Hover is enhancement only: at rest every word is readable and nothing is focus-gated. Phones stack with no hover dependency. CSS only.
 */
export function MadeToHit() {
  const { madeToHit } = homeConfig;
  return (
    <section aria-labelledby="made-title" className="relative isolate overflow-x-clip pt-medium pb-large bg-(--tone-made)">
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-[40rem] w-[70rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(113_52_244/0.07),transparent)]" />
      <div className="container-fnx">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-6">
            <Eyebrow rule>{madeToHit.eyebrow}</Eyebrow>
            <h2 id="made-title" className="mt-5 text-[clamp(3rem,1.6rem+5.4vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-white">
              <HeadlineLines lines={madeToHit.headline} />
            </h2>
          </div>
          <p className="max-w-[30rem] text-lead text-text-secondary md:col-span-5 md:col-start-8 md:pb-3">{madeToHit.body}</p>
        </div>

        <Reveal as="ol" className="group/panels mt-12 flex flex-col gap-4 md:mt-16 md:h-[36rem] md:flex-row lg:h-[38rem]">
          {madeToHit.panels.map((panel, index) => (
            <li
              key={panel.label}
              className="group/panel relative isolate flex min-w-0 flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-raised transition-[flex-grow,border-color] duration-[560ms] ease-premium md:flex-1 md:hover:grow-[1.4] md:hover:border-white/[0.16]"
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                <ResponsiveArt
                  src={panel.art.src}
                  alt={panel.art.alt}
                  sizes="(max-width: 899px) 100vw, 640px"
                  imgClassName="brightness-[0.78] saturate-[0.9] transition-[filter,transform] duration-[700ms] ease-premium group-hover/panel:scale-[1.03] group-hover/panel:brightness-100 group-hover/panel:saturate-100 max-md:brightness-95"
                />
                <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgb(5_6_7/0.35)_0%,transparent_28%,transparent_42%,rgb(5_6_7/0.78)_68%,rgb(5_6_7/0.97)_100%)] md:block" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-raised to-transparent md:hidden" />
              </div>

              <div className="relative mt-auto flex flex-col p-6 md:p-8">
                <div className="flex items-center gap-3 text-eyebrow uppercase">
                  <Index n={index + 1} className="text-violet-300" />
                  <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                  <span className="text-text-secondary">{panel.label}</span>
                </div>
                <h3 className="mt-5 max-w-[22ch] text-title text-white">
                  {panel.title}
                </h3>
                <p className="mt-4 max-w-[34ch] text-small text-text-secondary transition-[opacity,color] duration-(--duration-standard) md:text-white/55 md:group-hover/panel:text-text-secondary">
                  {panel.body}
                </p>
                {/* Accent rule draws across the active panel. */}
                <span aria-hidden="true" className="mt-6 block h-px w-full bg-white/[0.08]">
                  <span className="block h-px w-8 bg-violet-400 transition-[width] duration-[640ms] ease-premium group-hover/panel:w-full" />
                </span>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
