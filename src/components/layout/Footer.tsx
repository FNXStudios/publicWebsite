import type { ReactNode } from 'react';
import Link from 'next/link';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { LinkedInIcon, MailIcon } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { navigationConfig } from '@/config/navigation.config';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/lib/routes';

const navLinkClass =
  'inline-flex cursor-pointer items-center py-1.5 text-small font-medium text-text-secondary transition-colors duration-(--duration-interaction) ease-premium hover:text-text focus-visible:text-text';

const iconLinkClass =
  'relative inline-flex text-text-muted transition-[color,transform] duration-(--duration-interaction) ease-premium before:absolute before:-inset-1.5 before:content-[""] hover:-translate-y-px hover:text-text focus-visible:-translate-y-px focus-visible:text-text';

/**
 * Quiet close: brand and destinations on one row, copyright and the
 * responsible-gaming line on the next. Contact icons stay unlabeled in the
 * layout; each link carries its own accessible name.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const rg = siteConfig.responsibleGaming;
  const linkedIn = siteConfig.social.find((item) => isLinkedIn(item.href));

  return (
    <footer className="relative bg-(--tone-footer)">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />
      <div className="container-wide pt-12 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pt-14 md:pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex w-full max-w-[22.5rem] flex-col gap-3.5">
            <Link href={routes.home} className="w-fit rounded-md" aria-label="FNX Studio — home">
              <Wordmark className="h-6 md:h-[1.625rem]" />
            </Link>
            <p className="text-small leading-snug text-text-muted">{siteConfig.footerLine}</p>
            {siteConfig.email || linkedIn ? (
              <ul className="flex w-fit items-center gap-3.5 leading-none">
                {siteConfig.email ? (
                  <li className="flex">
                    <IconLink href={`mailto:${siteConfig.email}`} label="Email FNX Studio" title={siteConfig.email}>
                      <MailIcon className="size-[1.125rem]" />
                    </IconLink>
                  </li>
                ) : null}
                {linkedIn ? (
                  <li className="flex">
                    <IconLink href={linkedIn.href} label="FNX Studio on LinkedIn" title="LinkedIn" external>
                      <LinkedInIcon className="size-[1.125rem]" />
                    </IconLink>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="md:pt-1">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 md:justify-end md:gap-x-8">
              {navigationConfig.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <ContactTrigger appearance="row" placement="footer" arrow={false} className={navLinkClass}>
                  Contact
                </ContactTrigger>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-3.5 flex flex-col gap-1.5 border-t border-white/[0.06] pt-3 text-[0.8125rem] leading-snug text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          {rg ? (
            <p>
              {rg.ageLabel}{' '}
              {rg.url ? (
                <a
                  href={rg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-text hover:decoration-current"
                >
                  {rg.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                rg.label
              )}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function IconLink({
  href,
  label,
  title,
  external,
  children,
}: {
  href: string;
  label: string;
  title: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={external ? `${label} (opens in a new tab)` : label}
      title={title}
      className={iconLinkClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function isLinkedIn(href: string) {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return host === 'linkedin.com' || host.endsWith('.linkedin.com');
  } catch {
    return false;
  }
}
