import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/** The site's content column: max ~1376px plus fluid gutters. */
export function Container<T extends ElementType = 'div'>({ as, className, children, ...props }: ContainerProps<T>) {
  const Component: ElementType = as ?? 'div';
  return (
    <Component className={cn('container-fnx', className)} {...props}>
      {children}
    </Component>
  );
}

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** Id of the section's heading; gives the landmark an accessible name. */
  labelledBy?: string;
  spacing?: 'default' | 'none';
}

/** A page section with the shared vertical rhythm. */
export function Section({ labelledBy, spacing = 'default', className, children, ...props }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={cn(spacing === 'default' && 'section-space', className)} {...props}>
      {children}
    </section>
  );
}
