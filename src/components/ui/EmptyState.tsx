import type { ReactNode } from 'react';
import { Eyebrow } from './Typography';

interface EmptyStateProps {
  headingId?: string;
  /** Optional section label above the statement. */
  eyebrow?: string;
  headline: string;
  body: string;
  /** The action — usually a ContactTrigger. */
  action: ReactNode;
}

/**
 * An intentional, compact "nothing here yet" state — editorial, not a card: a top rule,
 * the statement on the left, context and one action on the right. Never a full-height void.
 */
export function EmptyState({ headingId, eyebrow, headline, body, action }: EmptyStateProps) {
  return (
    <div className="grid-fnx gap-y-6 border-t border-white/[0.12] pt-8 md:items-end md:pt-10">
      <div className="md:col-span-6">
        {eyebrow ? (
          <Eyebrow rule className="mb-5">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2 id={headingId} className="text-display-sm text-white">
          {headline}
        </h2>
      </div>
      <div className="md:col-span-5 md:col-start-8">
        <p className="max-w-[30rem] text-lead text-text-secondary">{body}</p>
        <div className="mt-7">{action}</div>
      </div>
    </div>
  );
}
