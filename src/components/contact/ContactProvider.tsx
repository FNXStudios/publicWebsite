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
 * The one "Get in touch" experience. Every contact action opens this surface over
 * the current page. Phones get a full-viewport sheet; wider screens get a centered dialog.
 * `/contact` redirects to `/?contact=open`. `?interest=` preselects a topic.
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

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('contact') !== 'open') return;
    const interest = url.searchParams.get('interest') ?? '';
    url.searchParams.delete('contact');
    url.searchParams.delete('interest');
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
            className="fnx-contact fixed inset-0 z-[81] flex w-full flex-col overflow-hidden bg-section outline-none md:inset-auto md:top-1/2 md:left-1/2 md:h-auto md:max-h-[min(52rem,calc(100svh-3rem))] md:w-[min(66rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-white/[0.09] md:shadow-[0_40px_120px_rgb(0_0_0/0.55)]"
          >
            <Dialog.Close className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-10 grid size-11 place-items-center rounded-full border border-white/[0.12] bg-section/80 text-text backdrop-blur-md transition-[background-color,border-color] duration-(--duration-micro) hover:border-white/25 hover:bg-white/[0.06] md:top-4 md:right-4 md:bg-deep/70">
              <CloseIcon className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            <div className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain md:max-h-[inherit] md:flex-none">
              <div className="grid w-full md:grid-cols-12 md:items-start">
                <div className="relative isolate overflow-hidden px-6 pt-[max(4.75rem,calc(env(safe-area-inset-top)+3.75rem))] pb-6 sm:px-10 md:col-span-5 md:px-10 md:pt-12 md:pb-12 lg:px-12">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(26rem_18rem_at_0%_-20%,rgb(113_52_244/0.32),transparent_72%)] md:hidden"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 hidden bg-[radial-gradient(34rem_28rem_at_-10%_110%,rgb(113_52_244/0.26),transparent_65%),radial-gradient(22rem_16rem_at_0%_0%,rgb(240_189_114/0.06),transparent_70%)] md:block"
                  />
                  <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10 hidden opacity-70 md:block" />
                  <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent via-white/10 to-transparent md:block" />
                  <Eyebrow rule className="text-violet-300">
                    {copy.eyebrow}
                  </Eyebrow>
                  <Dialog.Title className="mt-4 text-display-sm text-text md:mt-5">{copy.title}</Dialog.Title>
                  <p className="mt-4 max-w-[26rem] text-body text-text-secondary md:mt-5">{copy.body}</p>
                  <p className="mt-5 border-t border-white/[0.07] pt-5 text-small text-text-muted md:mt-8 md:pt-6">{copy.note}</p>
                  {direct.length ? (
                    <div className="mt-6 md:mt-8">
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

                <div className="px-6 pt-2 pb-[max(2.75rem,env(safe-area-inset-bottom))] sm:px-10 md:col-span-7 md:px-10 md:pt-16 md:pb-12 lg:px-12">
                  <ContactForm key={state.session} interests={interests} copy={copy.form} defaultInterest={state.interest} />
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ContactContext.Provider>
  );
}
