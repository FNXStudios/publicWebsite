import { homeConfig } from '@/config/home.config';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { TextLink } from '@/components/ui/TextLink';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/** Full-bleed atmospheric band; claims kept to what FNX can stand behind. */
export function Operators() {
  const { operators } = homeConfig;
  return (
    <section aria-labelledby="operators-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <ResponsiveArt
          src={operators.art.src}
          alt=""
          sizes="100vw"
          imgClassName="object-[68%_70%] opacity-90 md:object-[60%_60%]"
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,var(--color-bg),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--color-bg),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(6_7_8/0.7),transparent_60%)]" />
      </div>

      <div className="container-fnx pt-(--section-space) pb-[calc(var(--section-space)*0.8)]">
        <Reveal className="max-w-[40rem]">
          <Eyebrow>{operators.eyebrow}</Eyebrow>
          <h2 id="operators-title" className="mt-5 text-display-lg text-text">
            <HeadlineLines lines={operators.headline} />
          </h2>
          <p className="mt-8 max-w-[32rem] text-lead text-text-secondary">{operators.body}</p>
          <TextLink
            href={operators.cta.href}
            event={{ name: 'partner_cta_clicked', props: { placement: 'home-operators' } }}
            className="mt-8"
          >
            {operators.cta.label}
          </TextLink>
        </Reveal>

        <ul className="mt-24 grid gap-10 sm:grid-cols-3 sm:gap-6 md:mt-40">
          {operators.points.map((point, index) => (
            <Reveal as="li" key={point.title} delay={index * 90} className="border-l border-border pl-5 md:pl-6">
              <h3 className="text-body font-semibold text-text">{point.title}</h3>
              <p className="mt-2 max-w-[20rem] text-small text-text-secondary">{point.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
