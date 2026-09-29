import type { ReactNode } from 'react';

interface EmptyStateProps {
  headingId?: string;
  headline: string;
  body: string;
  /** The action — usually a ContactTrigger. */
  action: ReactNode;
}

/** An intentional "nothing here yet" state: statement left, context and action right. */
export function EmptyState({ headingId, headline, body, action }: EmptyStateProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-white/[0.08] bg-raised px-6 py-10 sm:px-10 md:grid md:grid-cols-12 md:items-center md:gap-8 md:px-14 md:py-14">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(30rem_18rem_at_0%_0%,rgb(240_189_114/0.07),transparent_70%),radial-gradient(30rem_18rem_at_100%_100%,rgb(113_52_244/0.14),transparent_70%)]" />
      <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10" />
      <h2 id={headingId} className="text-display-sm text-white md:col-span-6">
        {headline}
      </h2>
      <div className="mt-5 md:col-span-5 md:col-start-8 md:mt-0">
        <p className="text-body text-text-secondary">{body}</p>
        <div className="mt-7">{action}</div>
      </div>
    </div>
  );
}
