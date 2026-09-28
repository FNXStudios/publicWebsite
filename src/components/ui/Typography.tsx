import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Eyebrow({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={cn('text-eyebrow uppercase text-text-muted', className)} style={style}>
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
