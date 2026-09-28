import type { CSSProperties } from 'react';
import { homeConfig } from '@/config/home.config';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

// CSSProperties has no index signature for custom properties, hence the cast.
const step = (n: number) => ({ '--enter-step': n }) as CSSProperties;

/**
 * Desktop: full-bleed FNX architecture behind a left-aligned editorial column.
 * Mobile: copy → actions → a separately composed portrait artwork → proof points.
 * One <picture> serves both; it is in flow on phones and a backdrop from 900px.
 * Entrance is CSS-only so the LCP never waits for JavaScript.
 */
export function Hero() {
  const { hero } = homeConfig;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="container-fnx pt-[calc(var(--header-height)+3rem)] md:static md:flex md:min-h-[clamp(40rem,100svh,62rem)] md:flex-col md:justify-end md:pt-[calc(var(--header-height)+6rem)] md:pb-14">
        <div className="max-w-[40rem] md:max-w-[56rem]">
          <Eyebrow style={step(0)} className="enter-rise">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" style={step(1)} className="enter-rise mt-6 text-display-xl text-text">
            <HeadlineLines lines={hero.headline} />
          </h1>
          <p style={step(2)} className="enter-rise mt-7 max-w-[34rem] text-lead text-text-secondary">
            {hero.body}
          </p>
          <div style={step(3)} className="enter-rise mt-10 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg" arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div
          className={[
            'enter-settle relative mt-14 aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[5/4]',
            'md:absolute md:inset-0 md:-z-10 md:mt-0 md:aspect-auto md:rounded-none',
          ].join(' ')}
        >
          <ResponsiveArt
            src={hero.art.src}
            mobileSrc={hero.art.mobileSrc}
            mobileMaxWidth={639}
            alt={hero.art.alt}
            priority
            quality={80}
            sizes="100vw"
            mobileSizes="100vw"
            imgClassName="object-[50%_58%] sm:object-[72%_50%]"
          />
          {/* Legibility veils (desktop only): left for the copy, bottom to melt into the page. */}
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-bg)_0%,rgb(6_7_8/0.82)_28%,rgb(6_7_8/0.2)_58%,transparent_75%)] md:block" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-[linear-gradient(0deg,var(--color-bg),transparent)] md:block" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-40 bg-[linear-gradient(180deg,rgb(6_7_8/0.7),transparent)] md:block" />
        </div>

        <ul
          style={step(4)}
          className="enter-rise mt-10 grid gap-px border-y border-border-subtle sm:grid-cols-3 md:mt-20 md:max-w-[44rem] md:border-b-0"
          aria-label="What FNX brings"
        >
          {hero.proofPoints.map((point, index) => (
            <li
              key={point}
              className="flex items-baseline gap-3 py-4 text-small font-medium text-text sm:py-5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle sm:[&:not(:first-child)]:border-t-0"
            >
              <span aria-hidden="true" className="text-[0.6875rem] font-semibold tabular-nums text-text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
