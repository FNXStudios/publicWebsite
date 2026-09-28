import type { Metadata } from 'next';
import { studioConfig } from '@/config/studio.config';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { FinalCta } from '@/components/home/FinalCta';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Studio',
  description: studioConfig.intro.body[0],
  path: routes.studio,
});

export default function StudioPage() {
  const { intro, process, values, capabilities } = studioConfig;
  return (
    <>
      {/* Intro: statement beside a tall image */}
      <section
        aria-labelledby="studio-title"
        className="container-fnx grid gap-14 pt-[calc(var(--header-height)+4rem)] md:grid-cols-12 md:gap-6 md:pt-[calc(var(--header-height)+7rem)]"
      >
        <div className="md:col-span-6 md:pb-8 md:self-end">
          <Eyebrow className="enter-rise">{intro.eyebrow}</Eyebrow>
          <h1 id="studio-title" className="enter-rise mt-6 text-display-xl text-text [--enter-step:1]">
            <HeadlineLines lines={intro.headline} />
          </h1>
          <div className="enter-rise mt-8 max-w-[34rem] space-y-5 text-lead text-text-secondary [--enter-step:2]">
            {intro.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="enter-settle relative aspect-[4/5] overflow-hidden rounded-lg border border-border-subtle md:col-span-5 md:col-start-8">
          <ResponsiveArt src={intro.art.src} alt={intro.art.alt} priority sizes="(max-width: 899px) 100vw, 560px" />
        </div>
      </section>

      {/* How we work: sticky heading, numbered stages */}
      <section aria-labelledby="how-title" className="section-space">
        <div className="container-fnx grid gap-12 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-4">
            <div className="md:sticky md:top-[calc(var(--header-height)+3rem)]">
              <Eyebrow>{process.eyebrow}</Eyebrow>
              <h2 id="how-title" className="mt-5 text-display-md text-text">
                <HeadlineLines lines={process.headline} />
              </h2>
            </div>
          </Reveal>
          <ol className="md:col-span-7 md:col-start-6">
            {process.stages.map((stage, index) => (
              <Reveal
                as="li"
                key={stage.title}
                className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-t border-border-subtle py-8 last:border-b md:grid-cols-[4.5rem_13rem_1fr] md:gap-x-6"
              >
                <span aria-hidden="true" className="text-small font-semibold tabular-nums text-text-muted md:pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-title text-text">{stage.title}</h3>
                <p className="col-start-2 text-body text-text-secondary md:col-start-3 md:pt-0.5">{stage.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What we care about: large typographic list */}
      <section aria-labelledby="values-title" className="border-t border-border-subtle section-space">
        <div className="container-fnx">
          <Eyebrow>
            <span id="values-title">{values.eyebrow}</span>
          </Eyebrow>
          <ul className="mt-10 md:mt-14">
            {values.items.map((value, index) => (
              <Reveal
                as="li"
                key={value.title}
                delay={index * 60}
                className="flex flex-col gap-3 border-b border-border-subtle py-7 md:flex-row md:items-baseline md:justify-between md:gap-12 md:py-9"
              >
                <h3 className="text-display-md text-text">{value.title}</h3>
                <p className="max-w-[26rem] text-body text-text-secondary md:text-right">{value.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Production capabilities: technology as supporting credibility */}
      <section aria-labelledby="capabilities-title" className="section-space pt-0">
        <div className="container-fnx grid gap-12 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-4">
            <Eyebrow>{capabilities.eyebrow}</Eyebrow>
            <h2 id="capabilities-title" className="mt-5 text-display-md text-text">
              {capabilities.headline}
            </h2>
            <p className="mt-6 text-body text-text-secondary">{capabilities.body}</p>
          </Reveal>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:col-span-7 md:col-start-6 md:pt-2">
            {capabilities.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={(index % 2) * 90} className="border-t border-border-subtle pt-5">
                <h3 className="text-body font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-small text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
