import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { AgeGate, AgeGateHeadScript } from '@/components/age-gate/AgeGate';
import { siteConfig } from '@/config/site.config';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

/** Manrope variable (latin subset), self-hosted — SIL Open Font License, see fonts/OFL-manrope.txt. */
const manrope = localFont({
  src: './fonts/manrope-latin-var.woff2',
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-manrope',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${siteConfig.name} — ${siteConfig.descriptor}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#050607',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The age-gate head script sets data-age-gate before hydration.
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <AgeGateHeadScript />
      </head>
      <body>
        {children}
        <AgeGate />
        <Analytics />
      </body>
    </html>
  );
}
