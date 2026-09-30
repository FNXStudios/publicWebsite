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
  /** Extra classes for the atmosphere layer (bleed, mask). */
  atmosphereClassName?: string;
  /** Fill the first screen and centre the type in the space under the header. */
  screen?: boolean;
  /** Keep configured headline breaks below 640px. */
  preserveLines?: boolean;
  /** Overrides the default hero size on the page title. */
  headlineClassName?: string;
  /** Overrides spacing on the supporting copy. */
  bodyClassName?: string;
  children?: ReactNode;
}

/**
 * Type B — editorial typographic opener for inner pages (Games, Careers).
 * Wide grid so the opener shares an edge with the visuals below. Compact type
 * and padding — mass without eating the viewport.
 */
export function PageIntro({
  eyebrow,
  headline,
  body,
  action,
  id,
  layout = 'stacked',
  className,
  atmosphere,
  atmosphereClassName,
  screen = false,
  preserveLines = false,
  headlineClassName,
  bodyClassName,
  children,
}: PageIntroProps) {
  const split = layout === 'split';
  const centered = layout === 'centered';
  return (
    <header className={cn('relative isolate w-full', screen && 'flex min-h-svh flex-col', className)}>
      {atmosphere ? <FullBleed className={cn('-bottom-40 fade-bottom', atmosphereClassName)}>{atmosphere}</FullBleed> : null}
      <Container
        size="wide"
        className={cn('pt-header', centered && 'flex flex-col items-center text-center', screen && 'flex flex-1 flex-col justify-center pb-16')}
      >
        {centered ? (
          <>
            <Eyebrow rule className="enter-rise justify-center">
              {eyebrow}
            </Eyebrow>
            <h1 id={id} className={cn('enter-rise mt-5 text-white [--enter-step:1]', headlineClassName ?? 'text-hero')}>
              <HeadlineLines lines={headline} preserve={preserveLines} />
            </h1>
            {body ? (
              <div className={cn('enter-rise mt-6 max-w-[40rem] space-y-4 text-lead text-text-secondary [--enter-step:2]', bodyClassName)}>{body}</div>
            ) : null}
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
