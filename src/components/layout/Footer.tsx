import Link from 'next/link';
import { navigationConfig } from '@/config/navigation.config';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/lib/routes';
import { Wordmark } from '@/components/ui/Wordmark';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-subtle">
      <div className="container-fnx grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href={routes.home} className="-m-2 inline-block p-2" aria-label="FNX Studio — home">
            <Wordmark withDescriptor />
          </Link>
          <p className="mt-5 max-w-[22rem] text-small text-text-secondary">{siteConfig.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 md:grid-cols-1">
            {navigationConfig.footer.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1.5 text-small text-text-secondary transition-colors duration-(--duration-micro) hover:text-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {siteConfig.email || siteConfig.social.length ? (
          <div className="flex flex-col gap-1 md:col-span-3">
            {siteConfig.email ? (
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-block py-1.5 text-small text-text-secondary transition-colors hover:text-text"
              >
                {siteConfig.email}
              </a>
            ) : null}
            {siteConfig.social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-block py-1.5 text-small text-text-secondary transition-colors hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="container-fnx flex flex-col gap-2 border-t border-border-subtle py-6 text-[0.8125rem] text-text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {siteConfig.name}
        </p>
        {siteConfig.footerNotice ? <p>{siteConfig.footerNotice}</p> : null}
      </div>
    </footer>
  );
}
