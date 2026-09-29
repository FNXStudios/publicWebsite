'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/*
 * Scroll reveal: opacity + a 14px rise, once.
 *
 * Content is server-rendered VISIBLE. After hydration, an element that is still
 * below the fold is armed (data-reveal="pending") and shown when it nears the
 * viewport. Three independent triggers guarantee it can never stay hidden:
 *   1. a shared IntersectionObserver,
 *   2. a passive scroll/resize check (covers observers that never fire),
 *   3. `pageshow` / unmount / re-arm handling (bfcache, Strict Mode, router cache).
 * Reduced-motion users and browsers without IntersectionObserver never arm anything.
 */

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'figure';

const pending = new Set<HTMLElement>();
let observer: IntersectionObserver | undefined;
let listening = false;
let frame = 0;

function show(element: HTMLElement) {
  pending.delete(element);
  observer?.unobserve(element);
  element.dataset.reveal = 'shown';
}

function sweep() {
  frame = 0;
  const limit = window.innerHeight * 0.96;
  for (const element of pending) {
    const { top, bottom } = element.getBoundingClientRect();
    if (top < limit) show(element); // in view, or already scrolled past
    else if (bottom < 0) show(element);
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(sweep);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', () => {
    for (const element of [...pending]) show(element);
  });
}

function arm(element: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) show(entry.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  element.dataset.reveal = 'pending';
  pending.add(element);
  observer.observe(element);
  listen();
  schedule();
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Stagger offset in milliseconds. Keep small. */
  delay?: number;
}

export function Reveal({ children, className, as: Component = 'div', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    arm(element);
    return () => {
      // Whatever the lifecycle does (Strict Mode, Activity, unmount), leave it visible.
      pending.delete(element);
      observer?.unobserve(element);
      delete element.dataset.reveal;
    };
  }, []);

  // CSSProperties has no index signature for custom properties, hence the cast.
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Component ref={ref as never} className={className} style={style}>
      {children}
    </Component>
  );
}
