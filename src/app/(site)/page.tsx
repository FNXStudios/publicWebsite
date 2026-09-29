import type { Metadata } from 'next';
import { FeaturedGames } from '@/components/home/FeaturedGames';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { IdeaToGame } from '@/components/home/IdeaToGame';
import { MadeToHit } from '@/components/home/MadeToHit';
import { Operators } from '@/components/home/Operators';
import { siteConfig } from '@/config/site.config';
import { jsonLdScript, organizationJsonLd, pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...pageMetadata({ path: '/' }),
  title: { absolute: `${siteConfig.name} — ${siteConfig.descriptor}` },
};

/** Hero → Featured games → Made to hit → From idea to game → For operators → Final CTA. */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <Hero />
      <FeaturedGames />
      <MadeToHit />
      <IdeaToGame />
      <Operators />
      <FinalCta />
    </>
  );
}
