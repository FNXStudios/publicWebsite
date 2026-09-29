import type { CSSProperties } from 'react';
import { homeConfig } from '@/config/home.config';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

// CSSProperties has no index signature for custom properties, hence the cast.
const step = (n: number) => ({ '--enter-step': n }) as CSSProperties;

/**
 * Cinematic opener. Desktop: ~44% copy, ~56% architecture — the FNX corridor with its
 * warm doorway, wet floor and a violet edge light — dissolving into the page through a
 * left veil, bottom fade and vignette. Phones: copy, actions, then the art.
 *
 * Entrance and ambience are CSS only, so LCP never waits for JavaScript and nothing
 * is ever hidden behind script. Reduced motion freezes everything at rest.
 */
export function Hero() {
  const { hero } = homeConfig;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-(--tone-hero)">
      {/* Desktop art: full bleed, weighted to the right. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block">
        <div className="enter-settle absolute inset-0">
          <div className="ambient-drift absolute inset-0">
            {/* Same sources as the phone art below, so each viewport downloads one file. */}
            <ResponsiveArt src={hero.art.src} mobileSrc={hero.art.mobileSrc} mobileMaxWidth={899} alt="" priority quality={80} sizes="100vw" imgClassName="object-[68%_50%]" />
          </div>
          {/* Doorway light breathes ±4%. */}
          <div className="ambient-breathe absolute inset-0 bg-[radial-gradient(20rem_24rem_at_68%_46%,rgb(240_189_114/0.16),transparent_70%)]" />
          <div className="ambient-breathe absolute inset-0 bg-[radial-gradient(30rem_44rem_at_102%_36%,rgb(113_52_244/0.22),transparent_70%)] [animation-delay:-3.5s]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--tone-hero)_0%,rgb(5_6_7/0.94)_24%,rgb(5_6_7/0.55)_44%,rgb(5_6_7/0.08)_64%,transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-(--tone-hero) to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[rgb(5_6_7/0.8)] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_45%,transparent_55%,rgb(3_4_5/0.6))]" />
      </div>

      {/* Phones: faint atmosphere behind the copy. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(28rem_26rem_at_90%_0%,rgb(113_52_244/0.16),transparent_70%)] md:hidden" />

      <div className="container-fnx flex flex-col pt-[calc(var(--header-height)+2.75rem)] md:min-h-[min(100svh,58rem)] md:justify-center md:pt-(--header-height) md:pb-16">
        <div className="max-w-[40rem] md:max-w-[54rem] md:pt-6">
          <Eyebrow rule style={step(0)} className="enter-rise text-text-secondary">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" style={step(1)} className="enter-rise mt-6 text-hero text-white md:mt-7">
            <HeadlineLines lines={hero.headline} />
          </h1>
          <p style={step(2)} className="enter-rise mt-6 max-w-[31rem] text-lead text-text-secondary md:mt-7">
            {hero.body}
          </p>
          <div style={step(3)} className="enter-rise mt-9 flex flex-wrap gap-3 md:mt-10">
            <ButtonLink href={hero.primaryCta.href} size="lg" arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary" arrow>
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {/* Phones: the art follows the actions, bleeding to the edges. */}
        <div aria-hidden="true" className="enter-settle relative -mx-(--gutter) mt-10 aspect-[4/5] max-h-[34rem] md:hidden">
          <ResponsiveArt src={hero.art.src} mobileSrc={hero.art.mobileSrc} mobileMaxWidth={899} alt="" priority quality={80} sizes="100vw" imgClassName="object-[56%_45%]" />
          <div className="ambient-breathe absolute inset-0 bg-[radial-gradient(12rem_14rem_at_56%_42%,rgb(240_189_114/0.16),transparent_70%)]" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-(--tone-hero) to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-(--tone-hero) to-transparent" />
        </div>

        <ul
          style={step(4)}
          className="enter-rise -mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-6 text-small text-text-secondary md:mt-20"
          aria-label="What FNX brings"
        >
          {hero.proofPoints.map((point, index) => (
            <li key={point} className="flex items-center gap-6" style={{ animationDelay: `${index * 45}ms` }}>
              {index > 0 ? <span aria-hidden="true" className="hidden h-3.5 w-px bg-white/20 sm:block" /> : null}
              <span className="flex items-center gap-2.5 font-medium">
                <span aria-hidden="true" className="size-1.5 rotate-45 bg-violet-400" />
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
