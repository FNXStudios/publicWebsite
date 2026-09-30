import type { CSSProperties } from 'react';
import { homeConfig } from '@/config/home.config';
import { Container, FullBleed } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

const step = (n: number) => ({ '--enter-step': n }) as CSSProperties;

/**
 * Immersive hero. `hero.png` is 16:9 (1672×941). From the md breakpoint the
 * section height tracks that ratio (`56.25vw` = 100vw / 16 × 9), so cover shows
 * the whole scene — mountains, island, doorway, mark — and only crops sky/water
 * on ultra-wide screens. A short scrim protects the type without painting the
 * left half black. Phones use the portrait file inside a taller frame.
 */
export function Hero() {
  const { hero } = homeConfig;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex w-full overflow-hidden bg-(--tone-hero) md:h-[clamp(32rem,56.25vw,52rem)]">
      <FullBleed>
        <div className="enter-settle absolute inset-0">
          <ResponsiveArt
            src={hero.art.src}
            mobileSrc={hero.art.mobileSrc}
            mobileMaxWidth={899}
            alt=""
            priority
            quality={80}
            sizes="100vw"
            imgClassName="h-full w-full max-w-none object-[center_46%] md:object-[center_58%]"
          />
        </div>
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(3_4_5/0.62)_0%,rgb(3_4_5/0.34)_14%,rgb(3_4_5/0.08)_28%,transparent_42%)] md:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_4_5/0.5)_0%,transparent_16%,transparent_48%,rgb(3_4_5/0.55)_72%,var(--tone-hero)_100%)] md:hidden" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[rgb(3_4_5/0.55)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden h-16 bg-linear-to-t from-(--tone-hero) to-transparent md:block" />
      </FullBleed>

      <Container size="wide" className="grid-fnx min-h-[min(34rem,100svh)] items-end pt-header pb-10 md:h-full md:min-h-0 md:items-center md:pb-16">
        <div className="max-w-[40rem] md:col-span-6">
          <Eyebrow rule style={step(0)} className="enter-rise text-text-secondary">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" style={step(1)} className="enter-rise mt-4 text-hero text-white md:mt-5">
            <HeadlineLines lines={hero.headline} />
          </h1>
          <p style={step(2)} className="enter-rise prose-measure mt-4 text-lead text-text-secondary md:mt-5">
            {hero.body}
          </p>
          <div style={step(3)} className="enter-rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-7">
            <ButtonLink href={hero.primaryCta.href} size="md" arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="md" variant="text" arrow>
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
