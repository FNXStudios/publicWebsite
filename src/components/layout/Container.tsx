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

type Space = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const TOP: Record<Space, string> = { none: '', sm: 'pt-sec-sm', md: 'pt-sec-md', lg: 'pt-sec-lg', xl: 'pt-sec-xl' };
const BOTTOM: Record<Space, string> = { none: '', sm: 'pb-sec-sm', md: 'pb-sec-md', lg: 'pb-sec-lg', xl: 'pb-sec-xl' };

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** Id of the section's heading; gives the landmark an accessible name. */
  labelledBy?: string;
  /**
   * Semantic spacing. The gap between two sections is this section's `top` plus the
   * previous one's `bottom`: small when one section continues another, large when the
   * subject changes.
   */
  top?: Space;
  bottom?: Space;
}

/** A full-width page section (100% of the viewport). Content inside chooses its Container. */
export function Section({ labelledBy, top = 'md', bottom = 'md', className, children, ...props }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={cn('relative isolate w-full', TOP[top], BOTTOM[bottom], className)} {...props}>
      {children}
    </section>
  );
}
