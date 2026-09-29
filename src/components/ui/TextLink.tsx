import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import type { AnalyticsEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { ArrowRight } from './Icons';
import { TrackedLink } from './TrackedLink';

/** Shared look for text actions ("View all games →"), links and buttons alike. */
export const textActionClass = cn(
  'group/link inline-flex items-center gap-2 rounded-sm py-2 text-[0.9375rem] font-semibold text-text/90',
  'transition-colors duration-(--duration-interaction) ease-premium hover:text-white focus-visible:text-white',
);

export function TextActionContent({ children, arrow = true }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative pb-1">
        {children}
        {/* A quiet resting rule; a brighter one draws across on hover. */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-(--duration-standard) ease-premium group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        />
      </span>
      {arrow ? <ArrowRight className="arrow-nudge size-4 group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1" /> : null}
    </>
  );
}

type TextLinkProps = ComponentProps<typeof Link> & {
  arrow?: boolean;
  /** Optional analytics event recorded on click. */
  event?: AnalyticsEvent;
};

/** Editorial link: no box, an animated rule and an arrow that leans forward. */
export function TextLink({ className, children, arrow = true, event, ...props }: TextLinkProps) {
  const content = <TextActionContent arrow={arrow}>{children}</TextActionContent>;
  return event ? (
    <TrackedLink event={event} className={cn(textActionClass, className)} {...props}>
      {content}
    </TrackedLink>
  ) : (
    <Link className={cn(textActionClass, className)} {...props}>
      {content}
    </Link>
  );
}
