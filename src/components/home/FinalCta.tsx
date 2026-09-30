import { homeConfig } from '@/config/home.config';
import type { ContactAction } from '@/config/content.types';
import { cn } from '@/lib/cn';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

interface FinalCtaProps {
  eyebrow?: string;
  headline?: string;
  body?: string;
  cta?: ContactAction;
  placement?: string;
  className?: string;
}

/** Closing panel. One width, one type scale, one padding — every page. */
export function FinalCta({
  eyebrow,
  headline = homeConfig.finalCta.headline,
  body = homeConfig.finalCta.body,
  cta = homeConfig.finalCta.cta,
  placement = 'final-cta',
  className,
}: FinalCtaProps) {
  return (
    <section aria-labelledby={`${placement}-title`} className={cn('w-full', className)}>
      <Container size="wide">
        <Reveal className="relative flex min-h-[17.5rem] flex-col justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-raised px-6 py-10 sm:min-h-[16.5rem] sm:px-10 md:px-12 md:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(32rem_18rem_at_100%_50%,rgb(113_52_244/0.16),transparent_70%)]"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="min-w-0 md:flex-1">
              {eyebrow ? <Eyebrow rule className="mb-4 text-violet-300">{eyebrow}</Eyebrow> : null}
              <h2 id={`${placement}-title`} className="text-display text-balance text-white lg:text-nowrap">
                {headline}
              </h2>
              <p className="prose-measure mt-4 text-lead text-text-secondary">{body}</p>
            </div>
            <ContactTrigger size="lg" placement={placement} interest={cta.interest} className="shrink-0 self-start md:self-auto">
              {cta.label}
            </ContactTrigger>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
