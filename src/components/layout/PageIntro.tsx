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
   * `stacked`: headline at its natural width, supporting copy below.
   * `split`: headline beside supporting copy, top-aligned.
   * `centered`: manifesto opener, centred on the wide grid (Games, Careers).
   */
  layout?: 'stacked' | 'split' | 'centered';
  /** Decorative atmosphere painted edge to edge behind the intro. */
  atmosphere?: ReactNode;
  children?: ReactNode;
}

/**
 * Type B — editorial typographic opener for inner pages (Games, Careers).
 * Wide grid so the opener shares an edge with the visuals below. Compact type
 * and padding — mass without eating the viewport.
 */
export function PageIntro({ eyebrow, headline, body, action, id, layout = 'stacked', className, atmosphere, children }: PageIntroProps) {
  const split = layout === 'split';
  const centered = layout === 'centered';
  return (
    <header className={cn('relative isolate w-full', className)}>
      {atmosphere ? <FullBleed className="-bottom-40 fade-bottom">{atmosphere}</FullBleed> : null}
      <Container
        size="wide"
        className={cn(
          'pt-[calc(var(--header-height)+2.5rem)] md:pt-[calc(var(--header-height)+4rem)]',
          centered && 'flex flex-col items-center pb-sec-sm text-center md:pb-sec-md',
        )}
      >
        {centered ? (
          <>
            <Eyebrow rule className="enter-rise justify-center">
              {eyebrow}
            </Eyebrow>
            <h1 id={id} className="enter-rise mt-5 text-hero text-white [--enter-step:1]">
              <HeadlineLines lines={headline} />
            </h1>
            {body ? <div className="enter-rise measure-reading mt-7 space-y-4 text-lead text-text-secondary [--enter-step:2] md:mt-8">{body}</div> : null}
            {action ? <div className="enter-rise mt-7 [--enter-step:3]">{action}</div> : null}
          </>
        ) : (
          <div className={cn('grid-fnx gap-y-5', split && 'md:items-start')}>
            <div className={split ? 'md:col-span-6' : 'md:col-span-12'}>
              <Eyebrow rule className="enter-rise">
                {eyebrow}
              </Eyebrow>
              <h1 id={id} className="enter-rise mt-4 text-hero text-white [--enter-step:1] md:mt-5">
                <HeadlineLines lines={headline} />
              </h1>
            </div>
            {body || action ? (
              <div className={cn('enter-rise [--enter-step:2]', split ? 'md:col-span-5 md:col-start-8 md:pt-10' : 'md:col-span-12 md:mt-1')}>
                {body ? <div className={cn('text-lead text-text-secondary', split ? 'max-w-[28rem]' : 'max-w-[36rem]')}>{body}</div> : null}
                {action ? <div className="mt-5">{action}</div> : null}
              </div>
            ) : null}
          </div>
        )}
        {children}
      </Container>
    </header>
  );
}
