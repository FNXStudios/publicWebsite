import type { Metadata } from 'next';

import { FinalCta } from '@/components/home/FinalCta';
import { Container } from '@/components/layout/Container';
import { PageIntro } from '@/components/layout/PageIntro';
import { ProcessStages } from '@/components/studio/ProcessStages';
import { MediaFrame, type MediaSlot } from '@/components/ui/MediaFrame';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';

import { studioConfig } from '@/config/studio.config';

import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';

import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: studioConfig.about.summary,
  path: routes.studio,
});

const DETAIL_SUPPORT = {
  src: '/visual-fixtures/production/animation-frames.jpg',
  alt: 'Onion-skinned animation frames of a symbol landing, with the timing curve underneath.',
};

function gallerySlot(index: number, total: number): MediaSlot {
  return index === 0 || index === total - 1 ? 'archiveWide' : 'archive';
}

export default function StudioPage() {
  const { about, reason, capabilities, thinking, process, work, standard, cta } = studioConfig;
  const principles = thinking.principles.slice(0, 3);
  const detail = thinking.principles[3];

  return (
    <>
      <PageIntro
        id="studio-title"
        layout="centered"
        eyebrow={about.eyebrow}
        headline={about.headline}
        body={
          <>
            {about.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-text' : undefined}>
                {paragraph}
              </p>
            ))}
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-2 text-[0.75rem] font-semibold tracking-[0.16em] text-text-muted uppercase">
              {about.proof.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-3">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  {item}
                </span>
              ))}
            </p>
          </>
        }
      />

      <div className="page-flow">
        <section aria-labelledby="reason-title" className="w-full bg-(--depth-section)">
          <Container size="wide">
            <h2 id="reason-title" className="text-display text-white">
              <HeadlineLines lines={reason.headline} />
            </h2>
            <div className="mt-header grid-fnx items-start gap-y-6">
              <p className="border-l border-violet-400/70 pl-5 text-title text-white md:col-span-6 md:pl-6">{reason.statement}</p>
              <div className="space-y-4 text-lead text-text-secondary md:col-span-5 md:col-start-8">
                <p>{reason.intro}</p>
                <p>{reason.closing}</p>
              </div>
            </div>
          </Container>
        </section>

        <section aria-labelledby="capabilities-title" className="w-full bg-(--depth-page)">
          <Container size="wide">
            <Eyebrow rule>{capabilities.eyebrow}</Eyebrow>
            <h2 id="capabilities-title" className="mt-4 text-display text-white">
              {capabilities.headline}
            </h2>
            <p className="mt-5 max-w-[40rem] text-lead text-text-secondary">{capabilities.intro}</p>

            <ol className="mt-header grid gap-(--grid-gap) md:grid-cols-3">
              {capabilities.items.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 60} className="flex flex-col">
                  <MediaFrame slot="production">
                    <ResponsiveArt src={item.art.src} alt={item.art.alt} sizes="(max-width: 767px) 100vw, 30vw" quality={80} />
                  </MediaFrame>
                  <Index n={index + 1} className="mt-5 text-violet-300" />
                  <h3 className="mt-3 text-title text-white">{item.title}</h3>
                  <p className="mt-3 text-body text-text-secondary">{item.body}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="thinking-title" className="w-full bg-(--depth-section-alt)">
          <Container size="wide">
            <div className="grid-fnx items-end gap-y-5">
              <div className="md:col-span-7">
                <Eyebrow rule>{thinking.eyebrow}</Eyebrow>
                <h2 id="thinking-title" className="mt-4 text-display text-white">
                  <HeadlineLines lines={thinking.headline} />
                </h2>
              </div>
              <p className="text-lead text-text-secondary md:col-span-5">{thinking.intro}</p>
            </div>

            <ol className="mt-header grid gap-x-(--grid-gap) gap-y-8 md:grid-cols-3">
              {principles.map((principle, index) => (
                <li key={principle.label}>
                  <p className="flex items-center gap-3 text-eyebrow uppercase">
                    <Index n={index + 1} className="text-violet-300" />
                    <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                    <span className="text-text-secondary">{principle.label}</span>
                  </p>
                  <h3 className="mt-3 text-title text-white">{principle.title}</h3>
                  <p className="mt-3 text-body text-text-secondary">{principle.body}</p>
                </li>
              ))}
            </ol>

            <ul className="mt-header grid gap-(--grid-gap) md:grid-cols-3">
              {principles.map((principle) => (
                <li key={principle.art.src}>
                  <MediaFrame slot="production">
                    <ResponsiveArt src={principle.art.src} alt={principle.art.alt} sizes="(max-width: 767px) 100vw, 30vw" quality={80} />
                  </MediaFrame>
                </li>
              ))}
            </ul>

            {detail ? (
              <div className="mt-(--space-tight) border-t border-white/[0.08] pt-(--space-tight)">
                <div className="grid-fnx items-start gap-y-8">
                  <div className="md:col-span-5">
                    <p className="flex items-center gap-3 text-eyebrow uppercase">
                      <Index n={4} className="text-violet-300" />
                      <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                      <span className="text-text-secondary">{detail.label}</span>
                    </p>
                    <h3 className="mt-3 text-heading text-white">{detail.title}</h3>
                    <p className="prose-measure mt-4 text-body text-text-secondary">{detail.body}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-(--grid-gap) md:col-span-6 md:col-start-7">
                    <MediaFrame slot="archive">
                      <ResponsiveArt src={detail.art.src} alt={detail.art.alt} sizes="(max-width: 899px) 46vw, 22vw" quality={80} />
                    </MediaFrame>
                    <MediaFrame slot="archive">
                      <ResponsiveArt src={DETAIL_SUPPORT.src} alt={DETAIL_SUPPORT.alt} sizes="(max-width: 899px) 46vw, 22vw" quality={80} />
                    </MediaFrame>
                  </div>
                </div>
              </div>
            ) : null}
          </Container>
        </section>

        <section aria-labelledby="how-title" className="w-full bg-(--depth-page)">
          <Container size="wide" className="grid-fnx items-start gap-y-10">
            <div className="md:col-span-5">
              <h2 id="how-title" className="text-display text-white">
                <HeadlineLines lines={process.headline} />
              </h2>
              <p className="prose-measure mt-5 text-lead text-text-secondary">{process.body}</p>
              <MediaFrame slot="device" className="mt-header">
                <ResponsiveArt src={process.art.src} alt={process.art.alt} sizes="(max-width: 899px) 100vw, 36vw" quality={80} />
              </MediaFrame>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <ProcessStages label="FNX production stages" stages={process.stages} />
            </div>
          </Container>
        </section>

        <section aria-labelledby="work-title" className="w-full bg-(--depth-section)">
          <Container size="wide">
            <div className="grid-fnx items-end gap-y-5">
              <div className="md:col-span-7">
                <Eyebrow rule>{work.eyebrow}</Eyebrow>
                <h2 id="work-title" className="mt-4 text-display text-white">
                  <HeadlineLines lines={work.headline} />
                </h2>
              </div>
              <p className="text-lead text-text-secondary md:col-span-5">{work.intro}</p>
            </div>

            <ol className="mt-header grid gap-x-(--grid-gap) gap-y-8 md:grid-cols-12">
              {work.gallery.map((item, index) => {
                const wide = index === 0 || index === work.gallery.length - 1;
                return (
                  <Reveal as="li" key={item.src} delay={(index % 2) * 40} className={wide ? 'md:col-span-12' : 'md:col-span-6'}>
                    <figure>
                      <MediaFrame slot={gallerySlot(index, work.gallery.length)}>
                        <ResponsiveArt
                          src={item.src}
                          alt={item.alt}
                          sizes={wide ? '(max-width: 1440px) 100vw, 1280px' : '(max-width: 767px) 100vw, 50vw'}
                          objectPosition={index === 2 ? '30% 50%' : '50% 50%'}
                          imgClassName="transition-transform duration-[700ms] ease-premium hover:scale-[1.02]"
                        />
                      </MediaFrame>
                      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-small">
                        <span className="font-semibold tracking-[0.14em] text-violet-300 uppercase tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                        <span className="font-medium text-text">{item.label}</span>
                        <span className="text-text-muted">{item.caption}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                );
              })}
            </ol>

            <div className="mt-(--space-tight) border-t border-white/[0.08] pt-(--space-tight)">
              <Eyebrow rule>{standard.eyebrow}</Eyebrow>
              <h2 id="standard-title" className="mt-4 text-display text-white">
                <HeadlineLines lines={standard.headline} />
              </h2>
              <p className="mt-4 max-w-[36rem] text-lead text-text-secondary">{standard.body}</p>
            </div>
          </Container>
        </section>

        <FinalCta headline={cta.headline} body={cta.body} cta={cta.cta} placement="studio-closing" />
      </div>
    </>
  );
}
