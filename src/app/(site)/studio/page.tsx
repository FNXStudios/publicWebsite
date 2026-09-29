import type { Metadata } from 'next';

import { FinalCta } from '@/components/home/FinalCta';
import { Container, FullBleed } from '@/components/layout/Container';
import { ProcessStages } from '@/components/studio/ProcessStages';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';

import { studioConfig } from '@/config/studio.config';

import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';

import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Studio',
  description: studioConfig.about.summary,
  path: routes.studio,
});

/**
 * Inside the work: four larger stories instead of many small tiles, on the wide grid.
 *   01 Symbol development (7) │ 02 Art direction (5)
 *   03 Motion + UI        (5) │ 04 Final build   (7)
 * In each row the 7-column item sets the height by aspect ratio and its partner
 * stretches to match. Phones stack in order.
 */
const galleryLayout = [
  { span: 'md:col-span-7', media: 'aspect-[16/10]', position: '50% 50%', sizes: '(max-width: 899px) 100vw, (max-width: 1600px) 57vw, 860px' },
  { span: 'md:col-span-5', media: 'aspect-[16/10] md:aspect-auto md:flex-1', position: '50% 50%', sizes: '(max-width: 899px) 100vw, (max-width: 1600px) 41vw, 610px' },
  { span: 'md:col-span-5', media: 'aspect-[16/10] md:aspect-auto md:flex-1', position: '30% 50%', sizes: '(max-width: 899px) 100vw, (max-width: 1600px) 41vw, 610px' },
  { span: 'md:col-span-7', media: 'aspect-[16/10]', position: '50% 50%', sizes: '(max-width: 899px) 100vw, (max-width: 1600px) 57vw, 860px' },
] as const;

