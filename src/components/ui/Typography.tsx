import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Eyebrow({
  children,
  className,
  style,
  rule = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** A short violet rule before the label, for section openers. */
  rule?: boolean;
  id?: string;
}) {
  return (
    <p id={id} className={cn('flex items-center gap-3 text-eyebrow uppercase text-text-muted', className)} style={style}>
      {rule ? <span aria-hidden="true" className="h-px w-6 bg-violet-400" /> : null}
      {children}
    </p>
  );
}

/**
 * Renders an art-directed headline. Each configured line breaks on screens ≥640px
 * and flows as a single sentence on phones, so wrapping never fights the composition.
 */
export function HeadlineLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <span key={line} className="headline-line">
      {line}
      {index < lines.length - 1 ? ' ' : null}
    </span>
  ));
}

/** Two-digit stage / item index ("01"). */
export function Index({ n, className }: { n: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('text-[0.8125rem] font-semibold tabular-nums tracking-[0.04em]', className)}>
      {String(n).padStart(2, '0')}
    </span>
  );
}
