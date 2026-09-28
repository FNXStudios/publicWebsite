import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { AnalyticsEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { ArrowRight } from './Icons';
import { TrackedLink } from './TrackedLink';

type TextLinkProps = ComponentProps<typeof Link> & {
  arrow?: boolean;
  /** Optional analytics event recorded on click. */
  event?: AnalyticsEvent;
};

/** Editorial link: no box, a quiet rule underneath and an arrow that leans forward. */
export function TextLink({ className, children, arrow = true, event, ...props }: TextLinkProps) {
  const classes = cn(
    'group/link inline-flex items-center gap-2 py-2 text-[0.9375rem] font-semibold text-text',
    'transition-colors duration-(--duration-micro) ease-premium hover:text-white',
    className,
  );
  const content = (
    <>
      <span className="border-b border-border-active pb-0.5 transition-colors duration-(--duration-micro) group-hover/link:border-current">
        {children}
      </span>
      {arrow ? <ArrowRight className="arrow-nudge size-4 group-hover/link:translate-x-1" /> : null}
    </>
  );
  return event ? (
    <TrackedLink event={event} className={classes} {...props}>
      {content}
    </TrackedLink>
  ) : (
    <Link className={classes} {...props}>
      {content}
    </Link>
  );
}
