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
  title: 'About',
  description: studioConfig.about.summary,
  path: routes.studio,
});

export default function StudioPage() {
  const { about, reason, capabilities, thinking, process, work, standard, cta } = studioConfig;

  return (
    <>
      {/* 01 — WHO FNX IS · centered manifesto opener */}
      <section aria-labelledby="studio-title" className="relative isolate w-full overflow-hidden bg-(--depth-page)">
        <FullBleed>
          <div className="absolute inset-0 bg-[radial-gradient(36rem_24rem_at_50%_-6%,rgb(113_52_244/0.11),transparent_72%),radial-gradient(28rem_20rem_at_8%_100%,rgb(240_189_114/0.04),transparent_72%)]" />
        </FullBleed>
        <Container
          size="wide"
          className="flex flex-col items-center pt-[calc(var(--header-height)+3rem)] pb-sec-md text-center md:pt-[calc(var(--header-height)+4.5rem)]"
        >
          <Eyebrow rule className="enter-rise justify-center text-text-secondary">
            {about.eyebrow}
          </Eyebrow>
          <h1 id="studio-title" className="enter-rise mt-5 text-hero text-white [--enter-step:1]">
            <HeadlineLines lines={about.headline} />
          </h1>
          <div className="enter-rise measure-reading mt-7 space-y-4 text-lead text-text-secondary [--enter-step:2] md:mt-8">
            {about.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-text' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <p className="enter-rise mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.75rem] font-semibold tracking-[0.2em] text-text-muted uppercase [--enter-step:3]">
            {about.proof.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                {item}
              </span>
            ))}
          </p>
        </Container>
      </section>

      {/* 02 — WHY FNX EXISTS */}
      <section aria-labelledby="reason-title" className="w-full bg-(--depth-section) pt-sec-md pb-sec-md">
        <Container size="wide" className="grid gap-y-8 md:grid-cols-2 md:items-start md:gap-x-10">
          <h2 id="reason-title" className="text-display-sm text-white md:text-display">
            <HeadlineLines lines={reason.headline} />
          </h2>

          <Reveal>
            <p className="text-lead text-text-secondary">{reason.intro}</p>
            <p className="mt-6 border-l border-violet-400/70 pl-5 text-title text-white md:pl-6">{reason.statement}</p>
            <p className="mt-6 text-lead text-text-secondary">{reason.closing}</p>
          </Reveal>
        </Container>
      </section>

      {/* 03 — WHAT WE BUILD */}
      <section aria-labelledby="capabilities-title" className="w-full bg-(--depth-page) pt-sec-md pb-sec-md">
        <Container size="wide">
          <Eyebrow rule>{capabilities.eyebrow}</Eyebrow>
          <h2 id="capabilities-title" className="mt-4 text-display-sm text-white md:text-display">
            {capabilities.headline}
          </h2>
          <p className="mt-5 max-w-[40rem] text-lead text-text-secondary">{capabilities.intro}</p>

          <ol className="mt-10 grid gap-x-(--grid-gap) gap-y-8 md:grid-cols-3">
            {capabilities.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 60} className="group relative border-t border-white/[0.12] pt-5">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[560ms] ease-premium group-hover:w-full" />
                <Index n={index + 1} className="text-violet-300" />
                <h3 className="mt-4 text-title text-white">{item.title}</h3>
                <p className="mt-3 max-w-[24rem] text-body text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 04 — HOW WE THINK · contained pairs, no breakout */}
      <section aria-labelledby="thinking-title" className="w-full bg-(--depth-section-alt) pt-sec-md pb-sec-md">
        <Container size="wide">
          <div className="grid gap-y-5 md:grid-cols-12 md:items-end md:gap-x-(--grid-gap)">
            <div className="md:col-span-7">
              <Eyebrow rule>{thinking.eyebrow}</Eyebrow>
              <h2 id="thinking-title" className="mt-4 text-display-sm text-white md:text-display">
                <HeadlineLines lines={thinking.headline} />
              </h2>
            </div>
            <p className="text-lead text-text-secondary md:col-span-5 md:pb-1">{thinking.intro}</p>
          </div>

          <ol className="mt-10 flex flex-col gap-y-10 md:gap-y-12">
            {thinking.principles.map((principle, index) => {
              const reverse = index % 2 === 1;
              return (
                <li
                  key={principle.label}
                  className={cn('grid gap-y-5 md:items-center md:gap-x-8', reverse ? 'md:grid-cols-[1.1fr_1fr]' : 'md:grid-cols-[1fr_1.1fr]')}
                >
                  <Reveal className={cn(reverse && 'md:order-2')}>
                    <p className="flex items-center gap-3 text-eyebrow uppercase">
                      <Index n={index + 1} className="text-violet-300" />
                      <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                      <span className="text-text-secondary">{principle.label}</span>
                    </p>
                    <h3 className="mt-4 text-heading text-white">{principle.title}</h3>
                    <p className="mt-4 max-w-[30rem] text-body text-text-secondary">{principle.body}</p>
                  </Reveal>
                  <Reveal as="figure" className={cn('relative aspect-[16/10] max-h-[20rem] overflow-hidden rounded-md bg-raised', reverse && 'md:order-1')}>
                    <ResponsiveArt src={principle.art.src} alt={principle.art.alt} sizes="(max-width: 899px) 100vw, 40vw" quality={80} />
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 05 — HOW WE WORK */}
      <section aria-labelledby="how-title" className="w-full bg-(--depth-page) pt-sec-md pb-sec-md">
        <Container size="wide" className="grid gap-y-10 md:grid-cols-12 md:gap-x-(--grid-gap)">
          <div className="md:col-span-5 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <h2 id="how-title" className="text-display-sm text-white md:text-display">
              <HeadlineLines lines={process.headline} />
            </h2>
            <p className="mt-5 max-w-[28rem] text-lead text-text-secondary">{process.body}</p>
            <Reveal as="figure" className="relative mt-7 aspect-[16/10] max-h-[16rem] overflow-hidden rounded-md bg-raised">
              <ResponsiveArt src={process.art.src} alt={process.art.alt} sizes="(max-width: 899px) 100vw, 32vw" imgClassName="object-[50%_50%]" />
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ProcessStages label="FNX production stages" stages={process.stages} />
          </div>
        </Container>
      </section>

      {/* 06 — INSIDE THE WORK · even 2×2 grid */}
      <section aria-labelledby="work-title" className="w-full bg-(--depth-section) pt-sec-md pb-sec-md">
        <Container size="wide">
          <div className="grid gap-y-5 md:grid-cols-12 md:items-end md:gap-x-(--grid-gap)">
            <div className="md:col-span-7">
              <Eyebrow rule>{work.eyebrow}</Eyebrow>
              <h2 id="work-title" className="mt-4 text-display-sm text-white md:text-display">
                <HeadlineLines lines={work.headline} />
              </h2>
            </div>
            <p className="text-lead text-text-secondary md:col-span-5 md:pb-1">{work.intro}</p>
          </div>

          <ol className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-10 md:gap-(--grid-gap)">
            {work.gallery.map((item, index) => (
              <Reveal as="li" key={item.src} delay={(index % 2) * 60}>
                <figure className="group">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-raised">
                    <ResponsiveArt
                      src={item.src}
                      alt={item.alt}
                      sizes="(max-width: 639px) 100vw, (max-width: 1600px) 40vw, 560px"
                      objectPosition={index === 2 ? '30% 50%' : '50% 50%'}
                      imgClassName="transition-transform duration-[700ms] ease-premium group-hover:scale-[1.015]"
                    />
                  </div>
                  <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-small">
                    <span className="font-semibold tracking-[0.14em] text-violet-300 uppercase tabular-nums">
                      {String(index + 1).padStart(2, '0')} {item.label}
                    </span>
                    <span className="text-text-muted">{item.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 07 — THE STANDARD */}
      <section aria-labelledby="standard-title" className="w-full bg-(--depth-page) pt-sec-md pb-sec-md">
        <Container size="wide">
          <Reveal>
            <Eyebrow rule>{standard.eyebrow}</Eyebrow>
            <h2 id="standard-title" className="mt-5 text-display-sm text-white md:text-display">
              <HeadlineLines lines={standard.headline} />
            </h2>
            <p className="mt-5 max-w-[36rem] text-lead text-text-secondary">{standard.body}</p>
          </Reveal>
        </Container>
      </section>

      <FinalCta headline={cta.headline} body={cta.body} cta={cta.cta} placement="studio-closing" />
    </>
  );
}
