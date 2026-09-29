'use client';

import { useEffect, useRef, useState } from 'react';

interface ProcessStagesProps {
  label: string;
  stages: { title: string; body: string }[];
}

/**
 * Numbered process list. On desktop the stage nearest the middle of the screen becomes
 * prominent (number to violet, title brightens, rule draws); others stay readable.
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
    <ol aria-label={label} className="border-b border-white/[0.08]">
      {stages.map((stage, index) => (
        <li
          key={stage.title}
          ref={(el) => {
            refs.current[index] = el;
          }}
          data-index={index}
          data-active={index === active || undefined}
          className="group relative grid grid-cols-[3rem_1fr] gap-x-4 border-t border-white/[0.08] py-8 md:grid-cols-[4.5rem_1fr] md:py-10"
        >
          <span
            aria-hidden="true"
            className="absolute -top-px left-0 h-px w-0 bg-violet-400 transition-[width] duration-[640ms] ease-premium group-hover:w-24 group-data-active:w-24"
          />
          <span
            aria-hidden="true"
            className="pt-2 text-[0.8125rem] font-semibold tabular-nums text-text-muted transition-colors duration-(--duration-standard) group-hover:text-violet-300 group-data-active:text-violet-300"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] leading-[1.08] font-semibold tracking-[-0.028em] text-white/75 transition-[color,transform] duration-(--duration-standard) ease-premium group-hover:text-white group-data-active:text-white md:group-data-active:translate-x-1">
              {stage.title}
            </h3>
            <p className="mt-3 max-w-[34rem] text-body text-text-secondary">{stage.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
