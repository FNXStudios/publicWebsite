import { homeConfig } from '@/config/home.config';
import { Section } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** One dominant, tactile visual with the story told beside it. */
export function Process() {
  const { process } = homeConfig;
  return (
    <Section
      labelledBy="process-title"
      spacing="none"
      className="grain relative pt-large pb-large bg-[linear-gradient(180deg,var(--tone-approach)_0%,var(--tone-process)_16rem,var(--tone-process)_calc(100%-12rem),var(--tone-operators)_100%)]"
    >
      <div className="container-fnx relative z-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-7">
            <Eyebrow>{process.eyebrow}</Eyebrow>
            <h2 id="process-title" className="mt-5 text-display-lg text-text">
              <HeadlineLines lines={process.headline} />
            </h2>
          </Reveal>
          <Reveal delay={80} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="text-lead text-text-secondary">{process.body}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-6">
          <Reveal as="figure" className="md:col-span-8">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/[0.07] bg-surface shadow-[0_40px_80px_-50px_rgb(0_0_0/0.9)]">
              <ResponsiveArt
                src={process.art.src}
                alt={process.art.alt}
                sizes="(max-width: 899px) 100vw, 900px"
                imgClassName="transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.015]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_45%,transparent_55%,rgb(6_7_9/0.45))]" />
            </div>
            <figcaption className="mt-4 text-small text-text-muted">{process.caption}</figcaption>
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-10 md:col-span-4 md:col-start-9 md:justify-between">
            <ol className="border-t border-border-subtle" aria-label="Production stages">
              {process.stages.map((stage, index) => (
                <li
                  key={stage}
                  className="group flex items-baseline gap-4 border-b border-border-subtle py-[1.125rem] text-body font-medium text-text-secondary transition-colors duration-(--duration-standard) hover:text-text"
                >
                  <span aria-hidden="true" className="w-7 text-[0.75rem] font-semibold tabular-nums text-accent-text/60 transition-colors group-hover:text-accent-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="transition-transform duration-(--duration-standard) ease-premium group-hover:translate-x-1">{stage}</span>
                </li>
              ))}
            </ol>
            <figure className="hidden md:block">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[0.75rem] border border-white/[0.07] bg-surface">
                <ResponsiveArt
                  src={process.detail.src}
                  alt={process.detail.alt}
                  sizes="420px"
                  imgClassName="object-[50%_30%] transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-3 text-small text-text-muted">{process.detail.caption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
