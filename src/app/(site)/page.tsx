import type { Metadata } from 'next';
import { Approach } from '@/components/home/Approach';
import { FeaturedGames } from '@/components/home/FeaturedGames';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { Operators } from '@/components/home/Operators';
import { Process } from '@/components/home/Process';
import { siteConfig } from '@/config/site.config';
import { jsonLdScript, organizationJsonLd, pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...pageMetadata({ path: '/' }),
  title: { absolute: `${siteConfig.name} — ${siteConfig.descriptor}` },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <Hero />
      <FeaturedGames />
      <Approach />
      <Process />
      <Operators />
      <FinalCta />
    </>
  );
}
