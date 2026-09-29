'use client';

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Stage {
  title: string;
  body: string;
}

interface StageStoryProps {
  /** Accessible name for the stage set. */
  label: string;
  stages: Stage[];
  /** Server-rendered visual per stage (same order). */
  visuals: ReactNode[];
}

/**
 * One process, one media panel. Desktop: the four stages run across the full width;
 * choosing one (click or ←/→/Home/End) crossfades the artwork (~65%) and swaps the
 * active title and description (~35%). The stage row is the only navigation — no
 * counter, caption or "next" link competing with it. No sticky wrapper. Phones: a plain ordered
 * sequence, each stage with its own visual. Everything is server-rendered visible.
 */
export function StageStory({ label, stages, visuals }: StageStoryProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = stages.length;
  const current = stages[active];

  const select = (index: number, focus = false) => {
    const next = (index + count) % count;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: count - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, true);
  };

  return (
    <>
      {/* Desktop: stage row + one media panel */}
      <div className="hidden md:block">
        <div role="tablist" aria-label={label} className="relative grid grid-cols-4 gap-(--grid-gap)">
          {/* Active line: one bar that travels between stages. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 h-px w-[calc((100%-3*var(--grid-gap))/4)] bg-violet-400 transition-transform duration-[520ms] ease-premium motion-reduce:transition-none"
            style={
              {
                transform: `translateX(calc(${active} * (100% + var(--grid-gap))))`,
              } as CSSProperties
            }
          />
          {stages.map((stage, index) => {
            const on = index === active;
            return (
              <button
                key={stage.title}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${baseId}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                className="group/tab flex items-baseline gap-4 border-t border-white/[0.12] pt-5 pb-1 text-left focus-visible:outline-offset-4"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'text-[0.8125rem] font-semibold tabular-nums tracking-[0.06em] transition-colors duration-(--duration-standard)',
                    on ? 'text-violet-300' : 'text-text-muted group-hover/tab:text-text-secondary',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn('text-title transition-colors duration-(--duration-standard)', on ? 'text-white' : 'text-white/40 group-hover/tab:text-white/70')}>{stage.title}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="mt-12 grid grid-cols-[minmax(0,65fr)_minmax(0,35fr)] items-center gap-x-[clamp(2rem,4vw,5rem)] lg:mt-16"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.09] bg-raised">
            {visuals.map((visual, index) => (
              <div
                key={index}
                aria-hidden={index !== active}
                className={cn(
                  'absolute inset-0 transition-[opacity,transform] duration-[560ms] ease-premium motion-reduce:transition-none',
                  index === active ? 'scale-100 opacity-100' : 'scale-[1.012] opacity-0',
                )}
              >
                {visual}
              </div>
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_-80px_120px_-60px_rgb(0_0_0/0.5)]" />
          </div>

          <div aria-live="polite">
            <h3 className="text-display-sm text-white">{current?.title}</h3>
            <p className="prose-side mt-5 text-lead text-text-secondary">{current?.body}</p>
          </div>
        </div>
      </div>

      {/* Phones and small tablets: an ordered sequence */}
      <ol aria-label={label} className="grid gap-12 sm:grid-cols-2 sm:gap-x-(--grid-gap) sm:gap-y-14 md:hidden">
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-lg border border-white/[0.09] bg-raised">{visuals[index]}</div>
            <div className="mt-5 flex items-baseline gap-3">
              <span aria-hidden="true" className="text-[0.8125rem] font-semibold tabular-nums tracking-[0.06em] text-violet-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-title text-white">{stage.title}</h3>
            </div>
            <p className="prose-measure mt-2.5 text-body text-text-secondary">{stage.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
