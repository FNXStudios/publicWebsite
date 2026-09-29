'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Stage {
  title: string;
  body: string;
}

interface StageStoryProps {
  /** Accessible name for the stage list. */
  label: string;
  stages: Stage[];
  /** Server-rendered visual per stage (same order). */
  visuals: ReactNode[];
  /** Caption shown under the sticky visual on desktop. */
  caption?: string;
}

/**
 * A scroll story without scroll-jacking. Desktop: the stage list scrolls normally while
 * a sticky frame crossfades to the stage nearest the middle of the screen; a hairline
 * tracks progress and the active number and title brighten. Phones: a plain vertical
 * sequence, every stage with its own visual. All content is server-rendered visible.
 */
export function StageStory({ label, stages, visuals, caption }: StageStoryProps) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    for (const el of itemRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: reducedRef.current ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  const progress = (active + 1) / stages.length;

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-6">
      <div className="relative md:col-span-5 lg:col-span-4">
        {/* Progress hairline (desktop) — CSS scale, no scroll-linked JS */}
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 hidden w-px bg-white/[0.08] md:block">
          <span
            className="absolute inset-x-0 top-0 block h-full origin-top bg-linear-to-b from-violet-400 to-violet-600 transition-transform duration-[640ms] ease-premium motion-reduce:transition-none"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>
        <ol ref={listRef} aria-label={label} className="flex flex-col gap-10 md:gap-0 md:pl-10">
          {stages.map((stage, index) => {
            const on = index === active;
            return (
              <li
                key={stage.title}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                data-index={index}
                data-active={on || undefined}
                className="group/stage md:flex md:min-h-[42vh] md:flex-col md:justify-center"
              >
                <div className="relative mb-5 aspect-[5/4] overflow-hidden rounded-lg border border-white/[0.09] bg-raised md:hidden">
                  {visuals[index]}
                </div>
                <span
                  aria-hidden="true"
                  className="block text-[0.8125rem] font-semibold tabular-nums tracking-[0.06em] text-violet-300 transition-colors duration-(--duration-standard) md:text-white/30 md:group-data-active/stage:text-violet-300"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-white transition-colors duration-(--duration-standard) md:text-white/35 md:group-data-active/stage:text-white">
                  {stage.title}
                </h3>
                <p className="mt-4 max-w-[26rem] text-body text-text-secondary transition-opacity duration-(--duration-standard) md:opacity-45 md:group-data-active/stage:opacity-100">
                  {stage.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Sticky frame (desktop) */}
      <div className="hidden md:col-span-7 md:col-start-6 md:block lg:col-span-8 lg:col-start-5">
        <div className="sticky top-[calc(var(--header-height)+2rem)]">
          <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Jump to stage">
            {stages.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                aria-current={index === active ? 'step' : undefined}
                onClick={() => goTo(index)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.09] px-3.5 text-[0.8125rem] font-semibold text-text-muted transition-[color,border-color,background-color] duration-(--duration-interaction) hover:border-white/20 hover:text-text aria-[current=step]:border-violet-border aria-[current=step]:bg-violet-soft aria-[current=step]:text-white"
              >
                <span className="tabular-nums opacity-70">{String(index + 1).padStart(2, '0')}</span>
                {stage.title}
              </button>
            ))}
          </div>
          <div className="relative aspect-[5/4] max-h-[calc(100svh-var(--header-height)-9.5rem)] w-full overflow-hidden rounded-xl border border-white/[0.09] bg-raised shadow-soft">
            {visuals.map((visual, index) => (
              <div
                key={index}
                aria-hidden={index !== active}
                className={cn(
                  'absolute inset-0 transition-[opacity,transform] duration-[640ms] ease-premium motion-reduce:transition-none',
                  index === active ? 'scale-100 opacity-100' : 'scale-[1.015] opacity-0',
                )}
              >
                {visual}
              </div>
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.04),inset_0_-80px_120px_-60px_rgb(0_0_0/0.6)]"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
              <span className="tabular-nums text-violet-300">{String(active + 1).padStart(2, '0')}</span>
              {stages[active]?.title}
            </div>
          </div>
          {caption ? <p className="mt-4 text-small text-text-muted">{caption}</p> : null}
        </div>
      </div>
    </div>
  );
}
