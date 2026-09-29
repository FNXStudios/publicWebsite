'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { readVerification, writeVerification } from '@/lib/age-gate/storage';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';

export interface AgeGateCopy {
  eyebrow: string;
  title: string;
  description: string;
  confirmLabel: string;
  rejectLabel: string;
  rejected: { title: string; description: string; backLabel: string };
  responsibleGamingLabel?: string;
  responsibleGamingUrl?: string;
}

interface AgeGateDialogProps {
  copy: AgeGateCopy;
  version: number;
  rememberDays: number;
  exitUrl?: string;
}

type Phase = 'question' | 'rejected' | 'leaving';

const EXIT_MS = 260;
const prevent = (event: Event) => event.preventDefault();

/**
 * Site-entry age confirmation on a Radix modal Dialog: focus trap, inert page and
 * dialog semantics come from Radix. It cannot be dismissed with Escape or an outside
 * click — only by answering. The blurred scrim is plain CSS (visible from first paint
 * while <html data-age-gate="pending">), so the page is never usable before hydration.
 *
 * Content arrives as props so this client module never bundles configuration or Zod.
 */
export function AgeGateDialog({ copy, version, rememberDays, exitUrl }: AgeGateDialogProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('question');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  // Decide on mount. The <head> script has usually decided already (data-age-gate),
  // but storage is re-checked so a blocked inline script can never skip the gate.
  useEffect(() => {
    const root = document.documentElement;
    if (readVerification(version)) {
      root.removeAttribute('data-age-gate');
      return;
    }
    root.setAttribute('data-age-gate', 'pending');
    // Opening after mount (not during render) keeps SSR and hydration identical.
    const id = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(id);
  }, [version]);

  useEffect(() => {
    if (phase === 'rejected') backRef.current?.focus();
    if (phase === 'question' && open) confirmRef.current?.focus();
  }, [phase, open]);

  const confirm = () => {
    writeVerification(version, rememberDays);
    const root = document.documentElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setPhase('leaving');
    root.setAttribute('data-age-gate', 'leaving');
    window.setTimeout(
      () => {
        setOpen(false);
        root.removeAttribute('data-age-gate');
      },
      reduced ? 0 : EXIT_MS,
    );
  };

  const reject = () => {
    if (exitUrl) {
      window.location.assign(exitUrl);
      return;
    }
    setPhase('rejected');
  };

  const rejected = phase === 'rejected';

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100]" />
        <Dialog.Content
          data-age-gate-dialog=""
          onEscapeKeyDown={prevent}
          onPointerDownOutside={prevent}
          onInteractOutside={prevent}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            confirmRef.current?.focus({ focusVisible: false } as FocusOptions);
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.getElementById('main')?.focus({ preventScroll: true });
          }}
          className="fnx-dialog fixed top-1/2 left-1/2 z-[101] w-[min(30rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto outline-none data-[phase=leaving]:opacity-0 data-[phase=leaving]:transition-opacity data-[phase=leaving]:duration-200"
          data-phase={phase}
        >
          <div className="relative isolate overflow-hidden rounded-xl border border-white/[0.09] bg-raised px-6 pt-8 pb-6 shadow-[0_40px_100px_rgb(0_0_0/0.6)] sm:px-10 sm:pt-10 sm:pb-8">
            {/* One controlled violet edge and the faintest bloom behind it. */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_4%,rgb(185_155_255/0.7)_30%,rgb(113_52_244/0.25)_64%,transparent_94%)]" />
            <div aria-hidden="true" className="absolute -top-28 -left-10 -z-10 h-56 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(113_52_244/0.22),transparent)]" />
            <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10 opacity-60" />

            <div className="flex items-center justify-between">
              <Wordmark className="h-6" />
              <span className="rounded-full border border-violet-border bg-violet-soft px-3 py-1 text-[0.75rem] font-bold tracking-[0.12em] text-violet-300">18+</span>
            </div>

            <div className="mt-10">
              <p className="flex items-center gap-3 text-eyebrow uppercase text-violet-300">
                <span aria-hidden="true" className="h-px w-5 bg-current" />
                {copy.eyebrow}
              </p>
              <Dialog.Title className="mt-4 text-display-sm text-text">
                {rejected ? copy.rejected.title : copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-4 max-w-[26rem] text-body text-text-secondary">
                {rejected ? copy.rejected.description : copy.description}
              </Dialog.Description>

              {rejected ? (
                <div className="mt-9">
                  <Button ref={backRef} variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => setPhase('question')}>
                    {copy.rejected.backLabel}
                  </Button>
                </div>
              ) : (
                <div className="mt-9 flex flex-col gap-3 sm:flex-row-reverse">
                  <Button ref={confirmRef} size="lg" className="sm:flex-1" onClick={confirm} disabled={phase === 'leaving'}>
                    {copy.confirmLabel}
                  </Button>
                  <Button variant="secondary" size="lg" className="sm:flex-1" onClick={reject} disabled={phase === 'leaving'}>
                    {copy.rejectLabel}
                  </Button>
                </div>
              )}
            </div>

            {copy.responsibleGamingLabel ? (
              <p className="mt-8 border-t border-white/[0.07] pt-5 text-[0.8125rem] text-text-muted">
                {copy.responsibleGamingUrl ? (
                  <a
                    href={copy.responsibleGamingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-text hover:decoration-current"
                  >
                    {copy.responsibleGamingLabel}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  copy.responsibleGamingLabel
                )}
              </p>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