export default function StudioPage() {
  const { about, reason, capabilities, thinking, process, work, standard, cta } = studioConfig;

  return (
    <>
      {/* 01 — WHO FNX IS · Type B editorial hero: typographic, centred, no image ---- */}
      <section aria-labelledby="studio-title" className="relative isolate w-full overflow-hidden bg-(--depth-page)">
        <FullBleed>
          <div className="absolute inset-0 bg-[radial-gradient(46rem_30rem_at_50%_-6%,rgb(113_52_244/0.13),transparent_72%),radial-gradient(40rem_26rem_at_8%_100%,rgb(240_189_114/0.04),transparent_72%)]" />
        </FullBleed>
        <Container
          size="content"
          className="flex min-h-[clamp(42.5rem,88vh,50rem)] flex-col items-center justify-center pt-[calc(var(--header-height)+3.5rem)] pb-sec-md text-center md:pt-[calc(var(--header-height)+5rem)]"
        >
          <Eyebrow rule className="enter-rise justify-center text-text-secondary">
            {about.eyebrow}
          </Eyebrow>
          <h1 id="studio-title" className="enter-rise mt-7 text-hero text-white [--enter-step:1]">
            <HeadlineLines lines={about.headline} />
          </h1>
          <div className="enter-rise measure-reading mt-10 space-y-6 text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-[1.68] text-text-secondary [--enter-step:2] md:mt-12">
            {about.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-text' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <p className="enter-rise mt-10 flex flex-col items-center gap-2 text-[0.75rem] font-semibold tracking-[0.2em] text-text-muted uppercase [--enter-step:3] sm:flex-row sm:gap-3 md:mt-12">
            {about.proof.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="hidden sm:inline">
                    ·
                  </span>
                ) : null}
                {item}
              </span>
            ))}
          </p>
        </Container>
      </section>

      {/* 02 — WHY FNX EXISTS · headline centred against the whole argument ----------- */}
      <section aria-labelledby="reason-title" className="w-full bg-(--depth-section) pt-sec-lg pb-sec-lg">
        <Container size="content" className="grid gap-y-10 md:grid-cols-2 md:items-center md:gap-x-(--gap-editorial)">
          <h2 id="reason-title" className="text-principle text-white">
            <HeadlineLines lines={reason.headline} />
          </h2>

          <Reveal>
            <p className="text-lead text-text-secondary">{reason.intro}</p>
            <p className="mt-9 border-l border-violet-400/70 pl-6 text-heading text-white md:mt-10 md:pl-8">{reason.statement}</p>
            <p className="mt-9 text-lead text-text-secondary md:mt-10">{reason.closing}</p>
          </Reveal>
        </Container>
      </section>

      {/* 03 — WHAT WE BUILD · full-width headline, three editorial lanes ------------- */}
      <section aria-labelledby="capabilities-title" className="w-full bg-(--depth-page) pt-sec-lg pb-sec-md">
        <Container size="wide">
          <Eyebrow rule>{capabilities.eyebrow}</Eyebrow>
          <h2 id="capabilities-title" className="mt-6 text-display text-white">
            {capabilities.headline}
          </h2>
          <p className="mt-7 max-w-[50rem] text-lead text-text-secondary md:mt-8">{capabilities.intro}</p>

          <ol className="mt-18 grid gap-x-(--grid-gap) gap-y-10 md:mt-24 md:grid-cols-3">
            {capabilities.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 60} className="group relative border-t border-white/[0.12] pt-7">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[560ms] ease-premium group-hover:w-full" />
                <Index n={index + 1} className="text-violet-300" />
                <h3 className="mt-5 text-heading text-white">{item.title}</h3>
                <p className="mt-4 max-w-[28rem] text-body text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 04 — HOW WE THINK · the largest editorial chapter; art breaks out of the grid */}
      <section aria-labelledby="thinking-title" className="w-full overflow-x-clip bg-(--depth-section-alt) pt-sec-xl pb-sec-lg">
        <Container size="wide">
          <div className="grid-fnx gap-y-6 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow rule>{thinking.eyebrow}</Eyebrow>
              <h2 id="thinking-title" className="mt-5 text-display text-white">
                <HeadlineLines lines={thinking.headline} />
              </h2>
            </div>
            <p className="prose-side text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-1">{thinking.intro}</p>
          </div>

          <ol className="mt-sec-md flex flex-col gap-y-[clamp(4.5rem,9vw,9rem)]">
            {thinking.principles.map((principle, index) => {
              const reverse = index % 2 === 1;
              return (
                <li
                  key={principle.label}
                  className={cn(
                    'grid gap-y-8 md:items-center md:gap-x-(--gap-editorial)',
                    reverse ? 'md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)]' : 'md:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]',
                  )}
                >
                  <Reveal className={cn(reverse && 'md:order-2')}>
                    <p className="flex items-center gap-3 text-eyebrow uppercase">
                      <Index n={index + 1} className="text-violet-300" />
                      <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                      <span className="text-text-secondary">{principle.label}</span>
                    </p>
                    <h3 className="mt-6 text-principle text-white">{principle.title}</h3>
                    <p className="mt-6 max-w-[34rem] text-lead text-text-secondary">{principle.body}</p>
                  </Reveal>
                  <Reveal
                    as="figure"
                    className={cn(
                      'relative aspect-[4/3] overflow-hidden rounded-xl bg-raised md:aspect-[16/10]',
                      reverse ? 'md:order-1 md:breakout-left md:rounded-l-none' : 'md:breakout-right md:rounded-r-none',
                    )}
                  >
                    <ResponsiveArt src={principle.art.src} alt={principle.art.alt} sizes="(max-width: 899px) 100vw, 64vw" quality={80} />
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 05 — HOW WE WORK · sticky narrative (lg+) beside the production stages ------ */}
      <section aria-labelledby="how-title" className="w-full bg-(--depth-page) pt-sec-lg pb-sec-md">
        <Container size="wide" className="grid-fnx gap-y-14">
          <div className="md:col-span-5 lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start">
            <h2 id="how-title" className="text-display text-white lg:text-display-xl">
              <HeadlineLines lines={process.headline} />
            </h2>
            <p className="mt-7 max-w-[32rem] text-lead text-text-secondary md:mt-8">{process.body}</p>
            <Reveal as="figure" className="relative mt-10 aspect-[16/10] overflow-hidden rounded-xl bg-raised md:mt-12">
              <ResponsiveArt src={process.art.src} alt={process.art.alt} sizes="(max-width: 899px) 100vw, (max-width: 1600px) 40vw, 600px" imgClassName="object-[50%_50%]" />
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ProcessStages label="FNX production stages" stages={process.stages} />
          </div>
        </Container>
      </section>

      {/* 06 — INSIDE THE WORK · four larger stories -------------------------------- */}
      <section aria-labelledby="work-title" className="w-full bg-(--depth-section) pt-sec-md pb-sec-md">
        <Container size="wide">
          <div className="grid-fnx gap-y-6 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow rule>{work.eyebrow}</Eyebrow>
              <h2 id="work-title" className="mt-5 text-display text-white">
                <HeadlineLines lines={work.headline} />
              </h2>
            </div>
            <p className="prose-side text-lead text-text-secondary md:col-span-4 md:col-start-9 md:pb-1">{work.intro}</p>
          </div>

          <ol className="grid-fnx mt-14 gap-y-12 md:mt-20 md:gap-y-(--grid-gap)">
            {work.gallery.map((item, index) => {
              const layout = galleryLayout[index] ?? galleryLayout[0];
              return (
                <Reveal as="li" key={item.src} delay={(index % 2) * 60} className={cn('flex flex-col', layout.span)}>
                  <figure className="group flex flex-1 flex-col">
                    <div className={cn('relative overflow-hidden rounded-lg bg-raised', layout.media)}>
                      <ResponsiveArt
                        src={item.src}
                        alt={item.alt}
                        sizes={layout.sizes}
                        objectPosition={layout.position}
                        imgClassName="transition-transform duration-[700ms] ease-premium group-hover:scale-[1.015]"
                      />
                    </div>
                    <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-small">
                      <span className="font-semibold tracking-[0.14em] text-violet-300 uppercase tabular-nums">
                        {String(index + 1).padStart(2, '0')} {item.label}
                      </span>
                      <span className="text-text-muted">{item.caption}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 07 — THE STANDARD · a quiet reset before contact -------------------------- */}
      <section aria-labelledby="standard-title" className="w-full bg-(--depth-page) pt-sec-lg pb-sec-md">
        <Container size="content" className="text-center">
          <Reveal>
            <Eyebrow className="justify-center">{standard.eyebrow}</Eyebrow>
            <h2 id="standard-title" className="mt-7 text-display text-white">
              <HeadlineLines lines={standard.headline} />
            </h2>
            <p className="mx-auto mt-7 max-w-[34rem] text-lead text-text-secondary">{standard.body}</p>
          </Reveal>
        </Container>
      </section>

      {/* 08 — CONTACT ------------------------------------------------------------ */}
      <FinalCta headline={cta.headline} body={cta.body} cta={cta.cta} placement="studio-closing" />
    </>
  );
}
