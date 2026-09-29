import type { Metadata } from 'next';

import { FinalCta } from '@/components/home/FinalCta';
import { ProcessStages } from '@/components/studio/ProcessStages';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import {
  Eyebrow,
  HeadlineLines,
  Index,
} from '@/components/ui/Typography';

import { studioConfig } from '@/config/studio.config';

import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';

import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Studio',
  description: studioConfig.about.body,
  path: routes.studio,
});

const workLayouts = [
  {
    span: 'md:col-span-8',
    aspect: 'aspect-[16/10]',
  },
  {
    span: 'md:col-span-4',
    aspect: 'aspect-[4/5]',
  },
  {
    span: 'md:col-span-5',
    aspect: 'aspect-[4/3]',
  },
  {
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    span: 'md:col-span-12',
    aspect: 'aspect-[16/7]',
  },
  {
    span: 'md:col-span-12',
    aspect: 'aspect-[16/8]',
  },
] as const;

export default function StudioPage() {
  const {
    about,
    reason,
    capabilities,
    philosophy,
    tools,
    process,
    work,
    standard,
    cta,
  } = studioConfig;

  return (
    <>
      {/* =========================================================
          01 — ABOUT FNX
          Who we are.
         ========================================================= */}
      <section
        aria-labelledby="studio-title"
        className="relative isolate overflow-hidden bg-[var(--depth-page)]"
      >
        {/* Warm studio light — deliberately restrained. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(42rem_30rem_at_12%_14%,rgb(240_189_114/0.075),transparent_72%),radial-gradient(50rem_34rem_at_94%_18%,rgb(113_52_244/0.12),transparent_72%)]"
        />

        <div
          aria-hidden="true"
          className="fnx-diagonals pointer-events-none absolute inset-0 -z-20 opacity-[0.035]"
        />

        <div className="container-fnx pt-[calc(var(--header-height)+4.5rem)] pb-16 md:pt-[calc(var(--header-height)+6rem)] md:pb-24 lg:min-h-[50rem] lg:flex lg:items-center">
          <div className="grid w-full gap-12 md:grid-cols-12 md:items-center md:gap-10">
            {/* ---------------------------------
                Hero copy
               --------------------------------- */}
            <div className="relative z-10 md:col-span-5">
              <Eyebrow
                rule
                className="enter-rise text-text-secondary"
              >
                {about.eyebrow}
              </Eyebrow>

              <h1
                id="studio-title"
                className="enter-rise mt-6 max-w-[10.5ch] text-hero text-white [--enter-step:1]"
              >
                <HeadlineLines lines={about.headline} />
              </h1>

              <p className="enter-rise mt-7 max-w-[34rem] text-lead text-text-secondary [--enter-step:2]">
                {about.body}
              </p>

              {/* Small proof line. Not a badge cluster. */}
              <div className="enter-rise mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.69rem] font-semibold tracking-[0.18em] text-white/38 uppercase [--enter-step:3]">
                <span>5+ years building games</span>

                <span
                  aria-hidden="true"
                  className="h-[3px] w-[3px] rounded-full bg-violet-400/70"
                />

                <span>Independent studio</span>

                <span
                  aria-hidden="true"
                  className="h-[3px] w-[3px] rounded-full bg-violet-400/70"
                />

                <span>Original IP</span>
              </div>
            </div>

            {/* ---------------------------------
                Production board visual
               --------------------------------- */}
            <div className="relative md:col-span-7 md:-mr-[4vw] lg:-mr-[8vw]">
              <Reveal className="relative">
                <figure className="relative min-h-[25rem] overflow-hidden rounded-[1rem] sm:min-h-[31rem] md:min-h-[39rem] lg:min-h-[43rem]">
                  <ResponsiveArt
                    src={about.art.src}
                    alt={about.art.alt}
                    priority
                    quality={80}
                    sizes="(max-width: 899px) 100vw, 62vw"
                    imgClassName="object-cover object-[51%_47%] saturate-[0.97]"
                  />

                  {/* Integrate artwork into the page instead of presenting
                      it as a detached card. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(90deg,var(--depth-page)_0%,rgb(5_6_7/0.72)_6%,transparent_31%),linear-gradient(180deg,transparent_66%,var(--depth-page)_100%)]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(55%_48%_at_77%_41%,transparent_0%,rgb(5_6_7/0.08)_62%,rgb(5_6_7/0.46)_100%)]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--depth-page)] to-transparent"
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          02 — WHY FNX EXISTS
          Why this studio needed to exist.
         ========================================================= */}
      <section
        aria-labelledby="reason-title"
        className="relative isolate overflow-hidden bg-[var(--depth-section)] py-[clamp(7rem,11vw,11rem)]"
      >
        {/* Giant authored geometry instead of another card/image block. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-8rem] -z-20 hidden -translate-y-1/2 select-none text-[36rem] leading-none font-black tracking-[-0.12em] text-violet-400/[0.018] lg:block"
        >
          X
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 -z-10 h-full w-[46vw] opacity-[0.055]"
        >
          <ResponsiveArt
            src={reason.art.src}
            alt=""
            sizes="46vw"
            imgClassName="object-cover object-[52%_40%]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--depth-section)_0%,rgb(7_9_12/0.92)_24%,rgb(7_9_12/0.46)_72%,var(--depth-section)_100%),linear-gradient(180deg,var(--depth-section)_0%,transparent_24%,var(--depth-section)_100%)]" />
        </div>

        <div className="container-fnx">
          <div className="grid gap-14 md:grid-cols-12 md:gap-10">
            {/* Manifesto heading */}
            <div className="md:col-span-5">
              <Eyebrow rule>
                {reason.eyebrow}
              </Eyebrow>

              <h2
                id="reason-title"
                className="mt-6 max-w-[11ch] text-display text-white"
              >
                <HeadlineLines lines={reason.headline} />
              </h2>
            </div>

            {/* Story */}
            <div className="md:col-span-6 md:col-start-7">
              <p className="max-w-[39rem] text-lead text-text-secondary">
                {reason.intro}
              </p>

              <div className="mt-10 space-y-7">
                {reason.blocks.map((paragraph, index) => (
                  <Reveal
                    key={`${index}-${paragraph.slice(0, 16)}`}
                    delay={index * 55}
                  >
                    <p className="max-w-[40rem] text-[1.0625rem] leading-[1.75] text-text-secondary md:text-[1.125rem]">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              {/* Strong editorial statement */}
              <Reveal delay={100}>
                <p className="mt-12 max-w-[38rem] text-[clamp(1.8rem,1.25rem+1.6vw,3.15rem)] leading-[1.08] font-semibold tracking-[-0.038em] text-white">
                  {reason.closing}
                </p>
              </Reveal>

              {/* Tools philosophy folded into the origin story. */}
              <Reveal delay={140}>
                <div className="mt-14 border-l border-violet-400/55 pl-6 md:pl-8">
                  <p className="text-eyebrow font-semibold tracking-[0.2em] text-violet-300 uppercase">
                    {tools.eyebrow}
                  </p>

                  <h3 className="mt-4 max-w-[27rem] text-[clamp(1.8rem,1.35rem+1.1vw,2.8rem)] leading-[1.06] font-semibold tracking-[-0.034em] text-white">
                    {tools.headline}
                  </h3>

                  <p className="mt-5 max-w-[39rem] text-lead text-text-secondary">
                    {tools.body}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          03 — WHAT WE DO
         ========================================================= */}
      <section
        aria-labelledby="capabilities-title"
        className="bg-[var(--depth-page)] py-[clamp(6rem,9vw,9rem)]"
      >
        <div className="container-fnx">
          <Eyebrow
            id="capabilities-title"
            rule
          >
            {capabilities.eyebrow}
          </Eyebrow>

          <div className="mt-7 grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
            <h2 className="max-w-[11ch] text-display text-white md:col-span-7">
              <HeadlineLines lines={capabilities.headline} />
            </h2>

            <p className="max-w-[32rem] text-lead text-text-secondary md:col-span-5 md:justify-self-end">
              {capabilities.intro}
            </p>
          </div>

          {/* Editorial lanes — no feature cards. */}
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-9">
            {capabilities.items.map((item, index) => (
              <article
                key={item.title}
                className="group relative border-t border-white/[0.085] pt-7 md:pt-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-0 bg-violet-400 transition-[width] duration-[520ms] ease-premium group-hover:w-24"
                />

                <Reveal delay={index * 70}>
                  <Index
                    n={index + 1}
                    className="text-text-muted transition-colors duration-(--duration-standard) group-hover:text-violet-300"
                  />

                  <h3 className="mt-7 max-w-[10ch] text-[clamp(1.9rem,1.4rem+1.25vw,3rem)] leading-[1.03] font-semibold tracking-[-0.037em] text-white/92 transition-[transform,color] duration-(--duration-standard) ease-premium group-hover:translate-x-1 group-hover:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-[28rem] text-lead text-text-secondary">
                    {item.body}
                  </p>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          04 — OUR PHILOSOPHY
          Main signature section.
         ========================================================= */}
      <section
        aria-labelledby="philosophy-title"
        className="relative overflow-hidden bg-[var(--depth-section-alt)] py-[clamp(7rem,11vw,12rem)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(40rem_20rem_at_20%_0%,rgb(113_52_244/0.07),transparent_75%)]"
        />

        <div className="container-fnx relative">
          <div className="max-w-[48rem]">
            <Eyebrow rule>
              {philosophy.eyebrow}
            </Eyebrow>

            <h2
              id="philosophy-title"
              className="mt-6 max-w-[11ch] text-display text-white"
            >
              <HeadlineLines lines={philosophy.headline} />
            </h2>

            <p className="mt-7 max-w-[42rem] text-lead text-text-secondary">
              {philosophy.intro}
            </p>
          </div>
        </div>

        {/* Each principle is an editorial chapter, not a card. */}
        <div className="relative mt-24 space-y-[clamp(8rem,13vw,14rem)] md:mt-32">
          {philosophy.principles.map((principle, index) => {
            const visualFirst = index % 2 !== 0;

            return (
              <article
                key={principle.label}
                className="relative overflow-hidden"
              >
                <div className="container-fnx">
                  <div className="grid gap-12 border-t border-white/[0.055] pt-12 md:grid-cols-12 md:items-center md:gap-10 md:pt-16">
                    {/* -----------------------------
                        Principle copy
                       ----------------------------- */}
                    <div
                      className={cn(
                        'relative z-10 md:col-span-5',
                        visualFirst
                          ? 'md:order-2 md:col-start-8'
                          : 'md:order-1 md:col-start-1',
                      )}
                    >
                      <p className="flex items-center gap-3 text-eyebrow font-semibold tracking-[0.18em] text-violet-300 uppercase">
                        <span
                          aria-hidden="true"
                          className="h-px w-7 bg-violet-400/80"
                        />
                        {principle.label}
                      </p>

                      <h3 className="mt-7 max-w-[11ch] text-[clamp(2.45rem,1.6rem+2.2vw,4.6rem)] leading-[1] font-semibold tracking-[-0.043em] text-white">
                        <HeadlineLines lines={principle.headline} />
                      </h3>

                      <p className="mt-8 max-w-[35rem] text-[1.0625rem] leading-[1.75] text-text-secondary md:text-[1.125rem]">
                        {principle.body}
                      </p>
                    </div>

                    {/* -----------------------------
                        Principle artwork
                       ----------------------------- */}
                    <div
                      className={cn(
                        'md:col-span-7',
                        visualFirst
                          ? 'md:order-1 md:col-start-1 md:-ml-[4vw]'
                          : 'md:order-2 md:col-start-6 md:-mr-[4vw]',
                      )}
                    >
                      <Reveal className="group relative">
                        <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-raised">
                          <ResponsiveArt
                            src={principle.art.src}
                            alt={principle.art.alt}
                            sizes="(max-width: 899px) 100vw, 62vw"
                            imgClassName="object-cover object-[50%_44%] transition-transform duration-[950ms] ease-premium group-hover:scale-[1.018]"
                          />

                          {/* Fade the image towards copy to avoid 'card beside text'. */}
                          <div
                            aria-hidden="true"
                            className={cn(
                              'absolute inset-0',
                              visualFirst
                                ? 'bg-[linear-gradient(90deg,transparent_74%,var(--depth-section-alt)_100%)]'
                                : 'bg-[linear-gradient(90deg,var(--depth-section-alt)_0%,transparent_26%)]',
                            )}
                          />

                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--depth-section-alt)]/35 to-transparent"
                          />
                        </figure>
                      </Reveal>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          05 — HOW WE WORK
          Sticky editorial production narrative.
         ========================================================= */}
      <section
        aria-labelledby="how-title"
        className="relative bg-[linear-gradient(180deg,var(--depth-page)_0%,var(--depth-section-alt)_10rem,var(--depth-section-alt)_calc(100%-10rem),var(--depth-page)_100%)] py-[clamp(7rem,11vw,11rem)]"
      >
        <div className="container-fnx grid gap-16 md:grid-cols-12 md:gap-10">
          {/* Sticky left narrative */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-height)+3.5rem)]">
              <Eyebrow rule>
                {process.eyebrow}
              </Eyebrow>

              <h2
                id="how-title"
                className="mt-6 max-w-[9ch] text-display text-white"
              >
                <HeadlineLines lines={process.headline} />
              </h2>

              <p className="mt-7 max-w-[30rem] text-lead text-text-secondary">
                {process.body}
              </p>

              {/* This visual gives the sticky side weight.
                  ProcessStages can later expose active-stage state and
                  switch this asset without altering the page structure. */}
              <Reveal className="mt-12 hidden max-w-[31rem] md:block">
                <figure className="group relative aspect-[5/4] overflow-hidden rounded-xl bg-raised">
                  <ResponsiveArt
                    src="/visual-fixtures/production/stage-motion.jpg"
                    alt="Animation timing and game symbol production study."
                    sizes="496px"
                    imgClassName="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.018]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgb(5_6_7/0.42)_100%)]"
                  />
                </figure>
              </Reveal>
            </div>
          </div>

          {/* Scrollable process */}
          <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
            <ProcessStages
              label="FNX production stages"
              stages={process.stages}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          06 — INSIDE THE WORK
          Evidence, not decoration.
         ========================================================= */}
      <section
        aria-labelledby="work-title"
        className="bg-[var(--depth-page)] py-[clamp(7rem,11vw,11rem)]"
      >
        <div className="container-fnx">
          <div className="grid gap-9 md:grid-cols-12 md:items-end md:gap-10">
            <div className="md:col-span-7">
              <Eyebrow rule>
                {work.eyebrow}
              </Eyebrow>

              <h2
                id="work-title"
                className="mt-6 max-w-[10ch] text-display text-white"
              >
                <HeadlineLines lines={work.headline} />
              </h2>
            </div>

            <p className="max-w-[33rem] text-lead text-text-secondary md:col-span-5 md:justify-self-end">
              {work.intro}
            </p>
          </div>

          {/* Asymmetric production evidence board. */}
          <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-12 md:gap-6">
            {work.gallery.map((item, index) => {
              const layout =
                workLayouts[index % workLayouts.length] ?? workLayouts[0];

              return (
                <Reveal
                  key={item.src}
                  delay={(index % 3) * 60}
                  className={layout.span}
                >
                  <figure className="group relative overflow-hidden rounded-xl bg-raised">
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        layout.aspect,
                      )}
                    >
                      <ResponsiveArt
                        src={item.src}
                        alt={item.alt}
                        sizes={
                          layout.span === 'md:col-span-12'
                            ? '(max-width: 899px) 100vw, 1376px'
                            : '(max-width: 899px) 100vw, 900px'
                        }
                        imgClassName="object-cover transition-transform duration-[950ms] ease-premium group-hover:scale-[1.025]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgb(3_4_5/0.76)_100%)]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 ring-1 ring-inset ring-white/[0.055]"
                      />
                    </div>

                    <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 px-5 py-5 md:px-7 md:py-7">
                      <span className="text-[0.7rem] font-semibold tracking-[0.19em] text-violet-300 uppercase">
                        {item.label}
                      </span>

                      <span className="max-w-[34rem] text-small text-white/72">
                        {item.caption}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          07 — THE STANDARD
          Quiet conclusion before the CTA.
         ========================================================= */}
      <section
        aria-labelledby="standard-title"
        className="relative isolate overflow-hidden bg-[var(--depth-section)] py-[clamp(8rem,13vw,13rem)]"
      >
        <div
          aria-hidden="true"
          className="fnx-diagonals pointer-events-none absolute inset-0 -z-20 opacity-[0.055]"
        />

        {/* Giant ghosted X — almost imperceptible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[3vw] -z-10 hidden -translate-y-1/2 select-none text-[31rem] leading-none font-black tracking-[-0.12em] text-violet-400/[0.024] lg:block"
        >
          X
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[30%] -z-10 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-violet-600/[0.045] blur-[130px]"
        />

        <div className="container-fnx">
          <div className="max-w-[65rem]">
            <Eyebrow
              rule
              className="text-violet-300"
            >
              {standard.eyebrow}
            </Eyebrow>

            <h2
              id="standard-title"
              className="mt-7 max-w-[13ch] text-display text-white"
            >
              {standard.headline}
            </h2>

            <p className="mt-9 max-w-[46rem] text-lead text-text-secondary">
              {standard.body}
            </p>

            {standard.closing ? (
              <p className="mt-11 max-w-[38rem] text-[clamp(1.35rem,1.05rem+0.9vw,2.1rem)] leading-[1.24] font-medium tracking-[-0.028em] text-white/88">
                {standard.closing}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* =========================================================
          08 — WORK WITH US
         ========================================================= */}
      <FinalCta
        eyebrow={cta.eyebrow}
        headline={cta.headline}
        body={cta.body}
        cta={cta.cta}
        placement="studio-closing"
      />
    </>
  );
}