import type { ReactNode } from 'react';
import { ContactProvider } from '@/components/contact/ContactProvider';
import { contactDialogContent, contactOptions } from '@/config/contact.config';
import { navigationConfig } from '@/config/navigation.config';
import { siteConfig } from '@/config/site.config';
import { Footer } from './Footer';
import { Header } from './Header';

/** Header, footer and the global contact dialog around marketing content. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const rg = siteConfig.responsibleGaming;
  const direct = [
    ...(siteConfig.email ? [{ label: siteConfig.email, href: `mailto:${siteConfig.email}` }] : []),
    ...siteConfig.social,
  ];
  return (
    <ContactProvider interests={contactOptions.interests} copy={contactDialogContent} direct={direct}>
      <Header primary={navigationConfig.primary} ctaLabel={navigationConfig.contactLabel} notice={rg ? `${rg.ageLabel} · ${rg.label}` : undefined} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </ContactProvider>
  );
}
