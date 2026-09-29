import type { Metadata } from 'next';
import { routes } from '@/lib/routes';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { ButtonLink } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { Eyebrow } from '@/components/ui/Typography';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(34rem_30rem_at_80%_40%,rgb(113_52_244/0.14),transparent_70%)]" />
        <div className="container-wide flex min-h-[78svh] flex-col justify-center pt-(--header-height) pb-16">
          <Eyebrow rule>404</Eyebrow>
          <h1 className="mt-6 max-w-[16ch] text-display text-white">This page wandered off.</h1>
          <p className="mt-6 max-w-[30rem] text-lead text-text-secondary">
            The link may be old, or the page may have moved. The games are still where we left them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href={routes.games} size="lg" arrow>
              Explore games
            </ButtonLink>
            <TextLink href={routes.home} arrow={false}>
              Back to home
            </TextLink>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
