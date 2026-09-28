import { homeConfig } from '@/config/home.config';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/motion/Reveal';

interface FinalCtaProps {
  headline?: string;
  body?: string;
  cta?: { label: string; href: string };
}

/** Contained horizontal close. Shared by the homepage and Studio page. */
export function FinalCta({
  headline = homeConfig.finalCta.headline,
  body = homeConfig.finalCta.body,
  cta = homeConfig.finalCta.cta,
}: FinalCtaProps) {
  return (
    <section aria-labelledby="final-cta-title" className="pb-(--section-space)">
      <div className="container-fnx">
        <Reveal className="relative isolate overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated px-6 py-12 sm:px-10 md:px-16 md:py-20">
          <div
            aria-hidden="true"
            className="absolute -right-40 -bottom-56 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(233_168_109/0.13),transparent)]"
          />
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[36rem]">
              <h2 id="final-cta-title" className="text-display-lg text-text">
                {headline}
              </h2>
              <p className="mt-5 text-lead text-text-secondary">{body}</p>
            </div>
            <ButtonLink href={cta.href} size="lg" arrow className="self-start md:self-auto">
              {cta.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
