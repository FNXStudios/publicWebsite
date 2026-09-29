import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * FNX composition widths (tokens in globals.css):
 *   reading  ~760px   long paragraphs, manifestos, forms
 *   content  ~1180px  two-column editorial, process, structured information
 *   focus    ~1320px  focused closers such as the CTA
 *   wide     ~1480px  games, portfolio grids, large artwork, header and footer
 * Full-bleed artwork is not a container: it sits on the section itself (see FullBleed).
 */
export type ContainerSize = 'reading' | 'content' | 'focus' | 'wide';

const SIZE: Record<ContainerSize, string> = {
  reading: 'container-reading',
  content: 'container-content',
  focus: 'container-focus',
  wide: 'container-wide',
};

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'size'>;

/** Owns width, max-width, horizontal gutters and centring. Pages never invent their own. */
export function Container<T extends ElementType = 'div'>({ as, size = 'content', className, children, ...props }: ContainerProps<T>) {
  const Component: ElementType = as ?? 'div';
  return (
    <Component className={cn(SIZE[size], className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * A decorative layer that fills its (relative) section edge to edge — hero art, world
 * imagery, atmosphere. Readable content stays in a Container above it.
 */
export function FullBleed({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      {children}
    </div>
  );
}
