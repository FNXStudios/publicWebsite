'use client';

import { useEffect, useRef } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** Records one analytics event after mount (once, even under Strict Mode). Renders nothing. */
export function TrackOnMount({ event }: { event: AnalyticsEvent }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event);
  }, [event]);
  return null;
}
