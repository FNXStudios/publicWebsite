import { cn } from '@/lib/cn';

/**
 * FNX wordmark.
 * TODO(brand): replace the typeset mark with the official FNX logo SVG when supplied.
 */
export function Wordmark({ className, withDescriptor = false }: { className?: string; withDescriptor?: boolean }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2 leading-none', className)}>
      <span className="text-[1.375rem] font-extrabold tracking-[-0.04em] text-text">
        FN<span className="text-accent-text">X</span>
      </span>
      {withDescriptor ? (
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-text-muted">Studio</span>
      ) : null}
    </span>
  );
}
