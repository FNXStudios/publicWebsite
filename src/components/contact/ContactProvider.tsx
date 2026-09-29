'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ContactInterest } from '@/config/schema/contact.schema';
import { track } from '@/lib/analytics';
import { iconForDirectLink } from '@/lib/site/direct-link-icon';
import { CloseIcon } from '@/components/ui/Icons';
import { Eyebrow } from '@/components/ui/Typography';
import { ContactForm, type ContactFormCopy } from './ContactForm';

export interface ContactDialogCopy {
  eyebrow: string;
  title: string;
  body: string;
  /** Small reassurance under the intro, e.g. how replies work. */
  note: string;
  directHeading: string;
  form: ContactFormCopy;
}

interface DirectLink {
  label: string;
  href: string;
}

interface ContactContextValue {
  open: (options?: { interest?: string; placement?: string }) => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

/** Opens the global contact dialog. Outside the provider it is a no-op, never a crash. */
export function useContact(): ContactContextValue {
  return useContext(ContactContext) ?? { open: () => {} };
}

interface ContactProviderProps {
  children: ReactNode;
  interests: readonly ContactInterest[];
  copy: ContactDialogCopy;
  /** Public email / profiles — only rendered when configured. */
  direct: DirectLink[];
}

/**
 * The one "Get in touch" experience. Every contact action on the site opens this
 * dialog over the current page; there is no public /contact page (the old URL
 * redirects to `/?contact=open` and lands here).
 *
 * Content arrives as props so this client module never bundles configuration or Zod.
 */
export function ContactProvider({ children, interests, copy, direct }: ContactProviderProps) {
  const [state, setState] = useState<{ open: boolean; interest: string; session: number }>({ open: false, interest: '', session: 0 });

  // The element that opened the dialog; focus returns there on close.
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback<ContactContextValue['open']>((options) => {
    opener.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    setState((prev) => ({ open: true, interest: options?.interest ?? '', session: prev.session + 1 }));
    track({ name: 'contact_opened', props: { interest: options?.interest ?? 'none', placement: options?.placement ?? 'unknown' } });
  }, []);

  // Deep links: /?contact=open (the old /contact URL) or #contact, optionally with ?interest=…
  useEffect(() => {
    const url = new URL(window.location.href);
    const wanted = url.searchParams.has('contact') || url.hash === '#contact';
    if (!wanted) return;
    const interest = url.searchParams.get('interest') ?? (url.searchParams.get('contact') !== 'open' ? url.searchParams.get('contact') ?? '' : '');
    url.searchParams.delete('contact');
    url.searchParams.delete('interest');
    if (url.hash === '#contact') url.hash = '';
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    // Deferred so it runs after hydration has settled (and never during render).
    const id = window.setTimeout(() => open({ interest, placement: 'deep-link' }), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      <Dialog.Root open={state.open} onOpenChange={(next) => setState((prev) => ({ ...prev, open: next }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fnx-overlay z-[80]" />
          <Dialog.Content
            aria-describedby={undefined}
            // Focus the dialog itself, not the first field: no keyboard pop on phones,
            // and screen readers start at the title. Tab reaches the form next.
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              (event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
            }}
            onCloseAutoFocus={(event) => {
              // Triggers live outside the dialog (header, sections, mobile menu), so
              // return focus to the one that opened it — or to main if it has gone.
              event.preventDefault();
              const target = opener.current?.isConnected ? opener.current : document.getElementById('main');
              target?.focus({ preventScroll: true });
            }}
            className="fnx-dialog fixed inset-0 z-[81] block overflow-y-auto overscroll-contain bg-section outline-none md:flex md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[calc(100dvh-3rem)] md:w-[min(66rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-white/[0.09] md:shadow-[0_40px_120px_rgb(0_0_0/0.55)]"
          >
            <div className="grid min-h-full w-full md:grid-cols-[38fr_62fr]">
              {/* Left: statement, lit from the side */}
              <div className="relative isolate overflow-hidden px-6 pt-20 pb-8 sm:px-10 md:px-10 md:py-12 lg:px-12">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[radial-gradient(34rem_28rem_at_-10%_110%,rgb(113_52_244/0.26),transparent_65%),radial-gradient(22rem_16rem_at_0%_0%,rgb(240_189_114/0.06),transparent_70%)]"
                />
                <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10 opacity-70" />
                <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent via-white/10 to-transparent md:block" />
                <Eyebrow rule className="text-violet-300">
                  {copy.eyebrow}
                </Eyebrow>
                <Dialog.Title className="mt-6 max-w-[18ch] text-display-sm text-text">{copy.title}</Dialog.Title>
                <p className="mt-5 max-w-[26rem] text-body text-text-secondary">{copy.body}</p>
                <p className="mt-8 hidden border-t border-white/[0.07] pt-6 text-small text-text-muted md:block">{copy.note}</p>
                {direct.length ? (
                  <div className="mt-8">
                    <p className="text-eyebrow uppercase text-text-muted">{copy.directHeading}</p>
                    <ul className="mt-3 space-y-1">
                      {direct.map((link) => {
                        const Icon = iconForDirectLink(link.href);
                        return (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="group inline-flex items-center gap-2.5 py-1.5 text-body font-medium text-text"
                            >
                              {Icon ? <Icon className="size-[1.05em] shrink-0 text-text-secondary transition-colors group-hover:text-text" /> : null}
                              <span className="link-rule">{link.label}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Right: the form */}
              <div className="px-6 pb-10 sm:px-10 md:px-10 md:py-12 lg:px-12">
                <ContactForm key={state.session} interests={interests} copy={copy.form} defaultInterest={state.interest} />
              </div>
            </div>

            <Dialog.Close className="fixed top-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-white/[0.12] bg-deep/70 text-text backdrop-blur-sm transition-[background-color,border-color] duration-(--duration-micro) hover:border-white/25 hover:bg-white/[0.06] md:absolute">
              <CloseIcon className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ContactContext.Provider>
  );
}
