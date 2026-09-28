import { ButtonLink } from './Button';

interface EmptyStateProps {
  headingId?: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
}

/** An intentional "nothing here yet" state: statement left, context and action right. */
export function EmptyState({ headingId, headline, body, cta }: EmptyStateProps) {
  return (
    <div className="border-t border-border-subtle pt-12 md:grid md:grid-cols-12 md:gap-6 md:pt-16">
      <h2 id={headingId} className="text-display-md text-text md:col-span-5">
        {headline}
      </h2>
      <div className="mt-6 md:col-span-5 md:col-start-7 md:mt-1">
        <p className="text-lead text-text-secondary">{body}</p>
        <ButtonLink href={cta.href} variant="secondary" className="mt-8" arrow>
          {cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
