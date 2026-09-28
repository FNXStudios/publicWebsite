import { homeConfig } from '@/config/home.config';
import { Section } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** A wide headline over a large visual, with the copy tucked beside it. */
export function Process() {
  const { process } = homeConfig;
  return (
    <Section labelledBy="process-title" className="border-t border-border-subtle">
      <div className="container-fnx">
        <Reveal>
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 id="process-title" className="mt-5 text-display-lg text-text">
            <HeadlineLines lines={process.headline} />
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
          <Reveal as="figure" className="md:col-span-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-surface">
              <ResponsiveArt
                src={process.art.src}
                alt={process.art.alt}
                sizes="(max-width: 899px) 100vw, 900px"
              />
            </div>
            <figcaption className="mt-4 text-small text-text-muted">{process.caption}</figcaption>
          </Reveal>

          <Reveal delay={100} className="flex flex-col md:col-span-4 md:col-start-9 md:justify-end md:pb-10">
            <p className="text-lead text-text-secondary">{process.body}</p>
            <ol className="mt-10 border-t border-border-subtle" aria-label="Production stages">
              {process.stages.map((stage, index) => (
                <li
                  key={stage}
                  className="flex items-baseline gap-4 border-b border-border-subtle py-3.5 text-small text-text"
                >
                  <span aria-hidden="true" className="w-6 text-[0.6875rem] font-semibold tabular-nums text-text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {stage}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
