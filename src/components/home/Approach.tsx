import { homeConfig } from '@/config/home.config';
import { Section } from '@/components/layout/Container';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** Editorial statement on the left; capabilities as a compact ruled index on the right. */
export function Approach() {
  const { approach } = homeConfig;
  return (
    <Section labelledBy="approach-title" spacing="none" className="bg-(--tone-approach) pt-large pb-medium">
      <div className="container-fnx grid gap-12 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5">
          <Eyebrow>{approach.eyebrow}</Eyebrow>
          <h2 id="approach-title" className="mt-5 text-display-lg text-text">
            <HeadlineLines lines={approach.headline} />
          </h2>
          <p className="mt-7 max-w-[28rem] text-lead text-text-secondary">{approach.body}</p>
        </Reveal>

        <ol className="self-end border-b border-border-subtle md:col-span-6 md:col-start-7">
          {approach.capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.title}
              delay={index * 80}
              className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 border-t border-border-subtle py-7 transition-colors duration-(--duration-standard) hover:border-border-active md:grid-cols-[3.5rem_minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-baseline md:gap-x-6 md:py-8"
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-[2px] w-0 bg-accent-text transition-[width] duration-(--duration-standard) ease-premium group-hover:w-12"
              />
              <span aria-hidden="true" className="text-[0.8125rem] font-semibold tabular-nums text-accent-text/60 transition-colors duration-(--duration-standard) group-hover:text-accent-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.018em] text-text/90 transition-colors duration-(--duration-standard) group-hover:text-white">
                {capability.title}
              </h3>
              <p className="col-start-2 max-w-[26rem] text-[0.9375rem] leading-[1.6] text-text-secondary md:col-start-3">{capability.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
