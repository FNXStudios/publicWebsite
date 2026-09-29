import type { CSSProperties } from 'react';
import { homeConfig } from '@/config/home.config';
import { Container, FullBleed } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

// CSSProperties has no index signature for custom properties, hence the cast.
const step = (n: number) => ({ '--enter-step': n }) as CSSProperties;

/**
 * Type A — immersive visual hero. The section is the full viewport width and the art
 * fills it edge to edge (absolute, object-cover); only the copy sits on the wide grid.
 *
 * Desktop: the architecture — doorway, FNX mark, tree — lives in the right half and
 * runs to the right viewport edge. A left-weighted veil protects the copy (~40% of the
 * width) without dimming the art evenly; a separate bottom fade leads into Featured Games.
 * Phones: the portrait composition fills the hero and the copy sits in its lower third.
 *
 * Entrance and ambience are CSS only, so LCP never waits for JavaScript.
 */
export function Hero() {
  const { hero } = homeConfig;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex w-full overflow-hidden bg-(--tone-hero)">
      <FullBleed>
        <div className="enter-settle absolute inset-0">
          <div className="ambient-drift absolute inset-0">
            <ResponsiveArt
              src={hero.art.src}
              mobileSrc={hero.art.mobileSrc}
              mobileMaxWidth={899}
              alt=""
              priority
              quality={80}
              sizes="100vw"
              imgClassName="h-full w-full object-[50%_30%] md:object-[72%_50%]"
            />
          </div>
          {/* Doorway light breathes ±4%. */}
          <div className="ambient-breathe absolute inset-0 bg-[radial-gradient(14rem_18rem_at_58%_30%,rgb(240_189_114/0.14),transparent_70%)] md:bg-[radial-gradient(20rem_24rem_at_66%_46%,rgb(240_189_114/0.14),transparent_70%)]" />
        </div>
        {/* Desktop: protect the text side only. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(3_4_5/0.98)_0%,rgb(3_4_5/0.92)_24%,rgb(3_4_5/0.6)_42%,rgb(3_4_5/0.15)_70%,transparent_100%)] md:block" />
        {/* Phones: the copy sits low, so the veil rises from the bottom. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(3_4_5/0.55)_0%,transparent_22%,transparent_36%,rgb(3_4_5/0.78)_58%,var(--tone-hero)_86%)] md:hidden" />
        {/* Header legibility + the fade into the next section. */}
        <div className="absolute inset-x-0 top-0 hidden h-36 bg-linear-to-b from-[rgb(3_4_5/0.7)] to-transparent md:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-[28%] bg-linear-to-t from-(--tone-hero) to-transparent md:block" />
      </FullBleed>

      <Container
        size="wide"
        className="flex min-h-[max(40rem,calc(100svh-4rem))] flex-col justify-end pt-[calc(var(--header-height)+2rem)] pb-10 sm:min-h-[44rem] md:min-h-[clamp(44rem,78vh,58rem)] md:justify-center md:pt-(--header-height) md:pb-16"
      >
        <div className="max-w-[40rem] md:max-w-[53rem]">
          <Eyebrow rule style={step(0)} className="enter-rise text-text-secondary">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" style={step(1)} className="enter-rise mt-6 text-hero text-white md:mt-7">
            <HeadlineLines lines={hero.headline} />
          </h1>
          <p style={step(2)} className="enter-rise mt-6 max-w-[34rem] text-lead text-text-secondary md:mt-7">
            {hero.body}
          </p>
          <div style={step(3)} className="enter-rise mt-8 flex flex-wrap gap-3 md:mt-10">
            <ButtonLink href={hero.primaryCta.href} size="lg" arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary" arrow>
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
