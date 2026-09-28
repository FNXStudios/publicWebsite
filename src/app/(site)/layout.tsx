import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { navigationConfig } from '@/config/navigation.config';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header navigation={navigationConfig} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
