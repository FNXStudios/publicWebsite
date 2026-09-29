import { homeConfig } from '@/config/home.config';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';
import { NetworkVisual } from './NetworkVisual';

/** Built for real play: operator credibility with depth, claims kept to what FNX can stand behind. */
export function Operators() {
  const { operators } = homeConfig;
  return (
    <section aria-labelledby="operators-title" className="relative isolate overflow-hidden pt-tight pb-large bg-(--tone-operators)">
      {/* Cool atmosphere on the right; the section reads cooler than the warm studio sections. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(46rem_38rem_at_78%_42%,rgb(58_74_154/0.2),transparent_70%),radial-gradient(28rem_24rem_at_92%_80%,rgb(113_52_244/0.12),transparent_70%)]" />
      <NetworkVisual className="pointer-events-none absolute top-8 right-[-18%] -z-10 w-[62rem] max-w-none opacity-45 sm:right-[-10%] md:top-1/2 md:right-[-6%] md:w-[58%] md:-translate-y-[55%] md:opacity-100" />

      <div className="container-fnx">
        <div className="max-w-[40rem] md:max-w-[46%]">
          <Eyebrow rule>{operators.eyebrow}</Eyebrow>
          <h2 id="operators-title" className="mt-5 text-display text-white">
            <HeadlineLines lines={operators.headline} />
          </h2>
          <p className="mt-7 max-w-[30rem] text-lead text-text-secondary">{operators.body}</p>
          <ContactTrigger appearance="link" placement="home-operators" interest={operators.cta.interest} className="mt-7">
            {operators.cta.label}
          </ContactTrigger>
        </div>

        <Reveal as="ul" className="mt-14 grid gap-x-8 gap-y-2 sm:grid-cols-3 md:mt-20 md:max-w-[58%]">
          {operators.capabilities.map((item, index) => (
            <li key={item.label} className="group relative border-t border-white/[0.09] py-6">
              <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[520ms] ease-premium group-hover:w-full" />
              <div className="flex items-baseline gap-4">
                <Index n={index + 1} className="text-violet-300/80 transition-colors group-hover:text-violet-300" />
                <div>
                  <h3 className="text-eyebrow text-white uppercase">{item.label}</h3>
                  <p className="mt-2.5 text-body text-text-secondary">{item.body}</p>
                </div>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
