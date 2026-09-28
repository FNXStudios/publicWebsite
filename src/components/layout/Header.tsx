'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavigationConfig } from '@/config/schema/site.schema';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import { ButtonLink } from '@/components/ui/Button';
import { CloseIcon, MenuIcon } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

/** Navigation arrives as props so this client module never bundles configuration or Zod. */
export function Header({ navigation }: { navigation: Pick<NavigationConfig, 'primary' | 'cta'> }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const { primary, cta } = navigation;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Route change closes the menu.
  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-(--header-height) border-b border-transparent',
        'transition-[background-color,border-color,backdrop-filter] duration-(--duration-standard) ease-premium',
        'data-scrolled:border-border-subtle data-scrolled:bg-bg/75 data-scrolled:backdrop-blur-md data-scrolled:backdrop-saturate-150',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-small"
      >
        Skip to content
      </a>
      <div className="container-fnx flex h-full items-center justify-between gap-8">
        <Link href={routes.home} className="-m-2 p-2" aria-label="FNX Studio — home">
          <Wordmark withDescriptor />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primary.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex h-10 items-center px-4 text-[0.9375rem] font-medium text-text-secondary',
                      'transition-colors duration-(--duration-micro) hover:text-text',
                      'aria-[current=page]:text-text',
                      'after:absolute after:inset-x-4 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current',
                      'after:transition-transform after:duration-(--duration-standard) after:ease-premium aria-[current=page]:after:scale-x-100',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={cta.href} variant="secondary" size="sm" className="hidden md:inline-flex" arrow>
            {cta.label}
          </ButtonLink>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-text md:hidden"
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            <MenuIcon className="size-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        className="mobile-menu m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-text backdrop:bg-black/60 md:hidden"
      >
        <div className="container-fnx flex h-(--header-height) items-center justify-between">
          <Link href={routes.home} className="-m-2 p-2" aria-label="FNX Studio — home" onClick={() => menuRef.current?.close()}>
            <Wordmark withDescriptor />
          </Link>
          <button
            type="button"
            autoFocus
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md"
            onClick={() => menuRef.current?.close()}
          >
            <CloseIcon className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="container-fnx flex flex-col pt-12 pb-10">
          <ul className="border-t border-border-subtle">
            {[...primary, cta].map((item) => (
              <li key={item.href} className="border-b border-border-subtle">
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  onClick={() => menuRef.current?.close()}
                  className="flex items-center justify-between py-5 text-display-md aria-[current=page]:text-accent-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
