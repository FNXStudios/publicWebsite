import { homeConfig } from '@/config/home.config';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Container } from '@/components/layout/Container';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * The commercial narrative. The section is full width; the delivery world is
 * atmosphere, not an illustration in a column — on desktop it fills the right ~58%
 * and runs off the viewport edge, fading into the page on its left. Copy (~42%) and
 * the capability row stay on the wide grid, with a clear gap between them.
 */
export function Operators() {
  const { operators } = homeConfig;
  return (
    <section aria-labelledby="operators-title" className="relative isolate w-full overflow-hidden bg-(--tone-operators) md:pt-sec-md md:pb-sec-md">
      {/* Phones: the world opens the section. Desktop: a full-height layer on the right. */}
      <div aria-hidden="true" className="relative h-[12rem] sm:h-[16rem] md:absolute md:inset-y-0 md:right-0 md:-z-10 md:h-auto md:w-[58%]">
        <ResponsiveArt src={operators.art.src} alt="" sizes="(max-width: 899px) 100vw, 58vw" quality={80} imgClassName="object-[72%_50%] md:object-[88%_50%]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--tone-operators)_0%,rgb(4_5_6/0.7)_22%,rgb(4_5_6/0.12)_52%,transparent_75%)] md:block" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-(--tone-operators) to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-(--tone-operators) to-transparent md:h-1/3" />
      </div>

      <Container size="wide" className="relative pb-sec-md md:pb-0">
        <div className="grid-fnx">
          <div className="-mt-10 md:col-span-5 md:mt-0">
            <Eyebrow rule>{operators.eyebrow}</Eyebrow>
            <h2 id="operators-title" className="mt-5 text-display text-white">
              <HeadlineLines lines={operators.headline} />
            </h2>
            <p className="prose-side mt-6 text-lead text-text-secondary">{operators.body}</p>
            <ContactTrigger appearance="link" placement="home-operators" interest={operators.cta.interest} className="mt-7">
              {operators.cta.label}
            </ContactTrigger>
          </div>
        </div>

        <div className="grid-fnx mt-10 md:mt-14">
          <Reveal as="ul" className="grid gap-x-(--grid-gap) sm:grid-cols-3 md:col-span-7">
            {operators.capabilities.map((item, index) => (
              <li key={item.label} className="group relative border-t border-white/[0.09] py-5">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[520ms] ease-premium group-hover:w-full" />
                <div className="flex items-baseline gap-3">
                  <Index n={index + 1} className="text-violet-300/80" />
                  <h3 className="text-eyebrow text-white uppercase">{item.label}</h3>
                </div>
                <p className="mt-2 text-body text-text-secondary">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
