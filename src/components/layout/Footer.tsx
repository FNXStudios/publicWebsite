import Link from 'next/link';
import { navigationConfig } from '@/config/navigation.config';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/lib/routes';
import { Wordmark } from '@/components/ui/Wordmark';

const linkClass =
  'group inline-flex py-2 text-[0.9375rem] font-medium text-text-secondary transition-colors duration-(--duration-interaction) ease-premium hover:text-text';

/**
 * Compact close (~240px on desktop). Row 1: logo + one line left, horizontal
 * navigation right. Row 2: copyright and the responsible-gaming line.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const rg = siteConfig.responsibleGaming;
  const direct = [
    ...(siteConfig.email ? [{ label: 'Email', href: `mailto:${siteConfig.email}` }] : []),
    ...siteConfig.social,
  ];

  return (
    <footer className="relative bg-(--tone-footer)">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="container-wide flex flex-col gap-7 py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-7">
          <Link href={routes.home} className="-m-2 inline-block self-start rounded-md p-2" aria-label="FNX Studio — home">
            <Wordmark className="h-7" />
          </Link>
          <p className="max-w-[23rem] text-small text-text-muted md:border-l md:border-white/[0.08] md:pl-7">{siteConfig.footerLine}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-1">
            {navigationConfig.footer.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  <span className="link-rule">{item.label}</span>
                </Link>
              </li>
            ))}
            {direct.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass} {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="link-rule">{item.label}</span>
                  {item.href.startsWith('http') ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-wide flex flex-col gap-1.5 py-4 text-[0.8125rem] text-text-muted sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <p>
            © {year} {siteConfig.name}
          </p>
          {rg ? (
            <p>
              {rg.ageLabel}
              <span aria-hidden="true"> · </span>
              <span className="sr-only">. </span>
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
