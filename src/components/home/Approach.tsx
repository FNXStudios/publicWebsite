import { homeConfig } from '@/config/home.config';
import { Section } from '@/components/layout/Container';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** Editorial statement on the left; capabilities as a ruled list on the right. */
export function Approach() {
  const { approach } = homeConfig;
  return (
    <Section labelledBy="approach-title">
      <div className="container-fnx grid gap-14 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5">
          <Eyebrow>{approach.eyebrow}</Eyebrow>
          <h2 id="approach-title" className="mt-5 text-display-lg text-text">
            <HeadlineLines lines={approach.headline} />
          </h2>
          <p className="mt-8 max-w-[28rem] text-lead text-text-secondary">{approach.body}</p>
        </Reveal>

        <ol className="border-b border-border-subtle md:col-span-6 md:col-start-7 md:mt-2">
          {approach.capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.title}
              delay={index * 90}
              className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-border-subtle py-8 md:grid-cols-[4.5rem_1fr] md:py-10"
            >
              <span aria-hidden="true" className="pt-1.5 text-small font-semibold tabular-nums text-text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-title text-text">{capability.title}</h3>
                <p className="mt-3 max-w-[30rem] text-body text-text-secondary">{capability.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
