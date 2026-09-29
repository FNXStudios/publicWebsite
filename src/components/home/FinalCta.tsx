import { homeConfig } from '@/config/home.config';
import type { ContactAction } from '@/config/content.types';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Eyebrow } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

interface FinalCtaProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  cta?: ContactAction;
  placement?: string;
}

/** Contained close: dark raised surface, violet light from one side, faint FNX geometry. */
export function FinalCta({
  eyebrow = homeConfig.finalCta.eyebrow,
  headline = homeConfig.finalCta.headline,
  body = homeConfig.finalCta.body,
  cta = homeConfig.finalCta.cta,
  placement = 'final-cta',
}: FinalCtaProps) {
  return (
    <section aria-labelledby="final-cta-title" className="pb-20 md:pb-24">
      <div className="container-fnx">
        <Reveal className="grain relative isolate overflow-hidden rounded-xl border border-white/[0.09] bg-raised px-6 py-12 sm:px-12 md:px-16 md:py-[4.25rem]">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_26rem_at_100%_50%,rgb(113_52_244/0.24),transparent_70%),radial-gradient(16rem_14rem_at_100%_50%,rgb(185_155_255/0.12),transparent_70%)]" />
          <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
          <div className="relative z-10 flex flex-col gap-9 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-[38rem]">
              <Eyebrow rule className="text-violet-300">
                {eyebrow}
              </Eyebrow>
              <h2 id="final-cta-title" className="mt-5 text-display text-white">
                {headline}
              </h2>
              <p className="mt-5 max-w-[32rem] text-lead text-text-secondary">{body}</p>
            </div>
            <ContactTrigger size="lg" placement={placement} interest={cta.interest} className="self-start md:self-auto">
              {cta.label}
            </ContactTrigger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
