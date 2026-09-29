'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import type { NavItem } from '@/config/schema/site.schema';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { ArrowRight, CloseIcon, MenuIcon } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

interface HeaderProps {
  primary: readonly NavItem[];
  ctaLabel: string;
  /** Small responsible-gaming line for the bottom of the mobile sheet. */
  notice?: string;
}

/**
 * Transparent over the hero, graphite glass once scrolled. Logo left, three
 * destinations centred, the global contact action right.
 * Navigation arrives as props so this client module never bundles configuration or Zod.
 */
export function Header({ primary, ctaLabel, notice }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-(--header-height) border-b border-transparent',
        'transition-[background-color,border-color,backdrop-filter] duration-(--duration-standard) ease-premium',
        'data-scrolled:border-white/[0.07] data-scrolled:bg-[rgb(4_5_7/0.8)] data-scrolled:backdrop-blur-[18px]',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-raised focus:px-4 focus:py-2 focus:text-small"
      >
        Skip to content
      </a>
      <div className="container-fnx grid h-full grid-cols-[1fr_auto] items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <Link href={routes.home} className="-m-2 justify-self-start rounded-md p-2 transition-opacity duration-(--duration-micro) hover:opacity-85" aria-label="FNX Studio — home">
          <Wordmark className="h-6 md:h-[1.625rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {primary.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex h-11 items-center rounded-md px-4 text-[0.9375rem] font-medium text-text-secondary',
                      'transition-colors duration-(--duration-interaction) ease-premium hover:text-text aria-[current=page]:text-text',
                    )}
                  >
                    {item.label}
                    {/* Hover: a rule draws in from the centre. Active: a short persistent violet rule. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute bottom-1.5 left-4 right-4 h-px origin-center scale-x-0 bg-white/60 transition-transform duration-(--duration-standard) ease-premium',
                        'group-hover:scale-x-100 group-focus-visible:scale-x-100',
                        active && 'left-1/2 right-auto w-4 -translate-x-1/2 scale-x-100 bg-violet-400 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <ContactTrigger placement="header" variant="secondary" size="sm" className="hidden md:inline-flex">
            {ctaLabel}
          </ContactTrigger>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-text transition-colors duration-(--duration-micro) hover:bg-white/[0.06] active:bg-white/[0.1] md:hidden">
              <MenuIcon className="size-6" />
              <span className="sr-only">Open menu</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                aria-describedby={undefined}
                className="fnx-sheet fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-deep text-text outline-none md:hidden"
              >
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(30rem_24rem_at_100%_100%,rgb(113_52_244/0.2),transparent_70%),radial-gradient(24rem_16rem_at_0%_0%,rgb(240_189_114/0.05),transparent_70%)]" />
                <div aria-hidden="true" className="fnx-diagonals pointer-events-none fixed inset-0 opacity-50" />
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="container-fnx relative flex h-(--header-height) shrink-0 items-center justify-between">
                  <Link href={routes.home} className="-m-2 p-2" aria-label="FNX Studio — home" onClick={() => setMenuOpen(false)}>
                    <Wordmark className="h-6" />
                  </Link>
                  <Dialog.Close className="-mr-1 inline-flex size-11 items-center justify-center rounded-full border border-white/[0.12] transition-colors duration-(--duration-micro) hover:border-white/25 hover:bg-white/[0.05] active:bg-white/[0.09]">
                    <CloseIcon className="size-5" />
                    <span className="sr-only">Close menu</span>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="container-fnx relative flex flex-1 flex-col pt-8 pb-8">
                  <ul className="border-t border-white/[0.08]">
                    {primary.map((item, index) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <li key={item.href} data-menu-item style={{ '--i': index } as CSSProperties} className="border-b border-white/[0.08]">
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            onClick={() => setMenuOpen(false)}
                            className="group flex min-h-[5.25rem] items-center justify-between gap-4 py-4 text-[2rem] leading-none font-semibold tracking-[-0.03em] text-text transition-colors duration-(--duration-micro) active:text-text-secondary"
                          >
                            <span className="flex items-baseline gap-4">
                              <span aria-hidden="true" className="w-6 text-[0.75rem] font-semibold tracking-normal tabular-nums text-text-muted group-aria-[current=page]:text-violet-400">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              {item.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className="grid size-11 place-items-center rounded-full border border-white/[0.12] text-text-secondary transition-[border-color,color,background-color] duration-(--duration-micro) group-hover:border-violet-border group-hover:text-text group-active:bg-white/[0.06] group-aria-[current=page]:border-violet-border group-aria-[current=page]:text-violet-300"
                            >
                              <ArrowRight className="arrow-nudge size-[1.0625rem] group-hover:translate-x-[3px]" />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div data-menu-item style={{ '--i': primary.length } as CSSProperties} className="mt-auto pt-12">
                    <ContactTrigger placement="mobile-menu" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                      {ctaLabel}
                    </ContactTrigger>
                    {notice ? <p className="mt-6 text-center text-[0.8125rem] text-text-muted">{notice}</p> : null}
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
