import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

interface PageIntroProps {
  eyebrow: string;
  headline: readonly string[];
  body?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Opening block for inner pages. Entrance is CSS-only (above the fold). */
export function PageIntro({ eyebrow, headline, body, className, children }: PageIntroProps) {
  return (
    <header className={cn('container-fnx pt-[calc(var(--header-height)+4rem)] md:pt-[calc(var(--header-height)+7rem)]', className)}>
      <Eyebrow className="enter-rise">{eyebrow}</Eyebrow>
      <h1 className="enter-rise mt-6 text-display-xl text-text [--enter-step:1]">
        <HeadlineLines lines={headline} />
      </h1>
      {body ? <div className="enter-rise mt-8 max-w-[36rem] text-lead text-text-secondary [--enter-step:2]">{body}</div> : null}
      {children}
    </header>
  );
}
