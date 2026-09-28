'use client';

import type { CSSProperties, ReactNode } from 'react';

/*
 * Scroll reveal: opacity + a 14px rise, once, driven by one shared
 * IntersectionObserver and the motion tokens in globals.css.
 *
 * Content is rendered visible on the server. Only elements that are still below
 * the fold after hydration are hidden and then revealed, so there is no flash,
 * nothing depends on JavaScript to become visible, and reduced-motion users get
 * static content.
 */

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'figure';

let observer: IntersectionObserver | undefined;
const callbacks = new WeakMap<Element, () => void>();

function observe(element: Element, onEnter: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  callbacks.set(element, onEnter);
  observer.observe(element);
  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}

function prepare(element: HTMLElement | null) {
  if (!element || element.dataset.reveal) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen
  element.dataset.reveal = 'pending';
  return observe(element, () => {
    element.dataset.reveal = 'shown';
  });
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Stagger offset in milliseconds. Keep small. */
  delay?: number;
}

export function Reveal({ children, className, as: Component = 'div', delay = 0 }: RevealProps) {
  // CSSProperties has no index signature for custom properties, hence the cast.
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Component ref={prepare} className={className} style={style}>
      {children}
    </Component>
  );
}
