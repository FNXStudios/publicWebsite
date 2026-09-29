import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

interface PageIntroProps {
  eyebrow: string;
  headline: readonly string[];
  body?: ReactNode;
  id?: string;
  className?: string;
  /** Decorative atmosphere painted behind the intro. */
  atmosphere?: ReactNode;
  children?: ReactNode;
}

/** Opening block for inner pages. Entrance is CSS-only (above the fold). */
export function PageIntro({ eyebrow, headline, body, id, className, atmosphere, children }: PageIntroProps) {
  return (
    <header className={cn('relative isolate', className)}>
      {atmosphere ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          {atmosphere}
        </div>
      ) : null}
      <div className="container-fnx pt-[calc(var(--header-height)+3.5rem)] md:pt-[calc(var(--header-height)+6rem)]">
        <Eyebrow rule className="enter-rise">
          {eyebrow}
        </Eyebrow>
        <h1 id={id} className="enter-rise mt-6 text-hero text-white [--enter-step:1]">
          <HeadlineLines lines={headline} />
        </h1>
        {body ? <div className="enter-rise mt-7 max-w-[34rem] text-lead text-text-secondary [--enter-step:2]">{body}</div> : null}
        {children}
      </div>
    </header>
  );
}
