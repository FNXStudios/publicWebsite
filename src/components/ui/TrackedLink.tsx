'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

type TrackedLinkProps = ComponentProps<typeof Link> & { event: AnalyticsEvent };

/** A Next <Link> that records one analytics event on activation. */
export function TrackedLink({ event, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event);
        onClick?.(e);
      }}
    />
  );
}

