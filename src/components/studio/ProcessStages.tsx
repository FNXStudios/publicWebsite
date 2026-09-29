'use client';

import { useEffect, useRef, useState } from 'react';

interface ProcessStagesProps {
  label: string;
  stages: { title: string; body: string }[];
}

/**
 * Numbered process list with a thin connective spine.
 * On desktop the stage nearest the middle of the screen becomes prominent
 * (number to violet, title brightens, rule draws); others stay readable.
 * Server-rendered fully visible; the emphasis is progressive enhancement.
 */
export function ProcessStages({ label, stages }: ProcessStagesProps) {
  const [active, setActive] = useState(-1);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol aria-label={label} className="relative border-b border-white/[0.09]">
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[1.35rem] hidden w-px bg-white/[0.08] md:left-[2rem] md:block"
      />
      {stages.map((stage, index) => (
        <li
          key={stage.title}
          ref={(el) => {
            refs.current[index] = el;
          }}
          data-index={index}
          data-active={index === active || undefined}
          className="group relative grid grid-cols-[3rem_1fr] gap-x-4 border-t border-white/[0.09] py-7 md:grid-cols-[4.5rem_1fr] md:py-8"
        >
          <span
            aria-hidden="true"
            className="absolute -top-px left-0 h-px w-0 bg-violet-400 transition-[width] duration-[640ms] ease-premium group-hover:w-24 group-data-active:w-24"
          />
          <span
            aria-hidden="true"
            className="relative z-10 grid size-7 place-items-center rounded-full border border-white/[0.12] bg-section text-[0.75rem] font-semibold tabular-nums text-text-muted transition-[color,border-color,background-color] duration-(--duration-standard) group-hover:border-violet-border group-hover:text-violet-300 group-data-active:border-violet-border group-data-active:bg-violet-soft group-data-active:text-violet-300 md:size-8 md:text-[0.8125rem]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-[clamp(1.4rem,1.15rem+0.9vw,2rem)] leading-[1.1] font-semibold tracking-[-0.026em] text-white/75 transition-[color,transform] duration-(--duration-standard) ease-premium group-hover:text-white group-data-active:text-white md:group-data-active:translate-x-1">
              {stage.title}
            </h3>
            <p className="mt-2.5 max-w-[34rem] text-body text-text-secondary">{stage.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
