import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';
import { Container, FullBleed } from './Container';

interface PageIntroProps {
  eyebrow: string;
  headline: readonly string[];
  body?: ReactNode;
  /** Optional action under the body (e.g. a contact trigger). */
  action?: ReactNode;
  id?: string;
  className?: string;
  /**
   * `stacked`: headline at its natural width, supporting copy below (Games).
   * `split`: headline ~7 columns beside ~4 columns of copy, bottom-aligned (Careers).
   */
  layout?: 'stacked' | 'split';
  /** Decorative atmosphere painted edge to edge behind the intro. */
  atmosphere?: ReactNode;
  children?: ReactNode;
}

/**
 * Type B — editorial typographic opener for inner pages (Games, Careers).
 * Aligned to the wide grid so it shares an edge with the visuals below it. The headline
 * is never squeezed into a narrow column: either it runs at its natural width with the
 * copy below (stacked), or it takes ~7 columns beside the copy (split). Both give the
 * opener real visual mass without consuming a whole viewport.
 * Entrance is CSS-only (above the fold).
 */
export function PageIntro({ eyebrow, headline, body, action, id, layout = 'stacked', className, atmosphere, children }: PageIntroProps) {
  const split = layout === 'split';
  return (
    <header className={cn('relative isolate w-full', className)}>
      {atmosphere ? <FullBleed className="-bottom-40 fade-bottom">{atmosphere}</FullBleed> : null}
      <Container size="wide" className="pt-[calc(var(--header-height)+3.5rem)] md:pt-[calc(var(--header-height)+6.5rem)]">
        <div className={cn('grid-fnx gap-y-7', split && 'md:items-end')}>
          <div className={split ? 'md:col-span-7' : 'md:col-span-12'}>
            <Eyebrow rule className="enter-rise">
              {eyebrow}
            </Eyebrow>
            <h1 id={id} className="enter-rise mt-6 text-hero text-white [--enter-step:1] md:mt-7">
              <HeadlineLines lines={headline} />
            </h1>
          </div>
          {body || action ? (
            <div className={cn('enter-rise [--enter-step:2]', split ? 'md:col-span-4 md:col-start-9 md:pb-2' : 'md:col-span-12 md:mt-2')}>
              {body ? <div className={cn('text-lead text-text-secondary', split ? 'max-w-[30rem]' : 'max-w-[40rem]')}>{body}</div> : null}
              {action ? <div className="mt-7">{action}</div> : null}
            </div>
          ) : null}
        </div>
        {children}
      </Container>
    </header>
  );
}
