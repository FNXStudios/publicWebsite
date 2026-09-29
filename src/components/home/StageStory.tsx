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
 * Process panel on the wide 12-column grid. Tabs span full width; media (7) sits
 * beside copy (5) so edges match MadeToHit / Operators.
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
      <div className="hidden md:block">
        <div role="tablist" aria-label={label} className="relative grid grid-cols-4 gap-(--grid-gap)">
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
                className="group/tab flex items-baseline gap-3 border-t border-white/[0.12] pt-3.5 pb-1 text-left focus-visible:outline-offset-4"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'text-[0.75rem] font-semibold tabular-nums tracking-[0.06em] transition-colors duration-(--duration-standard)',
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
          className="mt-8 grid-fnx items-center lg:mt-10"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-raised md:col-span-7">
            {visuals.map((visual, index) => (
              <div
                key={index}
                aria-hidden={index !== active}
                className={cn(
                  'absolute inset-0 transition-[opacity,transform] duration-[560ms] ease-premium motion-reduce:transition-none',
                  index === active ? 'scale-100 opacity-100' : 'scale-[1.01] opacity-0',
                )}
              >
                {visual}
              </div>
            ))}
          </div>

          <div aria-live="polite" className="md:col-span-4 md:col-start-9">
            <h3 className="text-title text-white">{current?.title}</h3>
            <p className="prose-side mt-3 text-body text-text-secondary">{current?.body}</p>
          </div>
        </div>
      </div>

      <ol aria-label={label} className="grid gap-7 sm:grid-cols-2 sm:gap-x-(--grid-gap) sm:gap-y-8 md:hidden">
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-raised">{visuals[index]}</div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span aria-hidden="true" className="text-[0.75rem] font-semibold tabular-nums tracking-[0.06em] text-violet-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-title text-white">{stage.title}</h3>
            </div>
            <p className="mt-2 text-body text-text-secondary">{stage.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
