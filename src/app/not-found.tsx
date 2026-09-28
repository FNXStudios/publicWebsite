import type { Metadata } from 'next';
import { routes } from '@/lib/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { navigationConfig } from '@/config/navigation.config';
import { ButtonLink } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header navigation={navigationConfig} />
      <main id="main" className="container-fnx flex min-h-[80svh] flex-col justify-center pt-(--header-height)">
        <p className="text-eyebrow uppercase text-text-muted">404</p>
        <h1 className="mt-6 max-w-[16ch] text-display-lg text-text">This page wandered off.</h1>
        <p className="mt-6 max-w-[30rem] text-lead text-text-secondary">
          The link may be old, or the page may have moved. The games are still where we left them.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href={routes.games} arrow>
            Explore games
          </ButtonLink>
          <TextLink href={routes.home} arrow={false}>
            Back to home
          </TextLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
